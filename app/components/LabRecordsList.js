// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import type { Dispatch } from '../reducers/types';
import { fetchLabRecords } from '../actions/labRecords';
import Table from './Table';

type Props = {
  dispatch: Dispatch,
  labRecords: {
    items: [],
    totalCount: number,
    offset: number,
    limit: number,
    prevPage: number | null,
    nextPage: number | null
  }
} & ContextRouter;
type State = {};

const mapStateToProps = state => {
  const { dispatch, labRecords } = state;
  return { dispatch, labRecords };
};

class LabRecordsList extends Component<Props, State> {
  state: State = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchLabRecords());
  }

  render() {
    const { labRecords, dispatch, history } = this.props;
    return (
      <div>
        <Table
          entityName="Lab records"
          items={labRecords.items}
          pagination
          totalCount={labRecords.totalCount}
          offset={labRecords.offset}
          limit={labRecords.limit}
          prevPage={labRecords.prevPage}
          nextPage={labRecords.nextPage}
          onReload={() => dispatch(fetchLabRecords())}
          onClick={({ id }) => history.push(`/lab_records/${id}`)}
          columns={['File', 'Created at']}
          fields={['fileName', 'filePath', 'createdAt']}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(LabRecordsList));
