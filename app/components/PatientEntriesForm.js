// @flow

import { Cell, Grid, Row } from '@material/react-layout-grid';
import TextField, { Input } from '@material/react-text-field';
import Button from '@material/react-button';
import Select, { Option } from '@material/react-select';
import Checkbox from '@material/react-checkbox';
import MaterialIcon from '@material/react-material-icon';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createPatientEntry } from '../actions/patientEntry';
import TextArea from './TextArea';

// Tested in this form:
// import CombinedSelect from '../components/CombinedSelect';

import type { Dispatch, State } from '../reducers/types';

type StoreProps = {
  dispatch: Dispatch
};
type Props = State & StoreProps;

class PatientEntriesForm extends Component<Props, State> {
  state: State = {
    location: '',
    department: '',
    admissionDate: new Date().toISOString().substr(0, 10),
    dischargeDate: new Date().toISOString().substr(0, 10),
    weight: '',
    height: '',
    pregnancyStatus: '',
    prematureBirth: '',
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
    patientOutcomeAtDischarge: ''
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

  componentDidMount() {
    // This is a patch for the checkbox, otherwise they show a ripple of the screensize on mouseover
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
  }

  render() {
    const {
      location,
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
    const { history, patientId } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <Grid>
          <Row>
            <Cell>
              <h2>New entry</h2>
            </Cell>
          </Row>
          <Row align="center">
            <Cell columns={8}>
              <Select
                label="Location"
                className="full-width"
                value={location}
                enhanced
                onEnhancedChange={(index, item) => {
                  this.setState({ location: item.getAttribute('data-value') });
                }}
              >
                <Option value="pomsky">Pomsky</Option>
                <Option value="goldenDoodle">Golden Doodle</Option>
              </Select>
            </Cell>
            <Cell columns={8}>
              <Select
                label="Department"
                className="full-width"
                value={department}
                enhanced
                onEnhancedChange={(index, item) => {
                  this.setState({
                    department: item.getAttribute('data-value')
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
            <Cell columns={4}>
              <TextField
                label="Admission date"
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
              <TextField
                label="Discharge date"
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
              <TextField label="Weight" className="full-width">
                <Input
                  value={weight}
                  onChange={e =>
                    this.setState({ weight: e.currentTarget.value })
                  }
                />
              </TextField>
            </Cell>

            <Cell columns={2}>
              <TextField label="Height" className="full-width">
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
              <Select
                label="Pregnancy status"
                className="full-width"
                value={pregnancyStatus}
                enhanced
                onEnhancedChange={(index, item) => {
                  this.setState({
                    pregnancyStatus: item.getAttribute('data-value')
                  });
                }}
              >
                <Option value="pomsky">Pomsky</Option>
                <Option value="goldenDoodle">Golden Doodle</Option>
              </Select>
            </Cell>
            <Cell columns={4}>
              <Select
                label="Premature birth"
                className="full-width"
                value={prematureBirth}
                enhanced
                onEnhancedChange={(index, item) => {
                  this.setState({
                    prematureBirth: item.getAttribute('data-value')
                  });
                }}
              >
                <Option value="pomsky">Pomsky</Option>
                <Option value="goldenDoodle">Golden Doodle</Option>
              </Select>
            </Cell>
          </Row>
          <Row align="center">
            <Cell columns={12} />
            <Cell columns={8}>
              <TextField label="Chief Complaint" className="full-width">
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
              <TextField label="Primary diagnosis" className="full-width">
                <Input
                  value={primaryDiagnosis}
                  onChange={e =>
                    this.setState({ primaryDiagnosis: e.currentTarget.value })
                  }
                />
              </TextField>
            </Cell>
            <Cell columns={2}>
              <TextField label="ICD code" className="full-width">
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
            <Cell columns={8} align="middle">
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
          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={5} align="middle">
              <TextField label="Antibiotic" className="full-width">
                <Input
                  value={antibiotic}
                  onChange={e =>
                    this.setState({ antibiotic: e.currentTarget.value })
                  }
                />
              </TextField>
            </Cell>
            <Cell columns={3}>
              <Select
                label="Consumption"
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
          <Row>
            <Cell columns={12} />
            <Cell columns={2} />
            <Cell columns={8} align="middle">
              <Select
                label="Medical device"
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
            <Cell columns={8} align="middle">
              <Select
                label="Infection acquisition"
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
            <Cell columns={6} align="middle">
              <Select
                label="Discharge diagnostic"
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
              <TextField label="ICD code" className="full-width">
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
              <TextArea
                value={patientOutcomeAtDischarge}
                label="Patient outcome at discharge"
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

export default withRouter(
  connect(
    null,
    null,
    null,
    { withRef: true }
  )(PatientEntriesForm)
);
