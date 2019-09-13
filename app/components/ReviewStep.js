import React, { Component } from 'react';
import { at, values } from 'lodash';
import TextField, { Input } from '@material/react-text-field';

import XlsxManager from '../utils/xlsxManager';

import style from './ReviewStep.scss';

type ComponentProps = {};

type Props = ComponentProps;

class ReviewStep extends Component<Props> {
  indexMatchesIdColumn = (index, columnName) => {
    const { importData } = this.props;
    const { patientOrLabRecordId, columnsToKeep } = importData;
    return patientOrLabRecordId[columnsToKeep[index]] === columnName;
  };

  columnName = (column, index) => {
    if (!column.v) {
      return `Column ${column.c}`;
    }
    if (column.v === 'Manual Patient Id') {
      return column.v;
    }
    if (this.indexMatchesIdColumn(index, 'patientId')) {
      return (
        <>
          {column.v}
          <br />
          (Patient ID)
        </>
      );
    }
    if (this.indexMatchesIdColumn(index, 'labRecordId')) {
      return (
        <>
          {column.v}
          <br />
          (Lab Record ID)
        </>
      );
    }
    return `${column.c} - ${column.v}`;
  };

  handleRowChange = (rowIndex, cellIndex) => e => {
    const { importData, onChange } = this.props;
    const { rows } = importData;
    const newRows = [...rows];
    newRows[rowIndex][cellIndex] = { w: e.target.value };
    onChange({
      rows: newRows
    });
  };

  static defaultProps: Props = {
    onChange: () => {},
    withPatientOrLabRecordId: true
  };

  componentDidMount() {
    const { importData, onChange, withPatientOrLabRecordId } = this.props;
    const {
      file,
      dataRowsFrom,
      dataRowsTo,
      patientOrLabRecordId,
      phi,
      date
    } = importData;
    const sheet = new XlsxManager(file.path);
    const headerRow = sheet.row(importData.headerRow - 1);
    let rows = sheet.rows(dataRowsFrom - 1, dataRowsTo - 1);
    const columnsToKeep = headerRow.reduce((acc, current, index) => {
      if (patientOrLabRecordId[index] || phi[index] || date[index])
        acc.push(index);
      return acc;
    }, []);
    if (
      withPatientOrLabRecordId &&
      !values(patientOrLabRecordId).some(i => i === 'patientId')
    ) {
      headerRow.push({ v: 'Manual Patient Id', w: 'Manual Patient Id' });
      date.push(null);
      phi.push(false);
      rows = rows.map(row => [...row, { v: '', w: '' }]);
      columnsToKeep.push(headerRow.length - 1);
      patientOrLabRecordId[headerRow.length - 1] = 'patientId';
    }

    onChange({
      columns: columnsToKeep.map(index => headerRow[index]),
      columnsToKeep,
      rows,
      patientOrLabRecordId,
      phi,
      date
    });
  }

  render() {
    const {
      importData,
      withPatientOrLabRecordId,
      title,
      subtitle
    } = this.props;
    const { columns, rows, patientOrLabRecordId, columnsToKeep } = importData;

    if (!patientOrLabRecordId || !columnsToKeep) {
      return <></>;
    }

    return (
      <div>
        {/* TODO Remove this text for pharmacy */}
        <h2>{title}</h2>
        <h4>{subtitle}</h4>
        <table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  className={style.centered}
                  key={`column-patient-id-${index}`}
                >
                  {this.columnName(column, index)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {at(row, columnsToKeep).map((cell, index) => (
                  // eslint-disable-next-line
                  <td className={style.centered} key={`td-${index}`}>
                    {withPatientOrLabRecordId &&
                    this.indexMatchesIdColumn(index, 'patientId') ? (
                      <TextField>
                        <Input
                          type="text"
                          value={cell.w}
                          onChange={this.handleRowChange(
                            rowIndex,
                            columnsToKeep[index]
                          )}
                        />
                      </TextField>
                    ) : (
                      cell.w
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ReviewStep;
