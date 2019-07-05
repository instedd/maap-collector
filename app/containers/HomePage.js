// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
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
    return (
      <div>
        <Labs />
      </div>
    );
  }
}

export default connect(mapStateToProps)(HomePage);
