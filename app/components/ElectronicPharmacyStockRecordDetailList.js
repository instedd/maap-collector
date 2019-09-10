// @flow

import MaterialIcon from '@material/react-material-icon';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { values, isFunction } from 'lodash';
import type { ContextRouter } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { fetchElectronicPharmacyStockRecord } from '../actions/electronicPharmacyStockRecords';
import { setImportData } from '../actions/electronicPharmacyStockRecordImport';
import Table from './Table';

import { Dispatch, State as ReduxState } from '../reducers/types';

type StoreProps = {
  dispatch: Dispatch,
  patientEntries: {
    items: [],
    totalCount: number
  }
};
type Props = ReduxState & StoreProps & ContextRouter;

type State = {};

const mapStateToProps = state => {
  const {
    dispatch,
    electronicPharmacyStockRecordImport,
    electronicPharmacyStockRecords
  } = state;
  return {
    dispatch,
    electronicPharmacyStockRecordImport,
    electronicPharmacyStockRecords
  };
};

class ElectronicPharmacyStockRecordDetailList extends Component<Props, State> {
  async componentDidMount() {
    const { dispatch, electronicPharmacyStockRecordId } = this.props;
    const electronicPharmacyStockRecords = await dispatch(
      fetchElectronicPharmacyStockRecord({
        id: electronicPharmacyStockRecordId
      })
    );

    const { rows, columns } = electronicPharmacyStockRecords;
    dispatch(
      setImportData({
        columns,
        rows
      })
    );
  }

  render() {
    const {
      dispatch,
      electronicPharmacyStockRecordId,
      electronicPharmacyStockRecords
    } = this.props;
    const { electronicPharmacyStockRecord } = electronicPharmacyStockRecords;
    const { patientOrLabRecordId, phi, date } = {
      ...electronicPharmacyStockRecord
    };
    if (!electronicPharmacyStockRecords.electronicPharmacyStockRecord) {
      return <></>;
    }

    // This gets all the columns indexes that are patientOrLabRecordId, phi, or date
    const columnTypes = [patientOrLabRecordId, phi, date]
      .map(values)
      .reduce((acc, current) => current.map((e, i) => acc[i] || e), []);
    return (
      <div>
        <Table
          title={
            <>
              <Link to="/electronic_pharmacy_stock_records">
                <MaterialIcon icon="arrow_back" />
              </Link>
              {electronicPharmacyStockRecord &&
                electronicPharmacyStockRecord.fileName}
            </>
          }
          items={electronicPharmacyStockRecord.rows}
          totalCount={electronicPharmacyStockRecord.totalCount}
          onReload={() =>
            dispatch(
              fetchElectronicPharmacyStockRecord({
                id: electronicPharmacyStockRecordId
              })
            )
          }
          columns={electronicPharmacyStockRecord.columns.map(({ w }) => w)}
          fields={columnTypes
            .map((e, i) => {
              if (e === null) return false;
              return currentItem => currentItem[i].w;
            })
            .filter(e => isFunction(e) || e !== false)}
        />
      </div>
    );
  }
}

export default withRouter(
  connect(mapStateToProps)(ElectronicPharmacyStockRecordDetailList)
);
