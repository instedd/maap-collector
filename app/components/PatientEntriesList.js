// @flow

import MaterialIcon from '@material/react-material-icon';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { ContextRouter } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { fetchPatientEntries } from '../actions/patientEntries';
import { fetchPatient } from '../actions/patient';
import Table from './Table';
import Resolver from './Resolver';

import type { Dispatch, State, Page } from '../reducers/types';

type StoreProps = {
  dispatch: Dispatch,
  patientEntries: Page
};
type Props = State & StoreProps & ContextRouter;

const mapStateToProps = state => {
  const { dispatch, patientEntriesList } = state;
  return { dispatch, patientEntriesList };
};

class PatientList extends Component<Props, State> {
  state: State = {};

  componentDidMount() {
    const { dispatch, patientId } = this.props;
    dispatch(fetchPatientEntries({ patientId }));
    dispatch(fetchPatient(patientId));
  }

  render() {
    const { dispatch, patientId, patientEntriesList } = this.props;
    const { patientDisplayId, patientEntries } = patientEntriesList;

    const locationRenderer = current => (
      <Resolver
        key={current.patientLocationId}
        promise={current.patientLocationName}
      />
    );

    return (
      <div>
        <Table
          title={
            <>
              <Link to="/patients">
                <MaterialIcon icon="arrow_back" />
              </Link>
              {patientDisplayId}
            </>
          }
          pagination
          items={patientEntries.items}
          totalCount={patientEntries.totalCount}
          offset={patientEntries.offset}
          limit={patientEntries.limit}
          prevPage={patientEntries.prevPage}
          nextPage={patientEntries.nextPage}
          onReload={() => dispatch(fetchPatientEntries({ patientId }))}
          columns={[
            'Location',
            'Department',
            'Admission date',
            'Discharge date',
            'Discharge diagnostic',
            ''
          ]}
          fields={[
            locationRenderer,
            'department',
            'admissionDate',
            'dischargeDate',
            'dischargeDiagnostic',
            current => (
              <Link
                to={`/patients/${patientId}/entries/${current.id}/edit`}
                className="black-text"
              >
                <MaterialIcon icon="edit" />
              </Link>
            )
          ]}
        />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(PatientList));
