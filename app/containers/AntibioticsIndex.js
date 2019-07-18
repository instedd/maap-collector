// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import style from '@material/react-fab/dist/fab.css';
import { Fab } from '@material/react-fab';
import MaterialIcon from '@material/react-material-icon';
import { withRouter } from 'react-router-dom';
import AntibioticList from '../components/AntibioticList';

type Props = {
  sync: {
    synchronizing: boolean
  },
  history: {}
};

const mapStateToProps = ({ sync }) => ({ sync });

class AntibioticIndex extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <AntibioticList />
        <Fab
          className={[style['mdc-fab'], 'app-fab--absolute']}
          icon={<MaterialIcon icon="add" />}
        />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(AntibioticIndex));
