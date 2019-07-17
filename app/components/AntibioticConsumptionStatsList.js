// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import type { Dispatch } from '../reducers/types';
import { fetchAntibioticConsumptionStats } from '../actions/antibioticConsumptionStats';
import Table from './Table';

type Props = {
  dispatch: Dispatch,
  antibioticConsumptionStats: {
    items: [],
    totalCount: number
  },
  antibioticId: string
};
type State = {};

const mapStateToProps = state => {
  const { dispatch, antibioticConsumptionStats } = state;
  return { dispatch, antibioticConsumptionStats };
};

class AntibioticConsumptionStatsList extends Component<Props, State> {
  state: State = {};

  componentDidMount() {
    const { dispatch, antibioticId } = this.props;
    dispatch(fetchAntibioticConsumptionStats(antibioticId));
  }

  render() {
    const { antibioticConsumptionStats } = this.props;
    return (
      <div>
        <Table
          title={<Link to="/antibiotics">Go back</Link>}
          items={antibioticConsumptionStats.items}
          totalCount={antibioticConsumptionStats.totalCount}
          columns={[
            'Date',
            'Issued',
            'Quantity',
            'Balance',
            'Recipient facility',
            'Recipient unit'
          ]}
          fields={[
            'date',
            'issuedText',
            'quantity',
            'balance',
            'recipientFacilityName',
            'recipientUnit'
          ]}
          rowClassName={item => [item.issued ? 'highlight' : '']}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(AntibioticConsumptionStatsList);
