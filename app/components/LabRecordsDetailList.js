// @flow

import MaterialIcon from '@material/react-material-icon';
import TextField, { Input } from '@material/react-text-field';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { values, isFunction } from 'lodash';
import type { ContextRouter } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { fetchLabRecord } from '../actions/labRecords';
import { setPhiData } from '../actions/labRecordImport';
import { updateLabRecord } from '../actions/labRecord';
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

  patientField = row => {
    const { dispatch, labRecords } = this.props;
    const { labRecord } = labRecords;
    const { patientOrLabRecordId } = {
      ...{ ...labRecord }.dataValues
    };
    const patientIdIndex = values(patientOrLabRecordId).findIndex(
      item => item === 'patientId'
    );

    return (
      <TextField key={row}>
        <Input
          type="text"
          value={labRecord.rows[row][patientIdIndex].w}
          onChange={e => {
            const newRows = [...labRecord.rows];
            newRows[row][patientIdIndex] = { w: e.target.value };
            return dispatch(updateLabRecord({ rows: newRows })).then(() =>
              dispatch(
                setPhiData({
                  rows: newRows
                })
              )
            );
          }}
        />
      </TextField>
    );
  };

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
    const columnTypes = [patientOrLabRecordId, phi, date]
      .map(values)
      .reduce((acc, current) => current.map((e, i) => acc[i] || e), []);
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
          fields={columnTypes
            .map((e, i) => {
              if (e === null) return false;
              if (patientOrLabRecordId[i] === 'patientId')
                return (item, row) => this.patientField(row);
              return i;
            })
            .filter(e => isFunction(e) || e !== false)}
        />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(LabRecordsDetailList));
