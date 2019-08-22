// @flow

import React, { Component } from 'react';
import Sequelize from 'sequelize';
import { connect } from 'react-redux';
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
  searchText: string
};

const mapStateToProps = state => {
  const { dispatch, sites } = state;
  return { dispatch, sites };
};

class Sites extends Component<Props, State> {
  state: State = {
    searchText: ''
  };

  getSearchConditions() {
    const { searchText } = this.state;
    if (!searchText) return {};
    return {
      [Sequelize.Op.or]: {
        name: { [Sequelize.Op.like]: `%${searchText}%` },
        address: { [Sequelize.Op.like]: `%${searchText}%` },
        ownership: { [Sequelize.Op.like]: `%${searchText}%` },
        id: { [Sequelize.Op.like]: `%${searchText}%` }
      }
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchSites(this.getSearchConditions()));
  }

  componentDidUpdate(_, prevState) {
    const { searchText } = this.state;
    if (prevState.searchText !== searchText) {
      const { dispatch } = this.props;
      dispatch(fetchSites(this.getSearchConditions()));
    }
  }

  render() {
    const { sites, dispatch } = this.props;
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
            console.log(value);
            this.setState({ searchText: value });
          }}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(Sites);
