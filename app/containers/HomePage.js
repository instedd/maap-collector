// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from '../components/Home';
import Labs from '../components/Labs';
import NavBar from '../components/NavBar';

type Props = {
  sync: {
    synchronizing: boolean
  }
};

const mapStateToProps = ({ sync }) => ({ sync });

class HomePage extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <NavBar />
        <Home />
        <Labs />
      </div>
    );
  }
}

export default connect(mapStateToProps)(HomePage);
