// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import Card from '@material/react-card';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import type { Dispatch, State } from '../reducers/types';
import { fetchAntibiotics } from '../actions/antibiotics';

type StoreProps = {
  dispatch: Dispatch
};
type Props = State & StoreProps & ContextRouter;

const mapStateToProps = state => {
  const { dispatch } = state;
  return { dispatch };
};

class PatientForm extends Component<Props, State> {
  state: State = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchAntibiotics());
  }

  render() {
    return (
      <Card>
        <Grid align="left">
          <Row>
            <Cell cols={12}>
              <h2>New Patient record</h2>
            </Cell>
          </Row>
        </Grid>
      </Card>
    );
  }
}

export default withRouter(connect(mapStateToProps)(PatientForm));
