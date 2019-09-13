// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import ElectronicPharmacyStockRecordDetailList from '../components/ElectronicPharmacyStockRecordDetailList';

type Props = { match: { params: { id: string } } } & ContextRouter;

type State = {};

class ElectronicPharmacyStockRecordDetail extends Component<Props, State> {
  props: Props;

  child: {
    handleSubmit: () => {}
  };

  render() {
    const { match } = this.props;

    return (
      <div>
        <ElectronicPharmacyStockRecordDetailList
          electronicPharmacyStockRecordId={match.params.id}
        />
      </div>
    );
  }
}

export default withRouter(ElectronicPharmacyStockRecordDetail);
