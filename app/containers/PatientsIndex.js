// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import style from '@material/react-fab/dist/fab.css';
import { Fab } from '@material/react-fab';
import MaterialIcon from '@material/react-material-icon';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton
} from '@material/react-dialog';
import PatientsList from '../components/PatientsList';
import PatientsForm from '../components/PatientsForm';

type Props = {
  sync: {
    synchronizing: boolean
  },
  history: {}
};

type State = {
  modalIsOpen: boolean
};

const mapStateToProps = ({ sync }) => ({ sync });

class PatientsIndex extends Component<Props, State> {
  props: Props;

  child: {
    handleSubmit: () => {}
  };

  state: State = { modalIsOpen: false };

  handleModalClosing = e => {
    if (e !== 'confirm') return;
    this.child
      .handleSubmit()
      // $FlowFixMe
      .then(() => this.setState({ modalIsOpen: false }))
      // Currently we can't keep the modal open, so we need to close it and open it again
      // Check https://github.com/material-components/material-components-web-react/issues/772
      .catch(() =>
        this.setState({ modalIsOpen: false }, () =>
          this.setState({ modalIsOpen: true })
        )
      );
  };

  render() {
    const { modalIsOpen } = this.state;
    return (
      <div>
        <PatientsList />
        <Fab
          className={[style['mdc-fab'], 'app-fab--absolute']}
          icon={<MaterialIcon icon="add" />}
          onClick={() => this.setState({ modalIsOpen: true })}
        />
        <Dialog open={modalIsOpen} onClosing={e => this.handleModalClosing(e)}>
          <DialogTitle>New patient</DialogTitle>
          <DialogContent>
            <PatientsForm
              ref={c => {
                // $FlowFixMe
                this.child = c && c.getWrappedInstance();
              }}
            />
          </DialogContent>
          <DialogFooter>
            <DialogButton action="dismiss">Cancel</DialogButton>
            <DialogButton action="confirm" isDefault>
              add
            </DialogButton>
          </DialogFooter>
        </Dialog>
      </div>
    );
  }
}

export default connect(mapStateToProps)(PatientsIndex);
