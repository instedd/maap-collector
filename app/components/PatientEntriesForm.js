import { Cell, Grid, Row } from '@material/react-layout-grid';
import TextField, { Input } from '@material/react-text-field';
import Button from '@material/react-button';
import Checkbox from '@material/react-checkbox';
import pluralize from 'pluralize';
import { startCase, isEmpty } from 'lodash';
import MaterialIcon from '@material/react-material-icon';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import changeCase from 'change-case';
import {
  createPatientEntry,
  updatePatientEntry
} from '../actions/patientEntry';
import {
  all as allComorbidities,
  comorbiditiesFromValues
} from '../models/comorbidities';
import {
  all as allAntibioticPrescriptionTimes,
  byValue as antibioticPrescriptionTimeByValue
} from '../models/antibioticPrescriptionTimes';
import isDate from '../utils/isDate';
import TextArea from './TextArea';
import EnumSelector from './EnumSelector';

import CombinedSelect from './CombinedSelect';

import type { Dispatch, State } from '../reducers/types';
import ErrorMessage from './ErrorMessage';
import styles from './PatientEntriesForm.scss';

type StoreProps = {
  dispatch: Dispatch
};
type Props = State &
  StoreProps & {
    action: string,
    defaultValues: {}
  };

const patchLabel = label => (
  <div style={{ textAlign: 'start', fontSize: '0.9em', color: 'dimgray' }}>
    {label}
  </div>
);

class PatientEntriesForm extends Component<Props, State> {
  handleSubmit = async e => {
    e.preventDefault();
    const { dispatch, history, patientId, patientEntryId } = this.props;
    if (patientEntryId) {
      await dispatch(
        updatePatientEntry(patientEntryId, {
          ...this.state,
          patientId,
          patientEntryId
        })
      );
    } else {
      await dispatch(
        createPatientEntry({
          ...this.state,
          patientId
        })
      );
    }
    history.push(`/patients/${patientId}/entries`);
  };

  errors() {
    const { ageValue, ageUnit } = this.state;
    const errors = {};
    if ((ageValue && !ageUnit) || (ageUnit && !ageValue)) {
      errors.age = 'Please specify both age and age unit';
      return errors;
    }
    if (ageUnit === 'year' && ageValue < 5) {
      errors.age = "Please set unit to 'Months' if age is lower than 5 years";
      return errors;
    }
    if (ageUnit === 'month' && ageValue === 0) {
      errors.age = 'Please specify age in days if age is less than a month';
      return errors;
    }
    return errors;
  }

  constructor(props) {
    super(props);
    this.state = {
      patientLocationId: 1,
      department: '',
      weight: '',
      height: '',
      ageValue: '',
      ageUnit: '',
      pregnancyStatus: 'not_mentioned',
      prematureBirth: 'not_mentioned',
      chiefComplaint: '',
      patientTransferred: false,
      primaryDiagnosis: '',
      primaryDiagnosisIcdCode: '',
      antibioticsPrescribed: '',
      prescribedAntibioticsList: '',
      patientWasOnAnIndwellingMedicalDevice: '',
      medicalDevice: '',
      infectionAcquisition: '',
      dischargeDiagnostic: '',
      dischargeDiagnosticIcdCode: '',
      patientOutcomeAtDischarge: '',
      comorbidities: '',
      antibioticWhen: '',
      ...Object.keys(props.defaultValues).reduce((acc, cur) => {
        if (props.defaultValues[cur] === null) {
          acc[cur] = '';
        } else {
          acc[cur] = props.defaultValues[cur];
        }
        return acc;
      }, {}),
      admissionDate: isDate(props.defaultValues.admissionDate)
        ? props.defaultValues.admissionDate.toISOString().substr(0, 10)
        : '',
      dischargeDate: isDate(props.defaultValues.dischargeDate)
        ? props.defaultValues.dischargeDate.toISOString().substr(0, 10)
        : ''
    };
  }

  componentDidMount() {
    // This is a patch for the checkbox, otherwise they show a ripple of the screensize on mouseover
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
  }

  render() {
    const {
      patientLocationId,
      department,
      patientOutcomeAtDischarge,
      admissionDate,
      dischargeDate,
      weight,
      height,
      ageValue,
      ageUnit,
      pregnancyStatus,
      prematureBirth,
      chiefComplaint,
      patientTransferred,
      primaryDiagnosis,
      primaryDiagnosisIcdCode,
      antibioticsPrescribed,
      patientWasOnAnIndwellingMedicalDevice,
      medicalDevice,
      infectionAcquisition,
      dischargeDiagnostic,
      dischargeDiagnosticIcdCode,
      comorbidities,
      antibioticWhen,
      prescribedAntibioticsList
    } = this.state;
    const { history, patientId, action, antibioticOptions } = this.props;

    const errors = this.errors();

    const submitButton = isEmpty(errors) ? (
      <Cell columns={1}>
        <Button>Done</Button>
      </Cell>
    ) : (
      <Cell columns={1}>
        <Button disabled>Check errors</Button>
      </Cell>
    );

    return (
      <form onSubmit={this.handleSubmit}>
        <Grid>
          <Row>
            <Cell>
              <h2>{action} entry</h2>
            </Cell>
          </Row>
          <Row align="center">
            <Cell columns={8}>
              {patchLabel('Location')}
              <EnumSelector
                className="full-width"
                entityName="PatientLocation"
                onSelectionChange={selectedId =>
                  this.setState({ patientLocationId: selectedId })
                }
                value={patientLocationId}
              />
            </Cell>
            <Cell columns={8}>
              {patchLabel('Department')}
              <CombinedSelect
                creatable
                className="full-width"
                value={department
                  .split(', ')
                  .filter(i => i !== '')
                  .map(item => ({ value: item, label: item }))}
                isMulti
                onChange={val => {
                  this.setState({
                    department: [...val].map(({ value }) => value).join(', ')
                  });
                }}
                options={[
                  { value: 'medicine', label: 'Medicine' },
                  { value: 'surgery', label: 'Surgery' },
                  { value: 'obstetric', label: 'Obstetric/maternity' },
                  { value: 'gynaecology', label: 'Gynaecology' },
                  { value: 'paediatric', label: 'Paediatric' },
                  { value: 'neonatal', label: 'Neonatal' },
                  { value: 'burns', label: 'Burns' },
                  { value: 'orthopaedics', label: 'Orthopaedics' },
                  { value: 'geriatric', label: 'Geriatric' },
                  { value: 'ent', label: 'Ear, Nose Throat (ENT)' },
                  { value: 'eye', label: 'Eye' },
                  { value: 'not_mentioned', label: 'Not mentioned' }
                ]}
              />
            </Cell>
          </Row>
          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={4}>
              {patchLabel('Admission date')}
              <TextField
                className="full-width"
                trailingIcon={<MaterialIcon role="button" icon="event" />}
              >
                <Input
                  type="date"
                  value={admissionDate}
                  onChange={e =>
                    this.setState({ admissionDate: e.currentTarget.value })
                  }
                />
              </TextField>
            </Cell>

            <Cell columns={4}>
              {patchLabel('Discharge date')}

              <TextField
                className="full-width"
                trailingIcon={<MaterialIcon role="button" icon="event" />}
              >
                <Input
                  type="date"
                  value={dischargeDate}
                  onChange={e =>
                    this.setState({ dischargeDate: e.currentTarget.value })
                  }
                />
              </TextField>
            </Cell>
          </Row>
          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={2}>
              {patchLabel('Weight (kg)')}

              <TextField className="full-width">
                <Input
                  type="number"
                  value={weight}
                  onChange={e =>
                    this.setState({ weight: e.currentTarget.value })
                  }
                />
              </TextField>
            </Cell>

            <Cell columns={2}>
              {patchLabel('Height (m)')}

              <TextField className="full-width">
                <Input
                  type="number"
                  value={height}
                  onChange={e =>
                    this.setState({ height: e.currentTarget.value })
                  }
                />
              </TextField>
            </Cell>
          </Row>
          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={2}>
              {patchLabel('Age')}

              <TextField className={`${styles.ageValue} full-width`}>
                <Input
                  type="number"
                  value={ageValue}
                  onChange={e =>
                    this.setState({ ageValue: e.currentTarget.value })
                  }
                />
              </TextField>
            </Cell>

            <Cell columns={2}>
              {patchLabel('Age Unit')}

              <CombinedSelect
                value={{ value: ageUnit, label: startCase(pluralize(ageUnit)) }}
                label=""
                isMulti={false}
                creatable={false}
                options={[
                  { value: 'year', label: 'Years' },
                  { value: 'month', label: 'Months' },
                  { value: 'day', label: 'Days' }
                ]}
                onChange={v => this.setState({ ageUnit: v.value })}
              />
            </Cell>
          </Row>
          {errors.age ? (
            <Row>
              <Cell columns={12} />
              <Cell columns={2} />

              <Cell columns={4}>
                <ErrorMessage key={errors.age}>{errors.age}</ErrorMessage>
              </Cell>
            </Row>
          ) : (
            <></>
          )}
          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={4}>
              {patchLabel('Pregnancy status')}

              <CombinedSelect
                className="full-width"
                value={{
                  value: pregnancyStatus,
                  label: changeCase.sentenceCase(pregnancyStatus)
                }}
                onChange={val => {
                  this.setState({
                    pregnancyStatus: val.value
                  });
                }}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                  { value: 'not_applicable', label: 'Not applicable' },
                  { value: 'not_mentioned', label: 'Not mentioned' }
                ]}
              />
            </Cell>
            <Cell columns={4}>
              {patchLabel('Premature birth')}
              <CombinedSelect
                className="full-width"
                value={{
                  value: prematureBirth,
                  label: changeCase.sentenceCase(prematureBirth)
                }}
                onChange={val => {
                  this.setState({
                    prematureBirth: val.value
                  });
                }}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                  { value: 'not_applicable', label: 'Not applicable' },
                  { value: 'not_mentioned', label: 'Not mentioned' }
                ]}
              />
            </Cell>
          </Row>
          <Row align="center">
            <Cell columns={12} />
            <Cell columns={8}>
              {patchLabel('Chief Complaint')}

              <TextField className="full-width">
                <Input
                  value={chiefComplaint}
                  onChange={e =>
                    this.setState({ chiefComplaint: e.currentTarget.value })
                  }
                />
              </TextField>
            </Cell>
          </Row>
          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={8} align="middle">
              <Checkbox
                nativeControlId="patient-transferred"
                checked={patientTransferred}
                onChange={e =>
                  this.setState({
                    patientTransferred: e.target.checked
                  })
                }
              />
              <label htmlFor="patient-transferred">
                Patient was transferred from another clinical set-up
              </label>
            </Cell>
          </Row>
          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={6}>
              {patchLabel('Primary diagnosis')}
              <TextField className="full-width">
                <Input
                  value={primaryDiagnosis}
                  onChange={e =>
                    this.setState({ primaryDiagnosis: e.currentTarget.value })
                  }
                />
              </TextField>
            </Cell>
            <Cell columns={2}>
              {patchLabel('ICD code')}
              <TextField className="full-width">
                <Input
                  value={primaryDiagnosisIcdCode}
                  onChange={e =>
                    this.setState({
                      primaryDiagnosisIcdCode: e.currentTarget.value
                    })
                  }
                />
              </TextField>
            </Cell>
          </Row>
          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={8}>
              {patchLabel('Comorbidities')}
              <CombinedSelect
                creatable
                className="full-width"
                value={comorbiditiesFromValues(
                  comorbidities.split(', ').filter(i => i !== '')
                )}
                isMulti
                onChange={val => {
                  this.setState({
                    comorbidities: [...val].map(({ value }) => value).join(', ')
                  });
                }}
                options={allComorbidities}
              />
            </Cell>
          </Row>
          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={8} align="middle">
              <Checkbox
                nativeControlId="antibiotics-prior-to-sampling"
                checked={antibioticsPrescribed}
                onChange={e =>
                  this.setState({
                    antibioticsPrescribed: e.target.checked
                  })
                }
              />
              <label htmlFor="antibiotics-prior-to-sampling">
                Antibiotics were prescribed to patient prior to sampling
              </label>
            </Cell>
          </Row>
          {antibioticsPrescribed ? (
            <>
              <Row>
                <Cell columns={12} />
                <Cell columns={2} />
                <Cell columns={8}>
                  {patchLabel('When was the antibiotic prescribed?')}
                  <CombinedSelect
                    creatable
                    className="full-width"
                    value={antibioticPrescriptionTimeByValue(antibioticWhen)}
                    onChange={val => {
                      this.setState({
                        antibioticWhen: val.value
                      });
                    }}
                    options={allAntibioticPrescriptionTimes}
                  />
                </Cell>
              </Row>
              <Row>
                <Cell columns={12} />
                <Cell columns={2} />
                <Cell columns={8}>
                  {patchLabel('Prescribed antibiotics')}
                  <CombinedSelect
                    className="full-width"
                    value={prescribedAntibioticsList
                      .split(', ')
                      .filter(i => i !== '')
                      .map(val => ({ value: val, label: val }))}
                    isMulti
                    onChange={val => {
                      this.setState({
                        prescribedAntibioticsList: [...val]
                          .map(({ value }) => value)
                          .join(', ')
                      });
                    }}
                    options={antibioticOptions}
                  />
                </Cell>
              </Row>
            </>
          ) : null}
          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={8} align="middle">
              <Checkbox
                nativeControlId="indwelling-device"
                checked={patientWasOnAnIndwellingMedicalDevice}
                onChange={e =>
                  this.setState({
                    patientWasOnAnIndwellingMedicalDevice: e.target.checked
                  })
                }
              />
              <label htmlFor="indwelling-device">
                The patient was on an indwelling medical device at time of
                sampling
              </label>
            </Cell>
          </Row>
          {patientWasOnAnIndwellingMedicalDevice ? (
            <>
              <Row>
                <Cell columns={12} />
                <Cell columns={2} />
                <Cell columns={8}>
                  {patchLabel('Indwelling Medical Devices')}
                  <CombinedSelect
                    creatable
                    className="full-width"
                    value={medicalDevice
                      .split(', ')
                      .filter(i => i !== '')
                      .map(item => ({ value: item, label: item }))}
                    isMulti
                    onChange={val => {
                      this.setState({
                        medicalDevice: [...val]
                          .map(({ value }) => value)
                          .join(', ')
                      });
                    }}
                    options={[
                      { value: 'Ventilator', label: 'Ventilator' },
                      { value: 'Central Line', label: 'Central Line' },
                      { value: 'Urinary Catheter', label: 'Urinary Catheter' },
                      { value: 'Not mentioned', label: 'Not mentioned' }
                    ]}
                  />
                </Cell>
              </Row>
            </>
          ) : null}
          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={8}>
              {patchLabel('Where was the infection acquired?')}
              <CombinedSelect
                creatable
                className="full-width"
                value={{
                  value: infectionAcquisition,
                  label: infectionAcquisition
                }}
                onChange={val => {
                  this.setState({
                    infectionAcquisition: val.value
                  });
                }}
                options={[
                  { value: 'Community', label: 'Community' },
                  { value: 'Hospital', label: 'Hospital' },
                  { value: 'Not mentioned', label: 'Not mentioned' }
                ]}
              />
            </Cell>
          </Row>
          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={6}>
              {patchLabel('Discharge diagnosis')}
              <TextField className="full-width">
                <Input
                  value={dischargeDiagnostic}
                  onChange={e =>
                    this.setState({
                      dischargeDiagnostic: e.currentTarget.value
                    })
                  }
                />
              </TextField>
            </Cell>
            <Cell columns={2}>
              {patchLabel('ICD code')}
              <TextField className="full-width">
                <Input
                  value={dischargeDiagnosticIcdCode}
                  onChange={e =>
                    this.setState({
                      dischargeDiagnosticIcdCode: e.currentTarget.value
                    })
                  }
                />
              </TextField>
            </Cell>
          </Row>
          <Row align="center">
            <Cell columns={2} />
            <Cell columns={8}>
              {patchLabel('Patient outcome at discharge')}
              <TextArea
                value={patientOutcomeAtDischarge}
                onChange={e =>
                  // $FlowFixMe
                  this.setState({ patientOutcomeAtDischarge: e.target.value })
                }
              />
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
            {submitButton}
          </Row>
        </Grid>
      </form>
    );
  }
}

PatientEntriesForm.defaultProps = {
  action: 'New',
  defaultValues: {}
};

export default withRouter(
  connect(
    null,
    null,
    null,
    { withRef: true }
  )(PatientEntriesForm)
);
