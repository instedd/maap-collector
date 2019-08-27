// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import style from '@material/react-fab/dist/fab.css';
import { Fab } from '@material/react-fab';
import MaterialIcon from '@material/react-material-icon';
import PatientsList from '../components/PatientsList';
import PatientsDialogForm from '../components/PatientsDialogForm';

type Props = {
  sync: {
    synchronizing: boolean
  },
  history: {}
};

type State = {
  modalIsOpen: boolean,
  type: string,
  formPatient: {
    patientId: string,
    gender: ?string,
    yearOfBirth: ?Date,
    levelOfEducation: ?string
  } | null
};

const mapStateToProps = ({ sync }) => ({ sync });

class PatientsIndex extends Component<Props, State> {
  props: Props;

  // $FlowFixMe
  child: {
    handleSubmit: () => {}
  };

  state: State = { modalIsOpen: false, type: '', formPatient: null };

  handleModalClosing = e => {
    if (e !== 'confirm') {
      this.setState({ modalIsOpen: false });
      return;
    }
    this.child
      .handleSubmit()
      // $FlowFixMe
      .then(() => this.setState({ modalIsOpen: false, type: '' }))
      // Currently we can't keep the modal open, so we need to close it and open it again
      // Check https://github.com/material-components/material-components-web-react/issues/772
      .catch(() =>
        this.setState({ modalIsOpen: false }, () =>
          this.setState({ modalIsOpen: true })
        )
      );
  };

  openCreatePatientForm = () => {
    this.setState({ modalIsOpen: true, type: 'create', formPatient: null });
  };

  openEditPatientForm = patient => {
    this.setState({ modalIsOpen: true, type: 'edit', formPatient: patient });
  };

  render() {
    const { modalIsOpen, type, formPatient } = this.state;
    return (
      <div>
        <PatientsList
          onEditPatient={patient => {
            this.openEditPatientForm(patient);
          }}
        />
        <Fab
          className={[style['mdc-fab'], 'app-fab--absolute']}
          icon={<MaterialIcon icon="add" />}
          onClick={() => this.openCreatePatientForm()}
        />
        {/* $FlowFixMe */}
        <PatientsDialogForm
          open={modalIsOpen}
          onClosing={e => this.handleModalClosing(e)}
          ref={c => {
            // $FlowFixMe
            if (c) this.child = c.getWrappedInstance();
          }}
          type={type}
          formPatient={formPatient}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(PatientsIndex);
