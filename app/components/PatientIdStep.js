import React, { Component } from 'react';
import TextField, { Input } from '@material/react-text-field';

import XlsxManager from '../utils/xlsxManager';
import { setPhiData } from '../actions/labRecordImport';

type ComponentProps = {};

type Props = ComponentProps;

class PatientIdStep extends Component<Props> {
  handleRowChange = (rowIndex, cellIndex) => e => {
    const { labRecordImport, dispatch } = this.props;
    const { rows } = labRecordImport;
    const newRows = [...rows];
    newRows[rowIndex][cellIndex] = { v: e.target.value };
    dispatch(
      setPhiData({
        rows: newRows
      })
    );
  };

  componentDidMount() {
    const { labRecordImport, dispatch } = this.props;
    const { file, dataRowsFrom, dataRowsTo } = labRecordImport;
    const sheet = new XlsxManager(file.path);
    const row = sheet.row(labRecordImport.headerRow - 1);
    const rows = sheet.rows(dataRowsFrom - 1, dataRowsTo - 1);

    dispatch(
      setPhiData({
        columns: row,
        rows
      })
    );
  }

  render() {
    const { labRecordImport } = this.props;
    const { columns, rows, patientOrLabRecordId } = labRecordImport;
    return (
      <div>
        <h2>Complete patient ID for record linking</h2>
        <h2>
          You could skip this and complete patient ID later from lab records
        </h2>
        <table>
          <thead>
            <tr>
              {columns.map(column => (
                <th key={`column-${column.v}`}>{column.v}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row[0].v}>
                {row.map((cell, index) => (
                  // eslint-disable-next-line
                  <td key={`${row[0].v}-${index}`}>
                    {patientOrLabRecordId[columns[index].v] === 'patientId' ? (
                      <TextField>
                        <Input
                          type="text"
                          value={cell.v}
                          onChange={this.handleRowChange(rowIndex, index)}
                        />
                      </TextField>
                    ) : (
                      cell.v
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
