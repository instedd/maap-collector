// @flow
import Card from '@material/react-card';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import { connect } from 'react-redux';
import PatientEntriesForm from '../components/PatientEntriesForm';
import { State } from '../reducers/types';
import { cleanPatientEntry, openPatientEntry } from '../actions/patientEntry';

type Props = ContextRouter & State;

const mapStateToProps = ({ patientEntryEdit }) => ({ patientEntryEdit });

class PatientsEntriesNew extends Component<Props> {
  props: Props;

  child: {
    handleSubmit: () => {}
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(openPatientEntry());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(cleanPatientEntry());
  }

  render() {
    const { match, patientEntryEdit } = this.props;

    return (
      <Card>
        <PatientEntriesForm
          patientId={match.params.id}
          antibioticOptions={patientEntryEdit.antibioticOptions}
        />
      </Card>
    );
  }
}

export default connect(mapStateToProps)(withRouter(PatientsEntriesNew));
