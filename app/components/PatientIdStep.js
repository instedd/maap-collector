import React, { Component } from 'react';
import TextField, { Input } from '@material/react-text-field';

import XlsxManager from '../utils/xlsxManager';
import { setPatientIdData } from '../actions/labRecordImport';

type ComponentProps = {};

type Props = ComponentProps;

class PatientIdStep extends Component<Props> {
  handleRowChange = (rowIndex, cellIndex) => e => {
    const { labRecordImport, dispatch } = this.props;
    const { rows } = labRecordImport;
    const newRows = [...rows];
    newRows[rowIndex][cellIndex] = { w: e.target.value };
    dispatch(
      setPatientIdData({
        rows: newRows
      })
    );
  };

  componentDidMount() {
    const { labRecordImport, dispatch } = this.props;
    const {
      file,
      dataRowsFrom,
      dataRowsTo,
      patientOrLabRecordId,
      phi,
      date
    } = labRecordImport;
    const sheet = new XlsxManager(file.path);
    const headerRow = sheet.row(labRecordImport.headerRow - 1);
    const rows = sheet.rows(dataRowsFrom - 1, dataRowsTo - 1);
    const columnsToKeep = headerRow.reduce((acc, current, index) => {
      if (patientOrLabRecordId[index] || phi[index] || date[index])
        acc.push(index);
      return acc;
    }, []);

    dispatch(
      setPatientIdData({
        columns: columnsToKeep.map(index => headerRow[index]),
        rows: rows.map(row => columnsToKeep.map(index => row[index]))
      })
    );
  }

  render() {
    const { labRecordImport } = this.props;
    const { columns, rows, patientOrLabRecordId } = labRecordImport;
    return (
      <div>
        <h2>Complete patient ID for record linking</h2>
        <h4>
          You could skip this and complete patient ID later from lab records
        </h4>
        <table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={`column-patient-id-${index}`}>{column.v}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {row.map((cell, index) => (
                  // eslint-disable-next-line
                  <td key={`td-${index}`}>
                    {patientOrLabRecordId[index] === 'patientId' ? (
                      <TextField>
                        <Input
                          type="text"
                          value={cell.v}
                          onChange={this.handleRowChange(rowIndex, index)}
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

export default PatientIdStep;
