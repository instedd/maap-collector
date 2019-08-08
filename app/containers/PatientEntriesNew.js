// @flow
import Card from '@material/react-card';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import PatientEntriesForm from '../components/PatientEntriesForm';

type Props = ContextRouter;

class PatientsEntriesNew extends Component<Props> {
  props: Props;

  child: {
    handleSubmit: () => {}
  };

  render() {
    const { match } = this.props;

    return (
      <Card>
        <PatientEntriesForm patientId={match.params.id} />
      </Card>
    );
  }
}

export default withRouter(PatientsEntriesNew);
