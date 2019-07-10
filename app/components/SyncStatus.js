import React from 'react'
import { connect } from 'react-redux';
import type { Dispatch } from '../reducers/types';

const mapStateToProps = ({sync}) => ({sync})
const SyncStatus = ({
  sync
}) => {
  return (
    <div>
      405
    </div>
  )
}

export default connect(mapStateToProps)(SyncStatus)