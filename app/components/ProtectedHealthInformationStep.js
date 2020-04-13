import React, { Component } from 'react';
import Select, { Option } from '@material/react-select';
import { values } from 'lodash';
import { connect } from 'react-redux';

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
      [type]: values({
        ...importData[type],
        [column]: e.target.value
      })
    });
  };

  columnName = column =>
    column.v ? `${column.c} - ${column.v}` : `Column ${column.c}`;

  static defaultProps: Props = {
    withPatientOrLabRecordId: true
  };

  componentDidMount() {
    const { importData, onChange, sheet } = this.props;
    const { headerRow } = importData;
    const row = sheet.row(headerRow - 1);

    onChange({
      columns: row,
      patientOrLabRecordId: row.map(() => null),
      phi: row.map(() => false),
      date: row.map(() => null)
    });
  }

  render() {
    const { importData, withPatientOrLabRecordId } = this.props;
    const { columns, patientOrLabRecordId, phi, date } = importData;
    return (
      <div>
        <h2>Specify which columns have private health information</h2>
        <table>
          <thead>
            <tr>
              <th>Columns</th>
              {withPatientOrLabRecordId ? (
                <>
                  <th className="text-center">Patient id</th>
                  <th className="text-center">Lab record id</th>
                </>
              ) : (
                <></>
              )}

              <th className="text-center">PHI</th>
              <th className="text-center">Date</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {columns.map((column, index) => (
              <tr key={`row-${index}`}>
                <td>{this.columnName(column)}</td>

                {withPatientOrLabRecordId ? (
                  <>
                    <td className="text-center">
                      <input
                        type="radio"
                        name="patientId"
                        value="patientId"
                        disabled={date[index]}
                        id={`patientOrLabRecordID-${index}`}
                        checked={patientOrLabRecordId[index] === 'patientId'}
                        onChange={this.handlePatientOrLabRecordIdChange(index)}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="radio"
                        name="labRecordId"
                        value="labRecordId"
                        disabled={date[index]}
                        id={`patientOrLabRecordID-${index}`}
                        checked={patientOrLabRecordId[index] === 'labRecordId'}
                        onChange={this.handlePatientOrLabRecordIdChange(index)}
                      />
                    </td>
                  </>
                ) : (
                  <></>
                )}
                <td className="text-center">
                  <input
                    type="checkbox"
                    name="phi-checkbox"
                    disabled={date[index]}
                    checked={phi[index]}
                    onChange={this.handleCheckboxChange('phi', index)}
                  />
                </td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    name="date-checkbox"
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
                      <Option value="DDMMMYY">DDMMMYY</Option>
                      <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                      <Option value="DD/MM/YY">DD/MM/YY</Option>
                      <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                      <Option value="MM/DD/YY">MM/DD/YY</Option>
                      <Option value="DD-MM-YYYY">DD-MM-YYYY</Option>
                      <Option value="DD-MM-YY">DD-MM-YY</Option>
                      <Option value="MM-DD-YYYY">MM-DD-YYYY</Option>
                      <Option value="MM-DD-YY">MM-DD-YY</Option>
                      <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
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
