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
    this.setState({ modalIsOpen: false });
    if (e === 'accept') return this.child.handleSubmit();
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
            <DialogButton action="accept" isDefault>
              add
            </DialogButton>
          </DialogFooter>
        </Dialog>
      </div>
    );
  }
}

export default connect(mapStateToProps)(PatientsIndex);
