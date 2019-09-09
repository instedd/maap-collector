import React, { Component } from 'react';
import Radio, { NativeRadioControl } from '@material/react-radio';
import Checkbox from '@material/react-checkbox';
import Select, { Option } from '@material/react-select';
import { values } from 'lodash';
import { connect } from 'react-redux';
import XlsxManager from '../utils/xlsxManager';

type ComponentProps = {};

type Props = ComponentProps;

class ProtectedHealthInformationStep extends Component<Props> {
  handlePatientOrLabRecordIdChange = column => e => {
    const { importData, onChange } = this.props;
    const { patientOrLabRecordId } = importData;

    onChange({
      patientOrLabRecordId: patientOrLabRecordId.map((value, index) => {
        if (value === e.target.value) return null;
        if (index === column) return e.target.value;
        return value;
      })
    });
  };

  handleCheckboxChange = (
    type,
    column,
    trueValue = true,
    falseValue = false
  ) => e => {
    const { importData, onChange } = this.props;

    onChange({
      [type]: values({
        ...importData[type],
        [column]: e.target.checked ? trueValue : falseValue
      })
    });
  };

  handleSelectChange = (type, column) => e => {
    const { importData, onChange } = this.props;

    onChange({
      [type]: {
        ...importData[type],
        [column]: e.target.value
      }
    });
  };

  columnName = column =>
    column.v ? `${column.c} - ${column.v}` : `Column ${column.c}`;

  componentDidMount() {
    const { importData, onChange } = this.props;
    const { file, headerRow } = importData;
    const sheet = new XlsxManager(file.path);
    const row = sheet.row(headerRow - 1);

    onChange({
      columns: row,
      patientOrLabRecordId: row.map(() => null),
      phi: row.map(() => false),
      date: row.map(() => null)
    });
  }

  render() {
    const { importData } = this.props;
    const { columns, patientOrLabRecordId, phi, date } = importData;
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
                <td>{this.columnName(column)}</td>
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

export default connect()(ProtectedHealthInformationStep);
