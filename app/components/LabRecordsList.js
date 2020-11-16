// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import Fab from '@material/react-fab';
import MaterialIcon from '@material/react-material-icon';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import type { Dispatch } from '../reducers/types';
import { fetchLabRecords } from '../actions/labRecords';
import Table from './Table';

type Props = {
  dispatch: Dispatch,
  site: { id: number },
  labRecords: {
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
  const { dispatch, labRecords, site } = state;
  return { dispatch, labRecords, site };
};

class LabRecordsList extends Component<Props, State> {
  state: State = {};

  componentDidMount() {
    const { dispatch, site } = this.props;
    dispatch(
      fetchLabRecords({ siteId: site.id }, ['id', 'fileName', 'createdAt'])
    );
  }

  render() {
    const { labRecords, dispatch, history, site } = this.props;
    return (
      <div>
        <Table
          entityName="Lab record files"
          items={labRecords.items}
          pagination
          totalCount={labRecords.totalCount}
          offset={labRecords.offset}
          limit={labRecords.limit}
          prevPage={labRecords.prevPage}
          nextPage={labRecords.nextPage}
          onReload={() =>
            dispatch(
              fetchLabRecords({ siteId: site.id }, [
                'id',
                'fileName',
                'createdAt'
              ])
            )
          }
          onClick={({ id }) => history.push(`/lab_records/${id}`)}
          columns={['File', 'Created at']}
          fields={['fileName', 'createdAt']}
        />
        <Fab
          className="mdc-fab app-fab--absolute"
          icon={<MaterialIcon icon="add" />}
          onClick={() => history.push(`/lab_records/import`)}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(LabRecordsList));
