import { Cell, Grid, Row } from '@material/react-layout-grid';
import TextField, { Input } from '@material/react-text-field';
import Button from '@material/react-button';
import Select, { Option } from '@material/react-select';
import Checkbox from '@material/react-checkbox';
import MaterialIcon from '@material/react-material-icon';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  createPatientEntry,
  updatePatientEntry
} from '../actions/patientEntry';
import { syncStart } from '../actions/sync';
import TextArea from './TextArea';
import EnumSelector from './EnumSelector';

import CombinedSelect from './CombinedSelect';

import type { Dispatch, State } from '../reducers/types';

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
    dispatch(syncStart());
    history.push(`/patients/${patientId}/entries`);
  };

  constructor(props) {
    super(props);
    this.state = {
      patientLocationId: 1,
      department: '',
      weight: '',
      height: '',
      pregnancyStatus: 'not_mentioned',
      prematureBirth: 'not_mentioned',
      chiefComplaint: '',
      patientTransferred: false,
      primaryDiagnosis: '',
      primaryDiagnosisIcdCode: '',
      acuteMyocardialInfarction: false,
      chf: false,
      notMentioned: false,
      other: false,
      antibioticsPrescribed: '',
      antibiotic: '',
      antibioticConsumption: '',
      patientWasOnAnIndwellingMedicalDevice: '',
      medicalDevice: '',
      infectionAcquisition: '',
      dischargeDiagnostic: '',
      dischargeDiagnosticIcdCode: '',
      patientOutcomeAtDischarge: '',
      ...Object.keys(props.defaultValues).reduce((acc, cur) => {
        if (props.defaultValues[cur] === null) {
          acc[cur] = '';
        } else {
          acc[cur] = props.defaultValues[cur];
        }
        return acc;
      }, {}),
      admissionDate: (props.defaultValues.admissionDate || new Date())
        .toISOString()
        .substr(0, 10),
      dischargeDate: (props.defaultValues.dischargeDate || new Date())
        .toISOString()
        .substr(0, 10)
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
      pregnancyStatus,
      prematureBirth,
      chiefComplaint,
      patientTransferred,
      primaryDiagnosis,
      primaryDiagnosisIcdCode,
      acuteMyocardialInfarction,
      chf,
      notMentioned,
      other,
      antibioticsPrescribed,
      antibiotic,
      antibioticConsumption,
      patientWasOnAnIndwellingMedicalDevice,
      medicalDevice,
      infectionAcquisition,
      dischargeDiagnostic,
      dischargeDiagnosticIcdCode
    } = this.state;
    const { history, patientId, action } = this.props;
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
              {patchLabel('Weight')}

              <TextField className="full-width">
                <Input
                  value={weight}
                  onChange={e =>
                    this.setState({ weight: e.currentTarget.value })
                  }
                />
              </TextField>
            </Cell>

            <Cell columns={2}>
              {patchLabel('Height')}

              <TextField className="full-width">
                <Input
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
            <Cell columns={4}>
              {patchLabel('Pregnancy status')}

              <Select
                className="full-width"
                value={pregnancyStatus}
                onChange={evt => {
                  this.setState({
                    pregnancyStatus: evt.target.value
                  });
                }}
              >
                <Option value="yes">Yes</Option>
                <Option value="no">No</Option>
                <Option value="not_applicable">Not applicable</Option>
                <Option value="not_mentioned">Not mentioned</Option>
              </Select>
            </Cell>
            <Cell columns={4}>
              {patchLabel('Premature birth')}
              <Select
                className="full-width"
                value={prematureBirth}
                onChange={evt => {
                  this.setState({
                    prematureBirth: evt.target.value
                  });
                }}
              >
                <Option value="yes">Yes</Option>
                <Option value="no">No</Option>
                <Option value="not_applicable">Not applicable</Option>
                <Option value="not_mentioned">Not mentioned</Option>
              </Select>
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
            <Cell columns={8}>
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
              <Checkbox
                nativeControlId="acute-myocardial-infarction"
                checked={acuteMyocardialInfarction}
                onChange={e =>
                  this.setState({
                    acuteMyocardialInfarction: e.target.checked
                  })
                }
              />
              <label htmlFor="acute-myocardial-infarction">
                Acute myocardial infarction
              </label>
              <Checkbox
                nativeControlId="chf"
                checked={chf}
                onChange={e =>
                  this.setState({
                    chf: e.target.checked
                  })
                }
              />
              <label htmlFor="chf">CHF</label>
              <Checkbox
                nativeControlId="not-mentioned"
                checked={notMentioned}
                onChange={e =>
                  this.setState({
                    notMentioned: e.target.checked
                  })
                }
              />
              <label htmlFor="not-mentioned">Not mentioned</label>
              <Checkbox
                nativeControlId="other"
                checked={other}
                onChange={e =>
                  this.setState({
                    other: e.target.checked
                  })
                }
              />
              <label htmlFor="other">Other</label>
            </Cell>
          </Row>
          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={8}>
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
          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={5}>
              {patchLabel('Antibiotic')}
              <TextField className="full-width">
                <Input
                  value={antibiotic}
                  onChange={e =>
                    this.setState({ antibiotic: e.currentTarget.value })
                  }
                />
              </TextField>
            </Cell>
            <Cell columns={3}>
              {patchLabel('Consumption')}
              <Select
                className="full-width"
                value={antibioticConsumption}
                enhanced
                onEnhancedChange={(index, item) => {
                  this.setState({
                    antibioticConsumption: item.getAttribute('data-value')
                  });
                }}
              >
                <Option value="pomsky">Pomsky</Option>
                <Option value="goldenDoodle">Golden Doodle</Option>
              </Select>
            </Cell>
          </Row>

          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={8}>
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
          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={8}>
              {patchLabel('Medical device')}
              <Select
                className="full-width"
                value={medicalDevice}
                enhanced
                onEnhancedChange={(index, item) => {
                  this.setState({
                    medicalDevice: item.getAttribute('data-value')
                  });
                }}
              >
                <Option value="pomsky">Pomsky</Option>
                <Option value="goldenDoodle">Golden Doodle</Option>
              </Select>
            </Cell>
          </Row>
          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={8}>
              {patchLabel('Infection acquisition')}
              <Select
                className="full-width"
                value={infectionAcquisition}
                enhanced
                onEnhancedChange={(index, item) => {
                  this.setState({
                    infectionAcquisition: item.getAttribute('data-value')
                  });
                }}
              >
                <Option value="pomsky">Pomsky</Option>
                <Option value="goldenDoodle">Golden Doodle</Option>
              </Select>
            </Cell>
          </Row>
          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={6}>
              {patchLabel('Discharge diagnostic')}
              <Select
                className="full-width"
                value={dischargeDiagnostic}
                enhanced
                onEnhancedChange={(index, item) => {
                  this.setState({
                    dischargeDiagnostic: item.getAttribute('data-value')
                  });
                }}
              >
                <Option value="pomsky">Pomsky</Option>
                <Option value="goldenDoodle">Golden Doodle</Option>
              </Select>
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
            <Cell columns={1}>
              <Button>Done</Button>
            </Cell>
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
