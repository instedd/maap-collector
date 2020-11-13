// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import Fab from '@material/react-fab';
import MaterialIcon from '@material/react-material-icon';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import { fetchElectronicPharmacyStockRecords } from '../actions/electronicPharmacyStockRecords';
import type { Dispatch } from '../reducers/types';
import Table from './Table';

type Props = {
  dispatch: Dispatch,
  site: { id: number },
  electronicPharmacyStockRecords: {
    items: [],
    totalCount: number,
    offset: number,
    limit: number,
    prevPage: number | null,
    nextPage: number | null
  },
  history: {
    push: string => void
  }
} & ContextRouter;
type State = {};

const mapStateToProps = state => {
  const { dispatch, electronicPharmacyStockRecords, site } = state;
  return { dispatch, electronicPharmacyStockRecords, site };
};

class ElectronicPharmacyStockRecordslist extends Component<Props, State> {
  state: State = {};

  componentDidMount() {
    const { dispatch, site } = this.props;
    dispatch(
      fetchElectronicPharmacyStockRecords({
        where: { siteId: site.id },
        attributes: ['id', 'fileName', 'createdAt']
      })
    );
  }

  render() {
    const {
      electronicPharmacyStockRecords,
      dispatch,
      history,
      site
    } = this.props;
    return (
      <div>
        <Table
          entityName="Imported Electronic Pharmacy Stock Files "
          items={electronicPharmacyStockRecords.items}
          pagination
          totalCount={electronicPharmacyStockRecords.totalCount}
          offset={electronicPharmacyStockRecords.offset}
          limit={electronicPharmacyStockRecords.limit}
          prevPage={electronicPharmacyStockRecords.prevPage}
          nextPage={electronicPharmacyStockRecords.nextPage}
          onReload={() =>
            dispatch(fetchElectronicPharmacyStockRecords({ siteId: site.id }))
          }
          onClick={({ id }) =>
            history.push(`/electronic_pharmacy_stock_records/${id}`)
          }
          columns={['File', 'Created at']}
          fields={['id', 'fileName', 'createdAt']}
        />
        <Fab
          className="mdc-fab app-fab--absolute"
          icon={<MaterialIcon icon="add" />}
          onClick={() =>
            history.push(`/electronic_pharmacy_stock_records/import`)
          }
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(
  withRouter(ElectronicPharmacyStockRecordslist)
);
