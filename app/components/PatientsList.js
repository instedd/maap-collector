// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import MaterialIcon from '@material/react-material-icon';
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
  const { dispatch, patients, site } = state;
  return { dispatch, patients, site };
};

class PatientList extends Component<Props, State> {
  state: State = {};

  componentDidMount() {
    const { dispatch, site } = this.props;
    dispatch(fetchPatients({ siteId: site.id }));
  }

  render() {
    const { patients, history, dispatch, site, onEditPatient } = this.props;
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
          onReload={() => dispatch(fetchPatients({ siteId: site.id }))}
          columns={[
            'Patient ID',
            'Gender',
            'Year of birth',
            'Level of education',
            ''
          ]}
          fields={[
            'availablePatientId',
            'gender',
            'yearOfBirth',
            'levelOfEducation',
            (current, id) => (
              <MaterialIcon
                icon="edit"
                onClick={e => {
                  onEditPatient(current);
                  e.stopPropagation();
                }}
                key={`edit-${id}`}
              />
            )
          ]}
          onClick={({ id }) => history.push(`/patients/${id}/entries`)}
        />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(PatientList));
