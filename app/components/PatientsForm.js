// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import TextField, { Input } from '@material/react-text-field';
import Select, { Option } from '@material/react-select';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import { omit } from 'lodash';
import type { Dispatch, State } from '../reducers/types';
import ErrorMessage from './ErrorMessage';
import { createPatient, updatePatient } from '../actions/patient';
import { fetchPatients } from '../actions/patients';

type StoreProps = {
  dispatch: Dispatch
};
type Props = State & StoreProps;

const mapStateToProps = ({ patient, site }) => ({ patient, site });

const defaultValues = {
  patientId: '',
  gender: 'not specified',
  yearOfBirth: new Date().getFullYear(),
  levelOfEducation: ''
};

class PatientForm extends Component<Props, State> {
  props: Props;

  state: State;

  handleSubmit() {
    const { dispatch, currentPatient, site } = this.props;
    if (currentPatient) {
      return dispatch(
        updatePatient(currentPatient.id, omit(this.state, ['patientId']))
      ).then(() => dispatch(fetchPatients({ siteId: site.id })));
    }
    return dispatch(createPatient(this.state));
  }

  constructor(props) {
    super(props);
    this.state = { ...defaultValues };
  }

  componentWillReceiveProps(nextProps) {
    const { currentPatient } = nextProps;
    if (currentPatient) {
      this.setState({
        patientId: currentPatient.patientId,
        gender: currentPatient.gender,
        yearOfBirth: currentPatient.yearOfBirth,
        levelOfEducation: currentPatient.levelOfEducation
      });
    } else {
      this.setState({ ...defaultValues });
    }
  }

  render() {
    const { patient, currentPatient } = this.props;
    const { patientId, yearOfBirth, levelOfEducation, gender } = this.state;

    const patientIdCell = currentPatient ? (
      <h3>{currentPatient.patientId || currentPatient.remotePatientId}</h3>
    ) : (
      <TextField className="full-width" label="Patient ID">
        <Input
          type="text"
          value={patientId}
          placeholder="Patient ID"
          onChange={e => this.setState({ patientId: e.currentTarget.value })}
        />
      </TextField>
    );
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
          <Cell columns={12}>{patientIdCell}</Cell>
          <Cell columns={12}>
            <Select
              className="full-width"
              value={gender}
              label="Gender"
              onChange={e => this.setState({ gender: e.target.value })}
            >
              <Option value="not specified">Not specified</Option>
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
