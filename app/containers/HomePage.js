// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import LabRecordsList from '../components/LabRecordsList';
import Sites from '../components/Sites';

type Props = {
  sync: {
    synchronizing: boolean
  },
  site: *
};

const mapStateToProps = ({ sync, site }) => ({ sync, site });

class HomePage extends Component<Props> {
  props: Props;

  render() {
    const { site } = this.props;
    return <>{site ? <LabRecordsList /> : <Sites />}</>;
  }
}

export default connect(mapStateToProps)(HomePage);
