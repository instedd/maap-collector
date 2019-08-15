// @flow

import MaterialIcon from '@material/react-material-icon';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { values } from 'lodash';
import type { ContextRouter } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { fetchLabRecord } from '../actions/labRecords';
import { setPhiData } from '../actions/labRecordImport';
import Table from './Table';

import { Dispatch, State } from '../reducers/types';

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

class LabRecordsDetailList extends Component<Props, State> {
  state: State = {};

  async componentDidMount() {
    const { dispatch, labRecordId } = this.props;
    const labRecord = await dispatch(fetchLabRecord(labRecordId));

    const { rows, columns } = labRecord;
    dispatch(
      setPhiData({
        columns,
        rows
      })
    );
  }

  render() {
    const { labRecordImport, dispatch, labRecordId, labRecords } = this.props;
    const { labRecord } = labRecords;
    const { patientOrLabRecordId, phi, date } = {
      ...{ ...labRecord }.dataValues
    };
    // This gets all the columns indexes that are patientOrLabRecordId, phi, or date
    const columns = [patientOrLabRecordId, phi, date]
      .map(values)
      .reduce((acc, current) => current.map((e, i) => acc[i] || e), [])
      .map((e, i) => (e ? i : false))
      .filter(e => e);
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
          items={labRecordImport.rows.map(i => i.map(({ w }) => w))}
          totalCount={labRecordImport.totalCount}
          onReload={() => dispatch(fetchLabRecord({ labRecordId }))}
          columns={labRecordImport.columns.map(({ w }) => w)}
          fields={columns}
        />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(LabRecordsDetailList));
