// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Home from '../components/Home';

type Props = {
  sync: {
    synchronizing: boolean
  }
};

const mapStateToProps = ({ sync }) => ({ sync });

class HomePage extends Component<Props> {
  props: Props;

  render() {
    const { sync } = this.props;
    return <div></div>;
  }
}

export default connect(mapStateToProps)(HomePage);
