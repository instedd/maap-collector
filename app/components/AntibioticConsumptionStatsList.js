// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import type { Dispatch } from '../reducers/types';
import { fetchAntibioticConsumptionStats } from '../actions/antibioticConsumptionStats';
import Table from './Table';

type Props = {
  dispatch: Dispatch,
  antibioticConsumptionStats: {
    items: [],
    totalCount: number
  }
};
type State = {};

const mapStateToProps = state => {
  const { dispatch, antibioticConsumptionStats } = state;
  return { dispatch, antibioticConsumptionStats };
};

class AntibioticConsumptionStatsList extends Component<Props, State> {
  state: State = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchAntibioticConsumptionStats());
  }

  render() {
    const { antibioticConsumptionStats } = this.props;
    return (
      <div>
        <Table
          entityName="pharmacy consumption stats"
          items={antibioticConsumptionStats.items}
          totalCount={antibioticConsumptionStats.totalCount}
          columns={['ID', 'Date']}
          fields={['id', 'date']}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(AntibioticConsumptionStatsList);
