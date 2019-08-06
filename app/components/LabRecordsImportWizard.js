// @flow
import React, { Component } from 'react';
import Card from '@material/react-card';
import Button from '@material/react-button';
import MaterialIcon from '@material/react-material-icon';
import { connect } from 'react-redux';
import DropZone from './DropZone';
import PatientIdStep from './PatientIdStep';
import type { Dispatch } from '../reducers/types';
import ProtectedHealthInformationStep from './ProtectedHealthInformationStep';
import WizardHeader from './WizardHeader';
import { setFileData, createLabRecord } from '../actions/labRecordImport';
import style from './LabRecordImportWizard.scss';

type Props = {
  dispatch: Dispatch
};

type State = {
  currentStep: number
};

const STEPS = [
  ({ dispatch, labRecordImport }) => (
    <DropZone
      {...labRecordImport}
      onChange={state => dispatch(setFileData(state))}
    />
  ),
  ProtectedHealthInformationStep,
  PatientIdStep
];

const mapStateToProps = ({ labRecordImport }) => ({ labRecordImport });

class LabRecordsImport extends Component<Props, State> {
  props: Props;

  state: State = { currentStep: 0 };

  handleNext = () => {
    const { dispatch } = this.props;
    const { currentStep } = this.state;
    if (currentStep === STEPS.length - 1) return dispatch(createLabRecord());
    this.setState({ currentStep: currentStep + 1 });
  };

  handlePrevious = () => {
    const { currentStep } = this.state;
    if (currentStep === 0) return;
    this.setState({ currentStep: currentStep - 1 });
  };

  render() {
    const { currentStep } = this.state;
    const CurrentStepComponent = STEPS[currentStep];
    return (
      <Card>
        <WizardHeader
          currentStep={currentStep}
          steps={['File upload', 'PHI', 'Patient ID']}
        />
        <div className={style.wizardBody}>
          {/* $FlowFixMe */}
          <CurrentStepComponent {...this.props} />
        </div>
        <div className={style.wizardFooter}>
          <Button onClick={this.handlePrevious}>
            {currentStep === 0 ? (
              'Cancel'
            ) : (
              <>
                <MaterialIcon icon="keyboard_arrow_left" /> Previous
              </>
            )}
          </Button>
          <Button onClick={this.handleNext}>
            {currentStep === STEPS.length - 1 ? (
              'Finish'
            ) : (
              <>
                Next <MaterialIcon icon="keyboard_arrow_right" />
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }
}

export default connect(mapStateToProps)(LabRecordsImport);
