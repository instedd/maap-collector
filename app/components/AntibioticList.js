// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import type { Dispatch, State } from '../reducers/types';
import { fetchAntibiotics } from '../actions/antibiotics';
import Table from './Table';

type StoreProps = {
  dispatch: Dispatch,
  antibiotics: {
    items: [],
    totalCount: number
  }
};
type Props = State & StoreProps & ContextRouter;

const mapStateToProps = state => {
  const { dispatch, antibiotics } = state;
  return { dispatch, antibiotics };
};

class AntibioticConsumptionStatsList extends Component<Props, State> {
  state: State = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchAntibiotics());
  }

  render() {
    const { antibiotics, history } = this.props;
    return (
      <div>
        <Table
          entityName="antibiotics"
          items={antibiotics.items}
          totalCount={antibiotics.totalCount}
          columns={['Name', 'Strength', 'Form', 'Pack size', 'Brand']}
          fields={['name', 'strength', 'form', 'packSize', 'brand']}
          onClick={({ id }) => history.push(`/antibiotics/${id}`)}
        />
      </div>
    );
  }
}

export default withRouter(
  connect(mapStateToProps)(AntibioticConsumptionStatsList)
);