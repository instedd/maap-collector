// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from '../components/Home';
import Labs from '../components/Labs';

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
    return (
      <div>
        <Home />
        <Labs />
      </div>
    );
  }
}

export default connect(mapStateToProps)(HomePage);
