// @flow
import { Fab } from '@material/react-fab';
import style from '@material/react-fab/dist/fab.css';
import MaterialIcon from '@material/react-material-icon';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import PatientEntriesList from '../components/PatientEntriesList';

type Props = { match: { params: { id: string } } } & ContextRouter;

type State = {};

class PatientsIndex extends Component<Props, State> {
  props: Props;

  child: {
    handleSubmit: () => {}
  };

  render() {
    const { history, match } = this.props;

    return (
      <div>
        <PatientEntriesList patientId={match.params.id} />
        <Fab
          className={[style['mdc-fab'], 'app-fab--absolute']}
          icon={<MaterialIcon icon="add" />}
          onClick={() =>
            history.push(`/patients/${match.params.id}/entries/new`)
          }
        />
      </div>
    );
  }
}

export default withRouter(PatientsIndex);
