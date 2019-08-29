// @flow
import Card from '@material/react-card';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import PatientEntriesForm from '../components/PatientEntriesForm';
import {
  fetchPatientEntry,
  cleanPatientEntry,
  openPatientEntry
} from '../actions/patientEntry';
import { State } from '../reducers/types';

type Props = State &
  ContextRouter & {
    patientEntryEdit: {
      item: {}
    }
  };

const mapStateToProps = ({ patientEntryEdit }) => ({ patientEntryEdit });

class PatientsEntriesEdit extends Component<Props> {
  props: Props;

  child: {
    handleSubmit: () => {}
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(openPatientEntry());
    dispatch(fetchPatientEntry({ id: match.params.patientEntryId }));
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(cleanPatientEntry());
  }

  render() {
    const { match, patientEntryEdit } = this.props;
    const { item, antibioticOptions } = patientEntryEdit;

    return (
      <Card>
        {item && (
          <PatientEntriesForm
            patientId={match.params.id}
            patientEntryId={match.params.patientEntryId}
            defaultValues={item}
            action="Edit"
            antibioticOptions={antibioticOptions}
          />
        )}
      </Card>
    );
  }
}

export default connect(mapStateToProps)(withRouter(PatientsEntriesEdit));
