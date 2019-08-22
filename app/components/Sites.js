// @flow

import React, { Component } from 'react';
import Sequelize from 'sequelize';
import { connect } from 'react-redux';
import Checkbox from '@material/react-checkbox';

import type { Dispatch } from '../reducers/types';
import { fetchSites } from '../actions/sites';
import { enterSite } from '../actions/site';
import Table from './Table';

type Props = {
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
  hasFarmacy: boolean,
  hasLaboratory: boolean,
  hasHospital: boolean
};

const mapStateToProps = state => {
  const { dispatch, sites } = state;
  return { dispatch, sites };
};

class Sites extends Component<Props, State> {
  state: State = {
    searchText: '',
    hasFarmacy: true,
    hasLaboratory: true,
    hasHospital: true
  };

  getSearchConditions() {
    const { searchText, hasFarmacy, hasLaboratory, hasHospital } = this.state;
    const searchConditions = {};
    if (searchText)
      searchConditions[Sequelize.Op.or] = [
        { name: { [Sequelize.Op.like]: `%${searchText}%` } },
        { address: { [Sequelize.Op.like]: `%${searchText}%` } },
        { ownership: { [Sequelize.Op.like]: `%${searchText}%` } },
        { id: { [Sequelize.Op.like]: `%${searchText}%` } }
      ];
    return {
      ...searchConditions,
      [Sequelize.Op.or]: [
        {
          [Sequelize.Op.and]: [
            { hasFarmacy: false },
            { hasLaboratory: false },
            { hasHospital: false }
          ]
        },
        hasFarmacy && { hasFarmacy },
        hasLaboratory && { hasLaboratory },
        hasHospital && { hasHospital }
      ]
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchSites(this.getSearchConditions()));
  }

  componentDidUpdate(_, prevState) {
    const { searchText, hasFarmacy, hasLaboratory, hasHospital } = this.state;
    if (
      prevState.searchText !== searchText ||
      prevState.hasFarmacy !== hasFarmacy ||
      prevState.hasLaboratory !== hasLaboratory ||
      prevState.hasHospital !== hasHospital
    ) {
      const { dispatch } = this.props;
      console.log(this.getSearchConditions());
      dispatch(fetchSites(this.getSearchConditions()));
    }
  }

  render() {
    const { sites, dispatch } = this.props;
    const { hasFarmacy, hasHospital, hasLaboratory } = this.state;
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
            'id',
            'name',
            'address',
            'ownership',
            site =>
              ['hasFarmacy', 'hasLaboratory', 'hasHospital']
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
                checked={hasFarmacy}
                onChange={e => this.setState({ hasFarmacy: e.target.checked })}
              />
              <label htmlFor="filter-farmacy">Farmacy</label>
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
