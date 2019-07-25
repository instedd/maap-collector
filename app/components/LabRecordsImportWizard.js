// @flow
import React, { Component } from 'react';
import Card from '@material/react-card';
import style from './LabRecordImportWizard.scss';

type WizardHeaderProps = {
  currentStep: number,
  steps: Array<string>
};

const WizardHeader = ({ currentStep, steps }: WizardHeaderProps) => (
  <div className={style.wizardHeader}>
    {steps.map((step, index) => (
      <div
        // eslint-disable-next-line
        key={index}
        className={[
          index <= currentStep ? style.active : '',
          style.wizardHeaderStep
        ].join(' ')}
      >
        <i>{index + 1}</i>
        {step}
      </div>
    ))}
  </div>
);

type Props = {};

type State = {
  currentStep: number
};

class LabRecordsImport extends Component<Props, State> {
  props: Props;

  state: State = { currentStep: 0 };

  render() {
    const { currentStep } = this.state;
    return (
      <Card>
        <WizardHeader
          currentStep={currentStep}
          steps={['File upload', 'PHI', 'Patient ID']}
        />
        asd asd
      </Card>
    );
  }
}

export default LabRecordsImport;
