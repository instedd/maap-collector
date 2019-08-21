// @flow

import React, { Component } from 'react';

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
type State = {};

const mapStateToProps = state => {
  const { dispatch, sites } = state;
  return { dispatch, sites };
};

class Sites extends Component<Props, State> {
  state: State = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchSites());
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
            index => (
              <td key={`item-${sites.items[index].id || index}-type`}>
                {['hasFarmacy', 'hasLaboratory', 'hasHospital']
                  .reduce((acc, key) => {
                    if (sites.items[index][key]) acc.push(key.substr(3));
                    return acc;
                  }, [])
                  .join(', ')}
              </td>
            ),
            'updatedAt'
          ]}
          onClick={site => dispatch(enterSite(site))}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(Sites);
