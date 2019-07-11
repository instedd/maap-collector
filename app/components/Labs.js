// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import type { Dispatch } from '../reducers/types';
import { fetchLabs } from '../actions/labs';
import Table from './Table';

type Props = {
  dispatch: Dispatch,
  labs: {
    items: [],
    totalCount: number
  }
};
type State = {};

const mapStateToProps = state => {
  const { dispatch, labs } = state;
  return { dispatch, labs };
};

class Labs extends Component<Props, State> {
  state: State = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchLabs());
  }

  render() {
    const { labs } = this.props;
    return (
      <div>
        <Table
          entityName="labs"
          items={labs.items}
          totalCount={labs.totalCount}
          columns={['Name', 'Address', 'Ownership', 'Last activity']}
          fields={['name', 'address', 'ownership', 'updatedAt']}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(Labs);
