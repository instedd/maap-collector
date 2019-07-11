// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import AntibioticConsumptionStatsList from '../components/AntibioticConsumptionStatsList';

type Props = {
  sync: {
    synchronizing: boolean
  }
};

const mapStateToProps = ({ sync }) => ({ sync });

class AntibioticConsumptionStatsIndex extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <AntibioticConsumptionStatsList />
      </div>
    );
  }
}

export default connect(mapStateToProps)(AntibioticConsumptionStatsIndex);
