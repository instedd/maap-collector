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
              <Option value="G">G</Option>
              <Option value="G/G">G/G</Option>
              <Option value="G/ML">G/ML</Option>
              <Option value="G/VIAL">G/VIAL</Option>
              <Option value="IU">IU</Option>
              <Option value="IU/G">IU/G</Option>
              <Option value="IU/ML">IU/ML</Option>
              <Option value="M/M">M/M</Option>
              <Option value="MG">MG</Option>
              <Option value="MG/G">MG/G</Option>
              <Option value="MG/ML">MG/ML</Option>
              <Option value="MIU">MIU</Option>
              <Option value="ML">ML</Option>
              <Option value="MU">MU</Option>
              <Option value="U">U</Option>
              <Option value="W/V">W/V</Option>
              <Option value="W/W">W/W</Option>
              <Option value="W/WMG">W/WMG</Option>
              <Option value="WW">WW</Option>
            </Select>
          </Cell>
          <Cell columns={12}>
            <TextField className="full-width" label="Form">
              <Input
                type="text"
                value={form}
                placeholder="Form"
                onChange={e => this.setState({ form: e.currentTarget.value })}
              />
            </TextField>
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
