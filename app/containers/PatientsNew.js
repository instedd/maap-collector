// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PatientsForm from '../components/PatientsForm';

type Props = {
  sync: {
    synchronizing: boolean
  },
  history: {}
};

const mapStateToProps = ({ sync }) => ({ sync });

class PatientNew extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <PatientsForm />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(PatientNew));
