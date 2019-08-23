// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import TextField, { Input } from '@material/react-text-field';
import Select, { Option } from '@material/react-select';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import { updateAntibioticConsumptionStat } from '../actions/antibioticConsumptionStat';
import type { Dispatch, State } from '../reducers/types';
import ErrorMessage from './ErrorMessage';

type StoreProps = {
  dispatch: Dispatch
};
type Props = State & StoreProps;

const mapStateToProps = ({ patient }) => ({ patient });

class antibioticConsumptionStatsForm extends Component<Props, State> {
  handleSubmit = async () => {
    const { dispatch, antibioticConsumptionStatId } = this.props;
    return dispatch(
      updateAntibioticConsumptionStat(antibioticConsumptionStatId, {
        ...this.state
      })
    );
  };

  constructor(props) {
    super(props);
    this.state = {
      issued: false,
      quantity: '',
      balance: '',
      recipientFacility: '',
      recipientUnit: '',
      ...Object.keys(props.defaultValues).reduce((acc, cur) => {
        if (props.defaultValues[cur] === null) {
          acc[cur] = '';
        } else {
          acc[cur] = props.defaultValues[cur];
        }
        return acc;
      }, {}),
      date: props.defaultValues.date
        ? props.defaultValues.date.toISOString().substr(0, 10)
        : ''
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      issued: false,
      quantity: '',
      balance: '',
      recipientFacility: '',
      recipientUnit: '',
      ...Object.keys(props.defaultValues).reduce((acc, cur) => {
        if (props.defaultValues[cur] === null) {
          acc[cur] = '';
        } else {
          acc[cur] = props.defaultValues[cur];
        }
        return acc;
      }, {}),
      date:
        props.defaultValues.date instanceof Date &&
        // eslint-disable-next-line
        !isNaN(props.defaultValues.date)
          ? props.defaultValues.date.toISOString().substr(0, 10)
          : ''
    });
  }

  render() {
    const { patient } = this.props;
    const {
      date,
      issued,
      quantity,
      balance,
      recipientFacility,
      recipientUnit
    } = this.state;
    return (
      <Grid align="left">
        {patient.errors.length > 0 && (
          <Row>
            <Cell columns={12}>
              {patient.errors.map(error => (
                <ErrorMessage key={error}>{error}</ErrorMessage>
              ))}
            </Cell>
          </Row>
        )}
        <Row>
          <Cell columns={12}>
            <TextField className="full-width">
              <Input
                type="date"
                value={date}
                onChange={e => this.setState({ date: e.currentTarget.value })}
              />
            </TextField>
          </Cell>
          <Cell columns={12}>
            <Select
              className="full-width"
              value={issued}
              onChange={evt => this.setState({ issued: evt.target.value })}
            >
              <Option value={false}>Out</Option>
              <Option value>In</Option>
            </Select>
          </Cell>
          <Cell columns={12}>
            <TextField label="Quantity" className="full-width">
              <Input
                type="number"
                value={quantity}
                onChange={e =>
                  this.setState({ quantity: e.currentTarget.value })
                }
              />
            </TextField>
          </Cell>
          <Cell columns={12}>
            <TextField label="Balance" className="full-width">
              <Input
                type="number"
                value={balance}
                onChange={e =>
                  this.setState({ balance: e.currentTarget.value })
                }
              />
            </TextField>
          </Cell>
          <Cell columns={12}>
            <TextField label="Recipient Facility" className="full-width">
              <Input
                type="text"
                value={recipientFacility}
                onChange={e =>
                  this.setState({ recipientFacility: e.currentTarget.value })
                }
              />
            </TextField>
          </Cell>
          <Cell columns={12}>
            <TextField label="Recipient Unit" className="full-width" j>
              <Input
                type="text"
                value={recipientUnit}
                onChange={e =>
                  this.setState({ recipientUnit: e.currentTarget.value })
                }
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
)(antibioticConsumptionStatsForm);
