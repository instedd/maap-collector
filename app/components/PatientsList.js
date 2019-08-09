// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import { fetchPatients } from '../actions/patients';
import Table from './Table';

import type { Dispatch, State } from '../reducers/types';

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
    const { patients, history, dispatch } = this.props;
    return (
      <div>
        <Table
          entityName="patients"
          pagination
          totalCount={patients.totalCount}
          items={patients.items}
          offset={patients.offset}
          limit={patients.limit}
          prevPage={patients.prevPage}
          nextPage={patients.nextPage}
          onReload={() => dispatch(fetchPatients())}
          columns={[
            'Patient ID',
            'Gender',
            'Year of birth',
            'Level of education'
          ]}
          fields={[
            'availablePatientId',
            'gender',
            'yearOfBirth',
            'levelOfEducation'
          ]}
          onClick={({ id }) => history.push(`/patients/${id}/entries`)}
        />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(PatientList));
