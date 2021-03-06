// @flow

import MaterialIcon from '@material/react-material-icon';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { ContextRouter } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { values, isFunction } from 'lodash';
import qs from 'qs';
import { fetchLabRecord } from '../actions/labRecords';
import { setPhiData } from '../actions/labRecordImport';
import { updateLabRecord } from '../actions/labRecord';
import style from './LabRecordsDetailList.scss';
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

type State = {
  searchText: string
};

const mapStateToProps = state => {
  const { dispatch, labRecordImport, labRecords, site, router } = state;
  return { dispatch, labRecordImport, labRecords, site, router };
};

class LabRecordsDetailList extends Component<Props, State> {
  state: State = {
    searchText: ''
  };

  patientField = (key, row) => {
    const { dispatch, labRecords } = this.props;
    const { labRecord } = labRecords;
    const { patientOrLabRecordId } = {
      ...{ ...labRecord }.dataValues
    };
    const patientIdIndex = values(patientOrLabRecordId).findIndex(
      item => item === 'patientId'
    );

    return (
      <input
        type="text"
        value={row[patientIdIndex]}
        className={style.emphasis}
        onChange={e => {
          const newRows = [...labRecord.rows];
          newRows[row[row.length - 1]][patientIdIndex] = {
            w: e.target.value
          };
          return dispatch(updateLabRecord({ rows: newRows })).then(() =>
            dispatch(
              setPhiData({
                rows: newRows
              })
            )
          );
        }}
      />
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
    const { labRecordImport, labRecords, router, site } = this.props;
    const { labRecord } = labRecords;
    const { patientOrLabRecordId, phi, date } = {
      ...{ ...labRecord }.dataValues
    };
    const { searchText } = this.state;

    if (!labRecords.labRecord) {
      return <></>;
    }

    const pageSize = 20;
    const totalPages = Math.floor(labRecordImport.rows.length / pageSize);
    const currentPage =
      parseInt(qs.parse(router.location.search.slice(1)).page, 10) || 1;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    const offset = (currentPage - 1) * pageSize;

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
          pagination
          offset={offset}
          limit={pageSize}
          prevPage={prevPage}
          nextPage={nextPage}
          totalCount={labRecordImport.rows.length}
          items={labRecordImport.rows
            .slice(offset, offset + pageSize)
            .map((row, index) => {
              const flatRow = row.map(({ w }) => w);
              flatRow.push(index);
              return flatRow;
            })
            .filter(row => {
              const patientIdColumn = (
                (patientOrLabRecordId.length && patientOrLabRecordId) ||
                []
              ).indexOf('patientId');
              const labRecordIdColumn = (
                (patientOrLabRecordId.length && patientOrLabRecordId) ||
                []
              ).indexOf('labRecordId');
              return (
                !searchText ||
                row[patientIdColumn].includes(searchText) ||
                (labRecordIdColumn >= 0 &&
                  row[labRecordIdColumn].includes(searchText))
              );
            })}
          columns={labRecordImport.columns.map(({ w }) => w)}
          fields={columnTypes
            .map((e, i) => {
              if (e === null) return false;
              if (patientOrLabRecordId[i] === 'patientId') {
                if (!site.hasHospital) return i;
                return item =>
                  this.patientField(
                    `${item[item.length - 1]}-${i}-patientIdField`,
                    item
                  );
              }
              if (patientOrLabRecordId[i] === 'labRecordId')
                return item => <strong>{item[i]}</strong>;
              return i;
            })
            .filter(e => isFunction(e) || e !== false)}
          search={value => {
            this.setState({ searchText: value });
          }}
        />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(LabRecordsDetailList));
