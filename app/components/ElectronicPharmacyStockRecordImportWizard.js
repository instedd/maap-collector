// @flow
import React, { Component } from 'react';
import Card from '@material/react-card';
import Button from '@material/react-button';
import MaterialIcon from '@material/react-material-icon';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import DropZone from './DropZone';
import ReviewStep from './ReviewStep';
import type { Dispatch, State as ReduxState } from '../reducers/types';
import ProtectedHealthInformationStep from './ProtectedHealthInformationStep';
import WizardHeader from './WizardHeader';
import {
  setImportData,
  cleanWizard,
  createElectronicPharmacyStockRecord
} from '../actions/electronicPharmacyStockRecordImport';
import style from './LabRecordImportWizard.scss';

type Props = {
  dispatch: Dispatch
} & ReduxState &
  ContextRouter;

type State = {
  currentStep: number
};

const STEPS = [
  ({ dispatch, electronicPharmacyStockRecordImport }) => (
    <DropZone
      {...electronicPharmacyStockRecordImport}
      title="Upload a file with the Electronic Pharmacy Stock Records"
      onChange={state => dispatch(setImportData(state))}
    />
  ),
  ({ dispatch, electronicPharmacyStockRecordImport }: Props) => (
    <ProtectedHealthInformationStep
      importData={electronicPharmacyStockRecordImport}
      withPatientOrLabRecordId={false}
      onChange={state => dispatch(setImportData(state))}
    />
  ),
  ({ dispatch, electronicPharmacyStockRecordImport }: Props) => (
    <ReviewStep
      importData={electronicPharmacyStockRecordImport}
      withPatientOrLabRecordId={false}
      onChange={state => dispatch(setImportData(state))}
    />
  )
];

const mapStateToProps = ({ electronicPharmacyStockRecordImport }) => ({
  electronicPharmacyStockRecordImport
});

class ElectronicPharmacyStockRecordImportWizard extends Component<
  Props,
  State
> {
  props: Props;

  state: State = { currentStep: 0 };

  handleNext = () => {
    const { dispatch, history } = this.props;
    const { currentStep } = this.state;
    if (currentStep === STEPS.length - 1)
      return dispatch(createElectronicPharmacyStockRecord()).then(() =>
        history.push(`/electronic_pharmacy_stock_records`)
      );
    this.setState({ currentStep: currentStep + 1 });
  };

  handlePrevious = () => {
    const { currentStep } = this.state;
    const { history } = this.props;
    if (currentStep === 0) return history.push('/');
    this.setState({ currentStep: currentStep - 1 });
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(cleanWizard());
  }

  render() {
    const { electronicPharmacyStockRecordImport } = this.props;
    const { currentStep } = this.state;
    const headerRow = parseInt(
      electronicPharmacyStockRecordImport.headerRow,
      10
    );
    const dataRowsTo = parseInt(
      electronicPharmacyStockRecordImport.dataRowsTo,
      10
    );
    const dataRowsFrom = parseInt(
      electronicPharmacyStockRecordImport.dataRowsFrom,
      10
    );
    const CurrentStepComponent = STEPS[currentStep];
    return (
      <Card>
        <WizardHeader
          currentStep={currentStep}
          steps={['File upload', 'PHI', 'Review and finish']}
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
          <Button
            onClick={this.handleNext}
            disabled={
              currentStep === 0 &&
              (!(
                electronicPharmacyStockRecordImport.file &&
                headerRow &&
                dataRowsTo &&
                dataRowsFrom
              ) ||
                headerRow < 0 ||
                dataRowsFrom <= headerRow ||
                dataRowsTo <= dataRowsFrom)
            }
          >
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

export default connect(mapStateToProps)(
  withRouter(ElectronicPharmacyStockRecordImportWizard)
);
