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
    totalCount: number
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
          items={sites.items}
          totalCount={sites.totalCount}
          columns={['Name', 'Address', 'Ownership', 'Last activity']}
          fields={['id', 'name', 'address', 'ownership', 'updatedAt']}
          onClick={site => dispatch(enterSite(site))}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(Sites);
