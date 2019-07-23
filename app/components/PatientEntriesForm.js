// @flow

import { Cell, Grid, Row } from '@material/react-layout-grid';
import TextField, { Input } from '@material/react-text-field';
import Button from '@material/react-button';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createPatientEntry } from '../actions/patientEntry';

import type { Dispatch, State } from '../reducers/types';

type StoreProps = {
  dispatch: Dispatch
};
type Props = State & StoreProps;

class PatientEntriesForm extends Component<Props, State> {
  state: State = {
    chiefComplaint: ''
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { dispatch, history, patientId } = this.props;
    await dispatch(
      createPatientEntry({
        ...this.state,
        patientId
      })
    );
    history.push(`/patients/${patientId}/entries`);
  };

  render() {
    const { chiefComplaint } = this.state;
    const { history, patientId } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <Grid align="center" className="full-width">
          <Row>
            <h2>New entry</h2>
          </Row>
          <Row>
            <Cell columns={2} />
            <Cell columns={8}>
              <TextField className="full-width" label="Chief Complaint">
                <Input
                  type="text"
                  value={chiefComplaint}
                  placeholder="Chief Complaint"
                  onChange={e =>
                    this.setState({ chiefComplaint: e.currentTarget.value })
                  }
                />
              </TextField>
            </Cell>
          </Row>
          <Row>
            <Cell columns={11}>
              <Button
                type="button"
                onClick={() => history.push(`/patients/${patientId}/entries`)}
              >
                Cancel
              </Button>
            </Cell>
            <Cell columns={1}>
              <Button>Done</Button>
            </Cell>
          </Row>
        </Grid>
      </form>
    );
  }
}

export default withRouter(
  connect(
    null,
    null,
    null,
    { withRef: true }
  )(PatientEntriesForm)
);
