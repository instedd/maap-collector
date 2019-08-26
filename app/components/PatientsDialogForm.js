// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton
} from '@material/react-dialog';
import PatientsForm from './PatientsForm';

const mapStateToProps = ({ patient }) => ({ patient });

type ComponentProps = {
  open: boolean,
  onClosing: ({}) => {},
  formPatient: {
    patientId: string,
    gender: ?string,
    yearOfBirth: ?Date,
    levelOfEducation: ?string
  } | null,
  type: string
};
type State = {};

type Props = ComponentProps;

class PatientsDialogForm extends Component<Props, State> {
  child: {
    handleSubmit: () => {}
  };

  props: Props;

  state: State = {};

  handleSubmit() {
    return this.child.handleSubmit();
  }

  render() {
    const { open, onClosing, formPatient, type } = this.props;
    let title;
    let buttonText;
    if (type === 'create') {
      title = 'New patient';
      buttonText = 'add';
    } else {
      title = 'Edit patient';
      buttonText = 'update';
    }
    return (
      <Dialog open={open} onClosing={e => onClosing(e)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {/* $FlowFixMe */}
          <PatientsForm
            ref={c => {
              this.child = c && c.getWrappedInstance();
            }}
            currentPatient={formPatient}
          />
        </DialogContent>
        <DialogFooter>
          <DialogButton action="dismiss">Cancel</DialogButton>
          <DialogButton action="confirm" isDefault>
            {buttonText}
          </DialogButton>
        </DialogFooter>
      </Dialog>
    );
  }
}

export default connect(
  mapStateToProps,
  null,
  null,
  { withRef: true }
)(PatientsDialogForm);
