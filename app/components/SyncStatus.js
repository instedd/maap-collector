import React from 'react';
import { connect } from 'react-redux';
import { entities } from '../actions/sync';

type Props = {
  sync: {}
};

const mapStateToProps = ({ sync }) => ({ sync });
const SyncStatus = ({ sync }: Props) => {
  // const total = sync.SpecimenSourceCount;
  const total = entities.reduce(
    (previous, current) => previous + (sync[`${current.name}Count`] || 0),
    0
  );
  return <div>{total}</div>;
};

export default connect(mapStateToProps)(SyncStatus);
