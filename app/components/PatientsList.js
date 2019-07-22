// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import type { Dispatch, State } from '../reducers/types';
import { fetchPatients } from '../actions/patients';
import Table from './Table';

type StoreProps = {
  dispatch: Dispatch,
  patients: {
    items: [],
    totalCount: number
  }
};
type Props = State & StoreProps & ContextRouter;

const mapStateToProps = state => {
  const { dispatch, patients } = state;
  return { dispatch, patients };
};

class PatientList extends Component<Props, State> {
  state: State = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchPatients());
  }

  render() {
    const { patients } = this.props;
    return (
      <div>
        <Table
          entityName="patients"
          items={patients.items}
          totalCount={patients.totalCount}
          columns={[
            'Patient ID',
            'Gender',
            'Year of birth',
            'Level of education'
          ]}
          fields={['patientId', 'gender', 'yearOfBirth', 'levelOfEducation']}
        />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(PatientList));
