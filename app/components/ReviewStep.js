import React, { Component, Fragment } from 'react';
import { values } from 'lodash';
import { connect } from 'react-redux';
import qs from 'qs';

import style from './ReviewStep.scss';
import Table from './Table';

type ComponentProps = {
  router: any
};

type Props = ComponentProps;

const mapStateToProps = state => {
  const { router } = state;
  return { router };
};

class ReviewStep extends Component<Props> {
  indexMatchesIdColumn = (index, columnName) => {
    const { importData } = this.props;
    const { patientOrLabRecordId, columnsToKeep } = importData;
    return patientOrLabRecordId[columnsToKeep[index]] === columnName;
  };

  columnName = (column, index) => {
    if (!column.v) {
      return `Column ${column.c}`;
    }
    if (column.v === 'Manual Patient Id') {
      return column.v;
    }
    if (this.indexMatchesIdColumn(index, 'patientId')) {
      return (
        <>
          {column.v}
          <br />
          (Patient ID)
        </>
      );
    }
    if (this.indexMatchesIdColumn(index, 'labRecordId')) {
      return (
        <>
          {column.v}
          <br />
          (Lab Record ID)
        </>
      );
    }
    return `${column.c} - ${column.v}`;
  };

  handleRowChange = (rowIndex, cellIndex) => e => {
    const { importData, onChange } = this.props;
    const { rows } = importData;
    const newRows = [...rows];
    newRows[rowIndex][cellIndex] = { w: e.target.value };
    onChange({
      rows: newRows
    });
  };

  static defaultProps: Props = {
    onChange: () => {},
    withPatientOrLabRecordId: true
  };

  componentDidMount() {
    const {
      importData,
      onChange,
      withPatientOrLabRecordId,
      sheet
    } = this.props;
    const {
      dataRowsFrom,
      dataRowsTo,
      patientOrLabRecordId,
      phi,
      date
    } = importData;
    const headerRow = sheet.row(importData.headerRow - 1);
    let rows = sheet.rows(dataRowsFrom - 1, dataRowsTo);
    const columnsToKeep = headerRow.reduce((acc, current, index) => {
      if (patientOrLabRecordId[index] || phi[index] || date[index])
        acc.push(index);
      return acc;
    }, []);
    if (
      withPatientOrLabRecordId &&
      !values(patientOrLabRecordId).some(i => i === 'patientId')
    ) {
      headerRow.push({ v: 'Manual Patient Id', w: 'Manual Patient Id' });
      date.push(null);
      phi.push(false);
      rows = rows.map(row => [...row, { v: '', w: '' }]);
      columnsToKeep.push(headerRow.length - 1);
      patientOrLabRecordId[headerRow.length - 1] = 'patientId';
    }

    onChange({
      columns: columnsToKeep.map(index => headerRow[index]),
      columnsToKeep,
      rows,
      patientOrLabRecordId,
      phi,
      date
    });
  }

  render() {
    const {
      importData,
      withPatientOrLabRecordId,
      title,
      subtitle,
      router
    } = this.props;
    const { columns, rows, patientOrLabRecordId, columnsToKeep } = importData;

    if (!patientOrLabRecordId || !columnsToKeep) {
      return <></>;
    }
    const pageSize = 20;
    const totalPages = Math.floor(rows.length / pageSize);
    const currentPage =
      parseInt(qs.parse(router.location.search.slice(1)).page, 10) || 1;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    const offset = (currentPage - 1) * pageSize;

    return (
      <Fragment>
        {/* TODO Remove this text for pharmacy */}
        <h2>{title}</h2>
        <h4>{subtitle}</h4>

        <div className={style.table}>
          <Table
            entityName="records to import"
            columns={columns.map(this.columnName)}
            pagination
            offset={offset}
            limit={pageSize}
            prevPage={prevPage}
            nextPage={nextPage}
            totalCount={rows.length}
            items={rows.slice(offset, offset + pageSize)}
            fields={columnsToKeep.map(
              (column, fieldIndex) => (row, rowIndex) => {
                const cell = row[column];
                return withPatientOrLabRecordId &&
                  this.indexMatchesIdColumn(fieldIndex, 'patientId') ? (
                  <input
                    className={style.input}
                    type="text"
                    value={cell.w}
                    onChange={this.handleRowChange(rowIndex, column)}
                  />
                ) : (
                  cell.w
                );
              }
            )}
          />
        </div>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps)(ReviewStep);
