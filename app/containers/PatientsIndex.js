// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import style from '@material/react-fab/dist/fab.css';
import { Fab } from '@material/react-fab';
import MaterialIcon from '@material/react-material-icon';
import { withRouter } from 'react-router-dom';
import PatientsList from '../components/PatientsList';

type Props = {
  sync: {
    synchronizing: boolean
  },
  history: {}
};

const mapStateToProps = ({ sync }) => ({ sync });

class PatientsIndex extends Component<Props> {
  props: Props;

  render() {
    const { history } = this.props;
    return (
      <div>
        <PatientsList />
        <Fab
          className={[style['mdc-fab'], 'app-fab--absolute']}
          icon={<MaterialIcon icon="add" />}
          onClick={() => history.push('/patients/new')}
        />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(PatientsIndex));
