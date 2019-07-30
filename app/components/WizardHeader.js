import React from 'react';
import style from './WizardHeader.scss';

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

export default WizardHeader;
