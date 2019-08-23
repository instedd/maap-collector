import React, { Component } from 'react';
import Radio, { NativeRadioControl } from '@material/react-radio';
import Checkbox from '@material/react-checkbox';
import Select, { Option } from '@material/react-select';
import { values } from 'lodash';
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
        patientOrLabRecordId: values({
          ...patientOrLabRecordId,
          [column]: e.target.value
        })
      })
    );
  };

  handleCheckboxChange = (
    type,
    column,
    trueValue = true,
    falseValue = false
  ) => e => {
    const { dispatch, labRecordImport } = this.props;

    dispatch(
      setPhiData({
        [type]: values({
          ...labRecordImport[type],
          [column]: e.target.checked ? trueValue : falseValue
        })
      })
    );
  };

  handleSelectChange = (type, column) => e => {
    const { dispatch, labRecordImport } = this.props;

    dispatch(
      setPhiData({
        [type]: {
          ...labRecordImport[type],
          [column]: e.target.value
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
        patientOrLabRecordId: row.map(() => null),
        phi: row.map(() => false),
        date: row.map(() => null)
      })
    );
  }

  render() {
    const { labRecordImport } = this.props;
    const { columns, patientOrLabRecordId, phi, date } = labRecordImport;
    return (
      <div>
        <h2>Specify which columns have protected health information</h2>
        <table>
          <thead>
            <tr>
              <th>Columns</th>
              <th className="text-center">Patient id</th>
              <th className="text-center">Lab record id</th>
              <th className="text-center">PHI</th>
              <th className="text-center">Date</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {columns.map((column, index) => (
              <tr key={`row-${index}`}>
                <td>{column.v}</td>
                <td className="text-center">
                  <Radio key={`patientOrLabRecordID-${index}-patient-id`}>
                    <NativeRadioControl
                      name="patientId"
                      value="patientId"
                      disabled={date[index]}
                      id={`patientOrLabRecordID-${index}`}
                      checked={patientOrLabRecordId[index] === 'patientId'}
                      onChange={this.handlePatientOrLabRecordIdChange(index)}
                    />
                  </Radio>
                </td>
                <td className="text-center">
                  <Radio key={`patientOrLabRecordID-${index}-lab-record-id`}>
                    <NativeRadioControl
                      name="labRecordId"
                      value="labRecordId"
                      disabled={date[index]}
                      id={`patientOrLabRecordID-${index}`}
                      checked={patientOrLabRecordId[index] === 'labRecordId'}
                      onChange={this.handlePatientOrLabRecordIdChange(index)}
                    />
                  </Radio>
                </td>
                <td className="text-center">
                  <Checkbox
                    nativeControlId="phi-checkbox"
                    disabled={date[index]}
                    checked={phi[index]}
                    onChange={this.handleCheckboxChange('phi', index)}
                  />
                </td>
                <td className="text-center">
                  <Checkbox
                    nativeControlId="date-checkbox"
                    checked={!!date[index]}
                    onChange={this.handleCheckboxChange(
                      'date',
                      index,
                      'DDMMMYYYY',
                      null
                    )}
                  />
                </td>
                <td className="text-center">
                  {date[index] ? (
                    <Select
                      value={date[index]}
                      onChange={this.handleSelectChange('date', index)}
                    >
                      <Option value="DDMMMYYYY">DDMMMYYYY</Option>
                      <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                      <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                    </Select>
                  ) : (
                    ''
                  )}
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
