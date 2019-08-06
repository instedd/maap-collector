// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import LabRecordsDetailList from '../components/LabRecordsDetailList';

type Props = { match: { params: { id: string } } } & ContextRouter;

type State = {};

class PatientsIndex extends Component<Props, State> {
  props: Props;

  child: {
    handleSubmit: () => {}
  };

  render() {
    const { match } = this.props;

    return (
      <div>
        <LabRecordsDetailList labRecordId={match.params.id} />
      </div>
    );
  }
}

export default withRouter(PatientsIndex);
