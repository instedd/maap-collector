// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton
} from '@material/react-dialog';
import { fetchAntibioticConsumptionStats } from '../actions/antibioticConsumptionStats';
import AntibioticConsumptionStatsList from '../components/AntibioticConsumptionStatsList';
import AntibioticConsumptionStatsForm from '../components/AntibioticConsumptionStatsForm';
import { syncStart } from '../actions/sync';
import type { Dispatch } from '../reducers/types';

type Props = {
  sync: {
    synchronizing: boolean
  },
  match: {
    params: {
      id: string
    }
  },
  site: { id: number },
  dispatch: Dispatch
};

type State = {
  modalIsOpen: boolean,
  currentEditEntity: { id?: number, dataValues?: {} }
};

const mapStateToProps = ({ sync, site }) => ({ sync, site });

class AntibioticsDetail extends Component<Props, State> {
  props: Props;

  child: {
    handleSubmit: () => {}
  };

  state: State = { modalIsOpen: false, currentEditEntity: {} };

  handleEditClick = (e, current) => {
    e.preventDefault();
    this.setState(prevState => ({
      modalIsOpen: !prevState.modalIsOpen,
      currentEditEntity: current
    }));
  };

  handleModalClosing = e => {
    if (e !== 'confirm') return this.setState({ modalIsOpen: false });
    this.child
      .handleSubmit()
      // $FlowFixMe
      .then(() => {
        const { site, match, dispatch } = this.props;
        return this.setState({ modalIsOpen: false }, () =>
          dispatch(
            fetchAntibioticConsumptionStats({
              antibioticId: match.params.id,
              siteId: site && site.id
            })
          ).then(() => dispatch(syncStart()))
        );
      })
      // Currently we can't keep the modal open, so we need to close it and open it again
      // Check https://github.com/material-components/material-components-web-react/issues/772
      .catch(() =>
        this.setState({ modalIsOpen: false }, () =>
          this.setState({ modalIsOpen: true })
        )
      );
  };

  render() {
    const { match } = this.props;
    const { modalIsOpen, currentEditEntity } = this.state;
    return (
      <div>
        <AntibioticConsumptionStatsList
          antibioticId={match.params.id}
          onEditClick={this.handleEditClick}
        />
        <Dialog open={modalIsOpen} onClosing={e => this.handleModalClosing(e)}>
          <DialogTitle>Edit Antibiotic</DialogTitle>
          <DialogContent>
            <AntibioticConsumptionStatsForm
              antibioticId={match.params.id}
              antibioticConsumptionStatId={currentEditEntity.id}
              defaultValues={
                currentEditEntity && currentEditEntity.dataValues
                  ? currentEditEntity.dataValues
                  : {}
              }
              ref={c => {
                // $FlowFixMe
                this.child = c && c.getWrappedInstance();
              }}
            />
          </DialogContent>
          <DialogFooter>
            <DialogButton action="dismiss">Cancel</DialogButton>
            <DialogButton action="confirm" isDefault>
              edit
            </DialogButton>
          </DialogFooter>
        </Dialog>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(AntibioticsDetail));
