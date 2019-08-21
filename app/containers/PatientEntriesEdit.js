// @flow
import Card from '@material/react-card';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import PatientEntriesForm from '../components/PatientEntriesForm';
import { fetchPatientEntry } from '../actions/patientEntry';

type Props = ContextRouter;

const mapStateToProps = ({ patientEntryEdit }) => ({ patientEntryEdit });

class PatientsEntriesEdit extends Component<Props> {
  props: Props;

  child: {
    handleSubmit: () => {}
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(fetchPatientEntry({ id: match.params.patientEntryId }));
  }

  render() {
    const { match, patientEntryEdit } = this.props;
    const { item } = patientEntryEdit;

    return (
      <Card>
        {item && (
          <PatientEntriesForm
            patientId={match.params.id}
            patientEntryId={match.params.patientEntryId}
            defaultValues={item}
            action="Edit"
          />
        )}
      </Card>
    );
  }
}

export default connect(mapStateToProps)(withRouter(PatientsEntriesEdit));
