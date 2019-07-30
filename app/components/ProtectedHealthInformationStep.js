import React, { Component } from 'react';
import Radio, { NativeRadioControl } from '@material/react-radio';
import Checkbox from '@material/react-checkbox';
import { connect } from 'react-redux';
import XlsxManager from '../utils/xlsxManager';
import { setPhiData } from '../actions/labRecordImport';

type ComponentProps = {};

type Props = ComponentProps;

const mapStateToProps = ({ labRecordImport }) => ({ labRecordImport });

class ProtectedHealthInformationStep extends Component<Props> {
  handlePatientOrLabRecordIdChange = column => e => {
    const { dispatch, labRecordImport } = this.props;
    const { patientOrLabRecordId } = labRecordImport;

    dispatch(
      setPhiData({
        patientOrLabRecordId: {
          ...patientOrLabRecordId,
          [column]: e.target.value
        }
      })
    );
  };

  handleCheckboxChange = (type, column) => e => {
    const { dispatch, labRecordImport } = this.props;

    dispatch(
      setPhiData({
        [type]: {
          ...labRecordImport[type],
          [column]: e.target.checked
        }
      })
    );
  };

  componentDidMount() {
    const { labRecordImport, dispatch } = this.props;
    const { file, headerRow } = labRecordImport;
    const sheet = new XlsxManager(file.path);
    const row = sheet.row(headerRow - 1);

    dispatch(
      setPhiData({
        columns: row,
        patientOrLabRecordId: row.reduce(
          (acc, current) => ({ ...acc, [current.v]: null }),
          {}
        ),
        phi: row.reduce((acc, current) => ({ ...acc, [current.v]: false }), {}),
        date: row.reduce((acc, current) => ({ ...acc, [current.v]: false }), {})
      })
    );
  }

  render() {
    const { labRecordImport } = this.props;
    const { file, columns, patientOrLabRecordId, phi, date } = labRecordImport;
    return (
      <div>
        <h2>
          Specify which columns has protected health information {file.name}
        </h2>
        <table>
          <thead>
            <tr>
              <th>Columns</th>
              <th className="text-center">Patient id</th>
              <th className="text-center">Lab record id</th>
              <th className="text-center">PHI</th>
              <th className="text-center">Date</th>
            </tr>
          </thead>
          <tbody>
            {columns.map(column => (
              <tr key={column.v}>
                <td>{column.v}</td>
                <td className="text-center">
                  <Radio key={`patientOrLabRecordID-${column.v}`}>
                    <NativeRadioControl
                      name={`patientOrLabRecordID-${column.v}`}
                      value="patientId"
                      disabled={date[column.v]}
                      id={`patientOrLabRecordID-${column.v}`}
                      checked={patientOrLabRecordId[column.v] === 'patientId'}
                      onChange={this.handlePatientOrLabRecordIdChange(column.v)}
                    />
                  </Radio>
                </td>
                <td className="text-center">
                  <Radio key={`patientOrLabRecordID-${column.v}`}>
                    <NativeRadioControl
                      name={`patientOrLabRecordID-${column.v}`}
                      value="labRecordId"
                      disabled={date[column.v]}
                      id={`patientOrLabRecordID-${column.v}`}
                      checked={patientOrLabRecordId[column.v] === 'labRecordId'}
                      onChange={this.handlePatientOrLabRecordIdChange(column.v)}
                    />
                  </Radio>
                </td>
                <td className="text-center">
                  <Checkbox
                    nativeControlId="phi-checkbox"
                    disabled={date[column.v]}
                    checked={phi[column.v]}
                    onChange={this.handleCheckboxChange('phi', column.v)}
                  />
                </td>
                <td className="text-center">
                  <Checkbox
                    nativeControlId="date-checkbox"
                    checked={date[column.v]}
                    onChange={this.handleCheckboxChange('date', column.v)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ProtectedHealthInformationStep);
