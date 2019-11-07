// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import TextField, { Input } from '@material/react-text-field';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import CombinedSelect from './CombinedSelect';
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
            <CombinedSelect
              className="full-width"
              value={{ value: issued, label: issued ? 'In' : 'Out' }}
              label=""
              isMulti={false}
              creatable={false}
              options={[
                { value: true, label: 'In' },
                { value: false, label: 'Out' }
              ]}
              onChange={v => {
                // $FlowFixMe
                this.setState({ issued: v.value }, () => {
                  if (!v.value) return;
                  this.setState({
                    recipientFacility: null,
                    recipientUnit: null
                  });
                });
              }}
            />
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
            <CombinedSelect
              className="full-width"
              value={{ value: recipientFacility, label: recipientFacility }}
              label=""
              isMulti={false}
              creatable={false}
              isDisabled={issued}
              options={[
                { value: 'For in-patients', label: 'For in-patients' },
                { value: 'For out-patients', label: 'For out-patients' },
                { value: 'For outside hospital', label: 'For outside hospital' }
              ]}
              onChange={v => {
                // $FlowFixMe
                this.setState({ recipientFacility: v.value });
                if (recipientFacility !== 'For in-patients') return;
                this.setState({ recipientUnit: null });
              }}
            />
          </Cell>
          <Cell columns={12}>
            <CombinedSelect
              className="full-width"
              value={{ value: recipientUnit, label: recipientUnit }}
              label=""
              isMulti={false}
              creatable={false}
              isDisabled={recipientFacility !== 'For in-patients'}
              options={[
                { value: 'Medicine ward', label: 'Medicine ward' },
                { value: 'Surgery ward', label: 'Surgery ward' },
                {
                  value: 'Obstetrics / maternity ward',
                  label: 'Obstetrics / maternity ward'
                },
                { value: 'Gynaecology ward', label: 'Gynaecology ward' },
                {
                  value: 'Paediatrics & Neonatology ward',
                  label: 'Paediatrics & Neonatology ward'
                },
                { value: 'Pulmonology ward', label: 'Pulmonology ward' },
                { value: 'Orthopaedics ward', label: 'Orthopaedics ward' },
                { value: 'Geriatrics ward', label: 'Geriatrics ward' },
                { value: 'Nephrology ward', label: 'Nephrology ward' },
                { value: 'ENT ward', label: 'ENT ward' },
                { value: 'Others', label: 'Others' }
              ]}
              // $FlowFixMe
              onChange={v => this.setState({ recipientUnit: v.value })}
            />
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
