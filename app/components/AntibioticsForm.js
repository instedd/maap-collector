// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import TextField, { Input } from '@material/react-text-field';
import Select, { Option } from '@material/react-select';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import type { Dispatch, State } from '../reducers/types';
import ErrorMessage from './ErrorMessage';
import { createAntibiotic } from '../actions/antibiotic';

type StoreProps = {
  dispatch: Dispatch
};
type Props = State & StoreProps;

const mapStateToProps = ({ antibiotic }) => ({ antibiotic });

const strengthUnitList = [
  'G',
  'G; MG',
  'G/G',
  'G/ML',
  'GRAM',
  'IU',
  'IU/ML',
  'M/M',
  'MG',
  'MG/G',
  'MG/IU/G',
  'MG/IU/ML',
  'MG/MG',
  'MG/ML',
  'MG/VIAL',
  'MIU',
  'MU',
  'U',
  'W/V',
  'W/W',
  'W/W MG'
];

const formList = [
  'Tablets',
  'Capsules',
  'Suspension',
  'Syrup',
  'Dry powder for reconstitution as syrup',
  'IM Injections as vial',
  'IV Bolus Injections as vial',
  'IV Bolus Injections as ampule',
  'IV Infusions as a bottle/bag'
];

class AntibioticsForm extends Component<Props, State> {
  state: State = {
    name: '',
    strengthValue: '',
    strengthUnit: '',
    form: '',
    packSize: '',
    brand: ''
  };

  handleSubmit() {
    const { dispatch } = this.props;
    return dispatch(createAntibiotic(this.state));
  }

  render() {
    const { antibiotic } = this.props;
    const {
      name,
      strengthValue,
      strengthUnit,
      form,
      packSize,
      brand
    } = this.state;
    return (
      <Grid align="left">
        {antibiotic.errors.length > 0 && (
          <Row>
            <Cell columns={12}>
              {antibiotic.errors.map(error => (
                <ErrorMessage key={error}>{error}</ErrorMessage>
              ))}
            </Cell>
          </Row>
        )}
        <Row>
          <Cell columns={12}>
            <TextField className="full-width" label="Name">
              <Input
                type="text"
                value={name}
                placeholder="Name"
                onChange={e => this.setState({ name: e.currentTarget.value })}
              />
            </TextField>
          </Cell>
          <Cell columns={12}>
            <TextField className="full-width" label="Strength Value">
              <Input
                type="form"
                value={strengthValue}
                placeholder="Strength Value"
                onChange={e =>
                  this.setState({ strengthValue: e.currentTarget.value })
                }
              />
            </TextField>
          </Cell>
          <Cell columns={12}>
            <Select
              className="full-width"
              label="Strength Unit"
              value={strengthUnit}
              enhanced
              onEnhancedChange={(index, item) =>
                this.setState({ strengthUnit: item.getAttribute('data-value') })
              }
            >
              {strengthUnitList.map(value => (
                <Option key={value} value={value}>
                  {value}
                </Option>
              ))}
            </Select>
          </Cell>
          <Cell columns={12}>
            <Select
              className="full-width"
              label="Form"
              value={form}
              enhanced
              onEnhancedChange={(index, item) =>
                this.setState({ form: item.getAttribute('data-value') })
              }
            >
              {formList.map(value => (
                <Option key={value} value={value}>
                  {value}
                </Option>
              ))}
            </Select>
          </Cell>
          <Cell columns={12}>
            <TextField className="full-width" label="Pack Size">
              <Input
                type="text"
                value={packSize}
                placeholder="Pack Size"
                onChange={e =>
                  this.setState({ packSize: e.currentTarget.value })
                }
              />
            </TextField>
          </Cell>
          <Cell columns={12}>
            <TextField className="full-width" label="Brand">
              <Input
                type="text"
                value={brand}
                placeholder="Brand"
                onChange={e => this.setState({ brand: e.currentTarget.value })}
              />
            </TextField>
          </Cell>
        </Row>
      </Grid>
    );
  }
}

export default connect(
  mapStateToProps,
  null,
  null,
  { withRef: true }
)(AntibioticsForm);
