// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import type { Dispatch } from '../reducers/types';
import { fetchLabRecords } from '../actions/labRecords';
import Table from './Table';

type Props = {
  dispatch: Dispatch,
  labRecords: {
    items: [],
    totalCount: number
  }
};
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
    const { labRecords } = this.props;
    return (
      <div>
        <Table
          entityName="Lab records"
          items={labRecords.items}
          totalCount={labRecords.totalCount}
          columns={[
            'Patiend ID',
            'Specimen type',
            'Specimen source',
            'Method',
            'Cultures',
            'Growth',
            'Date'
          ]}
          fields={[
            'patientID',
            'specimentType',
            'specimenSource',
            'Method',
            'Cultures',
            'growth',
            'date'
          ]}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(LabRecordsList);
