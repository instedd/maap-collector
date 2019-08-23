// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import style from '@material/react-fab/dist/fab.css';
import { Fab } from '@material/react-fab';
import MaterialIcon from '@material/react-material-icon';
import { withRouter } from 'react-router-dom';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton
} from '@material/react-dialog';
import AntibioticList from '../components/AntibioticList';
import AntibioticsForm from '../components/AntibioticsForm';
import { fetchAntibiotics } from '../actions/antibiotics';
import type { Dispatch } from '../reducers/types';
import { syncStart } from '../actions/sync';

type Props = {
  sync: {
    synchronizing: boolean
  },
  history: {},
  dispatch: Dispatch
};

type State = {
  modalIsOpen: boolean
};

const mapStateToProps = ({ sync }) => ({ sync });

class AntibioticIndex extends Component<Props, State> {
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
      .then(() =>
        this.setState({ modalIsOpen: false }, () => {
          const { dispatch } = this.props;
          return dispatch(fetchAntibiotics()).then(() => dispatch(syncStart()));
        })
      )
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
        <AntibioticList />
        <Fab
          className={[style['mdc-fab'], 'app-fab--absolute']}
          icon={<MaterialIcon icon="add" />}
          onClick={() =>
            this.setState({ modalIsOpen: false }, () =>
              this.setState({ modalIsOpen: true })
            )
          }
        />
        <Dialog open={modalIsOpen} onClosing={e => this.handleModalClosing(e)}>
          <DialogTitle>New Antibiotic</DialogTitle>
          <DialogContent>
            <AntibioticsForm
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

export default withRouter(connect(mapStateToProps)(AntibioticIndex));
