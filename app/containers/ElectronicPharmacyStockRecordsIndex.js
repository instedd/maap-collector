// @flow
import React, { Component } from 'react';
import ElectronicPharmacyStockRecordsList from '../components/ElectronicPharmacyStockRecordsList';

type Props = {};
class ElectronicPharmacyStockRecordsIndex extends Component<Props> {
  render() {
    return (
      <div>
        <ElectronicPharmacyStockRecordsList />
      </div>
    );
  }
}

export default ElectronicPharmacyStockRecordsIndex;
