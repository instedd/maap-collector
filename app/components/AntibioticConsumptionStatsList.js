// @flow

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import TextField, { Input } from '@material/react-text-field';
import MaterialIcon from '@material/react-material-icon';
import type { ContextRouter } from 'react-router';
import CombinedSelect from './CombinedSelect';
import type { Dispatch, Page } from '../reducers/types';
import {
  fetchAntibioticConsumptionStatsList,
  addCreatedAntibioticConsumptionStat
} from '../actions/antibioticConsumptionStats';
import { createAntibioticConsumptionStat } from '../actions/antibioticConsumptionStat';
import { fetchAntibiotic } from '../actions/antibiotic';
import Table from './Table';
import RowForm from './RowForm';

type ComponentProps = {
  dispatch: Dispatch,
  antibioticConsumptionStatsList: {
    antibioticName: string,
    antibioticConsumptionStats: Page,
    antibiotic?: {
      strength: string,
      form: string,
      name: string,
      packSize: string,
      brand: string
    }
  },
  antibioticId: string,
  site: {
    id: number
  },
  onEditClick: (number, {}) => void
};
type State = {
  date: ?Date,
  issued: ?boolean,
  quantity: ?number,
  balance: ?number,
  recipientFacility: ?string,
  recipientUnit: ?string,
  site: {
    id: number
  } | null
};

type Props = ComponentProps & ContextRouter;

const initialState = {
  issued: null,
  date: null,
  quantity: null,
  balance: null,
  recipientFacility: null,
  recipientUnit: null,
  site: null
};

const mapStateToProps = state => {
  const { dispatch, antibioticConsumptionStatsList, site } = state;
  return { dispatch, antibioticConsumptionStatsList, site };
};

class AntibioticConsumptionStatsList extends Component<Props, State> {
  state: State = initialState;

  handleSubmit = async () => {
    const { dispatch, antibioticId } = this.props;

    const record = await dispatch(
      createAntibioticConsumptionStat({ ...this.state, antibioticId })
    );
    this.setState(initialState);
    dispatch(addCreatedAntibioticConsumptionStat(record));
  };

  componentDidMount() {
    const { dispatch, antibioticId, site } = this.props;
    dispatch(
      fetchAntibioticConsumptionStatsList({
        antibioticId,
        siteId: site && site.id
      })
    );
    dispatch(fetchAntibiotic(antibioticId));
  }

  render() {
    const {
      dispatch,
      antibioticId,
      antibioticConsumptionStatsList,
      site,
      onEditClick
    } = this.props;
    const { antibioticConsumptionStats } = antibioticConsumptionStatsList;
    const {
      date,
      issued,
      quantity,
      balance,
      recipientFacility,
      recipientUnit
    } = this.state;
    const { strength, form, name, packSize, brand } =
      (antibioticConsumptionStatsList &&
        antibioticConsumptionStatsList.antibiotic) ||
      {};

    return (
      <div>
        <Table
          title={
            <>
              <Link to="/antibiotics">
                <MaterialIcon icon="arrow_back" />
              </Link>
              {antibioticConsumptionStatsList &&
                `${name || ''} ${packSize || ''}`}
            </>
          }
          subtitle={
            antibioticConsumptionStatsList &&
            `${strength || ''} ${form || ''} ${(brand && `(${brand})`) || ''}`
          }
          pagination
          items={antibioticConsumptionStats.items}
          totalCount={antibioticConsumptionStats.totalCount}
          offset={antibioticConsumptionStats.offset}
          limit={antibioticConsumptionStats.limit}
          prevPage={antibioticConsumptionStats.prevPage}
          nextPage={antibioticConsumptionStats.nextPage}
          onReload={() =>
            dispatch(
              fetchAntibioticConsumptionStatsList({
                antibioticId,
                siteId: site && site.id
              })
            )
          }
          columns={[
            'Date',
            'Issued',
            'Quantity',
            'Balance',
            'Sold/dispensed to',
            'Recipient unit',
            ''
          ]}
          fields={[
            'date',
            'issuedText',
            'quantity',
            'balance',
            'recipientFacility',
            'recipientUnit',
            current => (
              <MaterialIcon
                icon="edit"
                onClick={e => onEditClick(e, current)}
              />
            )
          ]}
          rowClassName={item => [item.issued ? 'highlight' : '']}
          lastRow={
            <RowForm onSubmit={this.handleSubmit}>
              <TextField>
                <Input
                  type="date"
                  value={date || ''}
                  onChange={e => this.setState({ date: e.currentTarget.value })}
                />
              </TextField>
              <CombinedSelect
                className="full-width"
                value={{ value: issued || false, label: issued ? 'In' : 'Out' }}
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
              <TextField>
                <Input
                  type="number"
                  value={quantity || ''}
                  onChange={e =>
                    this.setState({ quantity: e.currentTarget.value })
                  }
                />
              </TextField>
              <TextField>
                <Input
                  type="number"
                  value={balance || ''}
                  onChange={e =>
                    this.setState({ balance: e.currentTarget.value })
                  }
                />
              </TextField>
              <CombinedSelect
                className="full-width"
                value={{ value: recipientFacility, label: recipientFacility }}
                label=""
                isMulti={false}
                creatable={false}
                isDisabled={!!issued}
                options={[
                  { value: 'For in-patients', label: 'For in-patients' },
                  { value: 'For out-patients', label: 'For out-patients' },
                  {
                    value: 'For outside hospital',
                    label: 'For outside hospital'
                  }
                ]}
                onChange={v => {
                  // $FlowFixMe
                  this.setState({ recipientFacility: v.value });
                  if (recipientFacility !== 'For in-patients') return;
                  this.setState({ recipientUnit: null });
                }}
              />

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
            </RowForm>
          }
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(
  withRouter(AntibioticConsumptionStatsList)
);
