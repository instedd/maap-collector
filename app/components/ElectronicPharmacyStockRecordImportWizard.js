// @flow
import React, { Component } from 'react';
import Card from '@material/react-card';
import Button from '@material/react-button';
import MaterialIcon from '@material/react-material-icon';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import { remote } from 'electron';
import path from 'path';
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
import XlsxManager from '../utils/xlsxManager';

const templatePath =
  process.env.NODE_ENV === 'development'
    ? 'app/static/'
    : path.join(remote.app.getAppPath(), '../', 'app', 'static');

type Props = {
  dispatch: Dispatch
} & ReduxState &
  ContextRouter;

type State = {
  currentStep: number,
  loading: boolean,
  file: any
};

const STEPS = [
  ({
    dispatch,
    electronicPharmacyStockRecordImport,
    sheet,
    parseSheet
  }: Props) => (
    <DropZone
      file={electronicPharmacyStockRecordImport.file}
      headerRow={electronicPharmacyStockRecordImport.headerRow}
      dataRowsFrom={electronicPharmacyStockRecordImport.dataRowsFrom}
      dataRowsTo={electronicPharmacyStockRecordImport.dataRowsTo}
      title="Upload a file with Pharmacy Stock Records"
      template={`${templatePath}/electronicPharmacyRecordsTemplate.csv`}
      onChange={state => dispatch(setImportData(state))}
      parseSheet={parseSheet}
      sheet={sheet}
    />
  ),
  ({ dispatch, electronicPharmacyStockRecordImport, sheet }: Props) => (
    <ProtectedHealthInformationStep
      importData={{
        headerRow: electronicPharmacyStockRecordImport.headerRow,
        date: electronicPharmacyStockRecordImport.date,
        phi: electronicPharmacyStockRecordImport.phi,
        patientOrLabRecordId:
          electronicPharmacyStockRecordImport.patientOrLabRecordId,
        columns: electronicPharmacyStockRecordImport.columns
      }}
      withPatientOrLabRecordId={false}
      onChange={state => dispatch(setImportData(state))}
      sheet={sheet}
    />
  ),
  ({ dispatch, electronicPharmacyStockRecordImport, sheet }: Props) => (
    <ReviewStep
      importData={electronicPharmacyStockRecordImport}
      withPatientOrLabRecordId={false}
      title="REVIEW AND FINISH"
      subtitle="Click Next to import the rows displayed below, or Cancel to abort the process"
      onChange={state => dispatch(setImportData(state))}
      sheet={sheet}
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

  state: State = { currentStep: 0, loading: false, file: null };

  parseSheet = ({ file }) => {
    const sheet = new XlsxManager(file.path);
    this.setState({
      file: sheet
    });
  };

  handleNext = () => {
    const { dispatch, history } = this.props;
    const { currentStep, loading } = this.state;
    if (currentStep === STEPS.length - 1) {
      // It shouldn't reach this step with a loading=true state, but just to be sure
      if (loading) return;

      this.setState(
        {
          loading: true
        },
        () =>
          dispatch(createElectronicPharmacyStockRecord()).then(() =>
            history.push(`/electronic_pharmacy_stock_records`)
          )
      );
      return;
    }
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
    const { currentStep, loading, file } = this.state;
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
          <CurrentStepComponent
            {...this.props}
            parseSheet={this.parseSheet}
            sheet={file}
          />
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
              loading ||
              (currentStep === 0 &&
                (!(
                  electronicPharmacyStockRecordImport.file &&
                  headerRow &&
                  dataRowsTo &&
                  dataRowsFrom
                ) ||
                  headerRow < 0 ||
                  dataRowsFrom <= headerRow ||
                  dataRowsTo < dataRowsFrom))
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
