import React from 'react';
import { connect } from 'react-redux';
import MaterialIcon from '@material/react-material-icon';

type Props = {
  sync: {}
};

const mapStateToProps = ({ sync }) => ({ sync });
const SyncStatus = ({ sync }: Props) =>
  sync.synchronizing ? (
    <>
      Synchronizing...
      <MaterialIcon icon="sync" className="spin" />
    </>
  ) : (
    ''
  );

export default connect(mapStateToProps)(SyncStatus);
