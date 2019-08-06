// @flow

import MaterialIcon from '@material/react-material-icon';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { ContextRouter } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { fetchLabRecord } from '../actions/labRecords';
import { setPhiData } from '../actions/labRecordImport';
import XlsxManager from '../utils/xlsxManager';
import Table from './Table';

import type { Dispatch, State } from '../reducers/types';

type StoreProps = {
  dispatch: Dispatch,
  patientEntries: {
    items: [],
    totalCount: number
  }
};
type Props = State & StoreProps & ContextRouter;

const mapStateToProps = state => {
  const { dispatch, labRecordImport, labRecords } = state;
  return { dispatch, labRecordImport, labRecords };
};

class PatientList extends Component<Props, State> {
  state: State = {};

  async componentDidMount() {
    const { dispatch, labRecordId } = this.props;
    const labRecord = await dispatch(fetchLabRecord({ labRecordId }));

    const { filePath, dataRowsFrom = 4, dataRowsTo = 34 } = labRecord;
    const sheet = new XlsxManager(filePath);
    const row = sheet.row(2);
    const rows = sheet.rows(dataRowsFrom - 1, dataRowsTo - 1);
    dispatch(
      setPhiData({
        columns: row,
        rows
      })
    );
  }

  render() {
    const { labRecordImport, dispatch, labRecordId, labRecords } = this.props;
    const { labRecord } = labRecords;
    return (
      <div>
        <Table
          title={
            <>
              <Link to="/">
                <MaterialIcon icon="arrow_back" />
              </Link>
              {labRecord && labRecord.fileName}
            </>
          }
          items={labRecordImport.rows.map(i => i.map(({ v }) => v))}
          totalCount={labRecordImport.totalCount}
          onReload={() => dispatch(fetchLabRecord({ labRecordId }))}
          columns={labRecordImport.columns.map(({ v }) => v)}
          fields={labRecordImport.columns.map((_, index) => index)}
        />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(PatientList));
