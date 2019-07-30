// @flow

import MaterialIcon from '@material/react-material-icon';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { ContextRouter } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { fetchPatientEntries } from '../actions/patientEntries';
import Table from './Table';

import type { Dispatch, State } from '../reducers/types';

type StoreProps = {
  dispatch: Dispatch,
  patientEntries: {
    items: [],
    totalCount: number
  }
};
type Props = State & StoreProps & ContextRouter;

const mapStateToProps = state => {
  const { dispatch, patientEntries } = state;
  return { dispatch, patientEntries };
};

class PatientList extends Component<Props, State> {
  state: State = {};

  componentDidMount() {
    const { dispatch, patientId } = this.props;
    dispatch(fetchPatientEntries(patientId));
  }

  render() {
    const { patientEntries } = this.props;
    return (
      <div>
        <Table
          title={
            <Link to="/patients">
              <MaterialIcon icon="arrow_back" />
            </Link>
          }
          items={patientEntries.items}
          totalCount={patientEntries.totalCount}
          columns={[
            'Location',
            'Department',
            'Admission date',
            'Discharge date',
            'Discharge diagnostic'
          ]}
          fields={[
            'location',
            'department',
            'admissionDate',
            'dischargeDate',
            'dischargeDiagnostic'
          ]}
        />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(PatientList));