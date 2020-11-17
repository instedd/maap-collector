// @flow

import React, { Component } from 'react';
import Sequelize from 'sequelize';
import { connect } from 'react-redux';
import Checkbox from '@material/react-checkbox';

import type { Dispatch, State as ReduxState } from '../reducers/types';
import { fetchSites } from '../actions/sites';
import { enterSite } from '../actions/site';
import Table from './Table';

type StoreProps = {
  dispatch: Dispatch,
  sites: {
    items: [],
    totalCount: number,
    offset: number,
    limit: number,
    prevPage: number,
    nextPage: number
  }
};
type State = {
  searchText: string,
  hasPharmacy: boolean,
  hasLaboratory: boolean,
  hasHospital: boolean
};

const mapStateToProps = state => {
  const { dispatch, sites } = state;
  return { dispatch, sites };
};

type Props = ReduxState & StoreProps;

class Sites extends Component<Props, State> {
  state: State = {
    searchText: '',
    hasPharmacy: true,
    hasLaboratory: true,
    hasHospital: true
  };

  getSearchConditions() {
    const { searchText, hasPharmacy, hasLaboratory, hasHospital } = this.state;
    const filtersConditions = {
      [Sequelize.Op.or]: [
        {
          [Sequelize.Op.and]: [
            { hasPharmacy: false },
            { hasLaboratory: false },
            { hasHospital: false }
          ]
        },
        hasPharmacy && { hasPharmacy },
        hasLaboratory && { hasLaboratory },
        hasHospital && { hasHospital }
      ]
    };
    if (!searchText) return filtersConditions;
    return {
      [Sequelize.Op.and]: [
        filtersConditions,
        {
          [Sequelize.Op.or]: [
            { name: { [Sequelize.Op.like]: `%${searchText}%` } },
            { address: { [Sequelize.Op.like]: `%${searchText}%` } },
            { ownership: { [Sequelize.Op.like]: `%${searchText}%` } },
            { id: { [Sequelize.Op.like]: `%${searchText}%` } }
          ]
        }
      ]
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchSites(this.getSearchConditions()));
  }

  componentDidUpdate(_, prevState) {
    const { searchText, hasPharmacy, hasLaboratory, hasHospital } = this.state;
    if (
      prevState.searchText !== searchText ||
      prevState.hasPharmacy !== hasPharmacy ||
      prevState.hasLaboratory !== hasLaboratory ||
      prevState.hasHospital !== hasHospital
    ) {
      const { dispatch } = this.props;
      dispatch(fetchSites(this.getSearchConditions()));
    }
  }

  render() {
    const { sites, dispatch } = this.props;
    const { hasPharmacy, hasHospital, hasLaboratory } = this.state;
    return (
      <div>
        <Table
          entityName="sites"
          pagination
          offset={sites.offset}
          limit={sites.limit}
          prevPage={sites.prevPage}
          nextPage={sites.nextPage}
          items={sites.items}
          totalCount={sites.totalCount}
          onReload={() => dispatch(fetchSites(this.getSearchConditions()))}
          columns={[
            'Id',
            'Name',
            'Address',
            'Ownership',
            'Type',
            'Last activity'
          ]}
          fields={[
            'remoteId',
            'name',
            'address',
            'ownership',
            site =>
              ['hasPharmacy', 'hasLaboratory', 'hasHospital']
                .reduce((acc, key) => {
                  if (site[key]) acc.push(key.substr(3));
                  return acc;
                }, [])
                .join(', '),
            'updatedAt'
          ]}
          onClick={site => dispatch(enterSite(site))}
          search={value => {
            this.setState({ searchText: value });
          }}
          filters={
            <>
              <Checkbox
                nativeControlId="filter-farmacy"
                checked={hasPharmacy}
                onChange={e => this.setState({ hasPharmacy: e.target.checked })}
              />
              <label htmlFor="filter-farmacy">Pharmacy</label>
              <Checkbox
                nativeControlId="filter-laboratory"
                checked={hasLaboratory}
                onChange={e =>
                  this.setState({ hasLaboratory: e.target.checked })
                }
              />
              <label htmlFor="filter-laboratory">Laboratory</label>
              <Checkbox
                nativeControlId="filter-hospital"
                checked={hasHospital}
                onChange={e => this.setState({ hasHospital: e.target.checked })}
              />
              <label htmlFor="filter-hospital">Hospital</label>
            </>
          }
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(Sites);
