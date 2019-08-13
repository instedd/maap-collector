// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import TextField, { Input } from '@material/react-text-field';
import Select, { Option } from '@material/react-select';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import type { Dispatch, State } from '../reducers/types';
import ErrorMessage from './ErrorMessage';
import { createPatient } from '../actions/patient';

type StoreProps = {
  dispatch: Dispatch
};
type Props = State & StoreProps;

const mapStateToProps = ({ patient }) => ({ patient });

class PatientForm extends Component<Props, State> {
  state: State = {
    patientId: '',
    gender: '',
    yearOfBirth: new Date().getFullYear(),
    levelOfEducation: ''
  };

  handleSubmit() {
    const { dispatch } = this.props;
    return dispatch(createPatient(this.state));
  }

  render() {
    const { patient } = this.props;
    const { patientId, yearOfBirth, levelOfEducation, gender } = this.state;
    return (
      <Grid align="left">
        {patient.errors.length > 0 && (
          <Row>
            <Cell columns={12}>
              {patient.errors.map(error => (
                <ErrorMessage key={error}>{error}</ErrorMessage>
              ))}
            </Cell>
          </Row>
        )}
        <Row>
          <Cell columns={12}>
            <TextField className="full-width" label="Patient ID">
              <Input
                type="text"
                value={patientId}
                placeholder="Patient ID"
                onChange={e =>
                  this.setState({ patientId: e.currentTarget.value })
                }
              />
            </TextField>
          </Cell>
          <Cell columns={12}>
            <Select
              className="full-width"
              label="Gender"
              value={gender}
              enhanced
              onEnhancedChange={(index, item) =>
                this.setState({ gender: item.getAttribute('data-value') })
              }
            >
              <Option value="female">Female</Option>
              <Option value="male">Male</Option>
              <Option value="other">other</Option>
            </Select>
          </Cell>
          <Cell columns={12}>
            <TextField className="full-width" label="Year of birth">
              <Input
                type="number"
                value={yearOfBirth}
                placeholder="Year of birth"
                onChange={e =>
                  this.setState({ yearOfBirth: e.currentTarget.value })
                }
              />
            </TextField>
          </Cell>
          <Cell columns={12}>
            <TextField className="full-width" label="Level of education">
              <Input
                type="text"
                value={levelOfEducation}
                placeholder="Level of education"
                onChange={e =>
                  this.setState({ levelOfEducation: e.currentTarget.value })
                }
              />
            </TextField>
          </Cell>
        </Row>
      </Grid>
    );
  }
}

export default connect(
  mapStateToProps,
  null,
  null,
  { withRef: true }
)(PatientForm);
