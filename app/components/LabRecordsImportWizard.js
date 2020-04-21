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
import XlsxManager from '../utils/xlsxManager';
import ProtectedHealthInformationStep from './ProtectedHealthInformationStep';
import WizardHeader from './WizardHeader';
import {
  setImportData,
  createLabRecord,
  cleanLabRecordImport
} from '../actions/labRecordImport';
import style from './LabRecordImportWizard.scss';

type Props = {
  dispatch: Dispatch
} & ReduxState &
  ContextRouter;

type State = {
  currentStep: number,
  loading: boolean,
  file: any
};

const mapStateToProps = ({ labRecordImport, site }) => ({
  labRecordImport,
  site
});

class LabRecordsImportWizard extends Component<Props, State> {
  props: Props;

  state: State = {
    currentStep: 0,
    loading: false,
    file: null
  };

  STEPS = [
    ({ dispatch, labRecordImport, sheet, parseSheet }: Props) => (
      <DropZone
        file={labRecordImport.file}
        headerRow={labRecordImport.headerRow}
        dataRowsFrom={labRecordImport.dataRowsFrom}
        dataRowsTo={labRecordImport.dataRowsTo}
        parseSheet={parseSheet}
        sheet={sheet}
        title="UPLOAD A FILE WITH ALL THE NEW ENTRIES"
        onChange={state => dispatch(setImportData(state))}
      />
    )
  ];

  parseSheet = ({ file }) => {
    const sheet = new XlsxManager(file.path);
    this.setState({
      file: sheet
    });
  };

  handleNext = () => {
    const { dispatch, history } = this.props;
    const { currentStep, loading } = this.state;
    if (currentStep === this.STEPS.length - 1) {
      // It shouldn't reach this step with a loading=true state, but just to be sure
      if (loading) return;

      this.setState(
        {
          loading: true
        },
        () =>
          dispatch(createLabRecord()).then(labRecord =>
            history.push(`/lab_records/${labRecord.id}`)
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

  constructor(props) {
    super(props);
    if (props.site && props.site.hasHospital)
      this.STEPS.push(
        ({ dispatch, labRecordImport, sheet }: Props) => (
          <ProtectedHealthInformationStep
            importData={{
              headerRow: labRecordImport.headerRow,
              date: labRecordImport.date,
              phi: labRecordImport.phi,
              patientOrLabRecordId: labRecordImport.patientOrLabRecordId,
              columns: labRecordImport.columns
            }}
            sheet={sheet}
            withPatientOrLabRecord={false}
            onChange={state => dispatch(setImportData(state))}
          />
        ),
        ({ dispatch, labRecordImport, sheet }: Props) => (
          <ReviewStep
            title="Complete patient ID for record linking"
            subtitle="You could skip this and complete patient ID later from lab records"
            importData={labRecordImport}
            sheet={sheet}
            onChange={state => dispatch(setImportData(state))}
          />
        )
      );
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(cleanLabRecordImport());
  }

  render() {
    const { labRecordImport, site } = this.props;
    const { currentStep, loading, file } = this.state;
    const headerRow = parseInt(labRecordImport.headerRow, 10);
    const dataRowsTo = parseInt(labRecordImport.dataRowsTo, 10);
    const dataRowsFrom = parseInt(labRecordImport.dataRowsFrom, 10);
    const CurrentStepComponent = this.STEPS[currentStep];
    const headers = ['File upload'];
    if (site.hasHospital) headers.push('PHI', 'Patient ID');
    return (
      <Card>
        <WizardHeader currentStep={currentStep} steps={headers} />
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
                  labRecordImport.file &&
                  headerRow &&
                  dataRowsTo &&
                  dataRowsFrom
                ) ||
                  headerRow < 0 ||
                  dataRowsFrom <= headerRow ||
                  dataRowsTo < dataRowsFrom))
            }
          >
            {currentStep === this.STEPS.length - 1 ? (
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

export default connect(mapStateToProps)(withRouter(LabRecordsImportWizard));
