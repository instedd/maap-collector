import React, { Component } from 'react';
import MaterialIcon from '@material/react-material-icon';
import TextField, { Input } from '@material/react-text-field';
import mime from 'mime-types';
import { remote } from 'electron';
import fs from 'fs';
import styles from './DropZone.scss';
import ErrorMessage from './ErrorMessage';

type Props = {
  onChange?: () => void,
  file?: File | null,
  headerRow?: string | null,
  dataRowsFrom?: string | null,
  dataRowsTo?: string | null,
  title: string,
  template?: string,
  sheet: any,
  parseSheet: () => void
};
type State = {};
const initialState = {
  file: null,
  dragging: false,
  headerRow: '',
  dataRowsFrom: '',
  dataRowsTo: ''
};

const permittedTypes = ['application/vnd.ms-excel', 'text/csv'];

class DropZone extends Component<Props, State> {
  state: State = initialState;

  handleCancel = () => {
    const { onChange } = this.props;
    onChange({ ...initialState });
  };

  handleStartDrag = e => {
    e.preventDefault();
    this.setState({ dragging: true });
  };

  handleStopDrag = e => {
    e.preventDefault();
    this.setState({ dragging: false });
  };

  handleDrop = e => {
    e.preventDefault();
    this.setState({ dragging: false });
    const file = e.dataTransfer.files[0];
    this.validateMimeType(file.path, { file });
  };

  validateMimeType = (filePath, data) => {
    const { onChange, parseSheet } = this.props;
    const type = mime.lookup(filePath);
    if (permittedTypes.some(k => k === type)) {
      onChange(data);
      this.setState({ error: null });
      parseSheet(data);
    } else {
      this.setState({
        error: 'Invalid file format. Valid ones are csv and xls'
      });
    }
  };

  handleChange = (field, e) => {
    const { onChange } = this.props;
    const { value, max } = e.target;
    const val =
      value === '' ? '' : Math.max(1, Math.min(Number(max), Number(value)));

    onChange({ [field]: val });
  };

  handleDownloadTemplate = () => {
    const { template } = this.props;
    remote.dialog.showSaveDialog(
      {
        title: 'Save example',
        filters: []
      },
      filePathAndName => {
        fs.createReadStream(template).pipe(
          fs.createWriteStream(`${filePathAndName}.csv`)
        );
      }
    );
  };

  render() {
    const { dragging, error } = this.state;
    const {
      file,
      headerRow,
      dataRowsFrom,
      dataRowsTo,
      title,
      template,
      sheet
    } = this.props;
    return (
      <>
        <h2>{title}</h2>
        {template ? (
          <h3 className={styles.subtitle}>
            (You can download an example{' '}
            <a
              href="#"
              tabIndex="-1"
              onKeyPress={e => {
                e.preventDefault();
                this.handleDownloadTemplate();
              }}
              onClick={e => {
                e.preventDefault();
                this.handleDownloadTemplate();
              }}
            >
              here
            </a>
            )
          </h3>
        ) : (
          ''
        )}
        <div
          className={[dragging ? styles.dragging : '', styles.dropzone].join(
            ' '
          )}
          onDragOver={this.handleStartDrag}
          onDragLeave={this.handleStopDrag}
          onDrop={this.handleDrop}
        >
          {file ? (
            <div className={[styles.message, styles.withFile].join(' ')}>
              <h5>File</h5>
              <div className={styles.fileName}>
                {file.name}
                <MaterialIcon
                  className="cursor-pointer"
                  icon="cancel"
                  onClick={this.handleCancel}
                />
              </div>
              <h4>Please delimit data ranges for your excel files</h4>
              <p>
                Leave last data row field blank if no auxiliary data after lab
                entries
              </p>
              {dataRowsTo &&
                dataRowsFrom &&
                dataRowsFrom < headerRow && (
                  <ErrorMessage>
                    First row cannot be lower than or equal to the header
                  </ErrorMessage>
                )}
              {dataRowsTo &&
                dataRowsTo < dataRowsFrom && (
                  <ErrorMessage>
                    Last row cannot be lower than the first row
                  </ErrorMessage>
                )}
              <div className={styles.fileLimits}>
                <TextField label="Header row" className="full-width">
                  <Input
                    className={styles.input}
                    type="number"
                    min="0"
                    max={sheet.maxRow}
                    value={headerRow}
                    onChange={e => this.handleChange('headerRow', e)}
                  />
                </TextField>
                <TextField label="Data rows from">
                  <Input
                    type="number"
                    className={styles.input}
                    min={parseInt(headerRow, 10) || 0 + 1}
                    max={sheet.maxRow}
                    value={dataRowsFrom}
                    onChange={e => this.handleChange('dataRowsFrom', e)}
                  />
                </TextField>
                <TextField label="Data rows to">
                  <Input
                    type="number"
                    className={styles.input}
                    min={parseInt(dataRowsFrom, 10) || 0 + 1}
                    max={sheet.maxRow}
                    value={dataRowsTo}
                    onChange={e => this.handleChange('dataRowsTo', e)}
                  />
                </TextField>
              </div>
            </div>
          ) : (
            <div className={styles.message}>
              <MaterialIcon icon="insert_drive_file" />
              {error && <ErrorMessage center>{error}</ErrorMessage>}
              Drop your files here (Excel) or&nbsp;
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  const files = remote.dialog.showOpenDialog({
                    properties: ['openFile']
                  });
                  if (!files) return;
                  this.validateMimeType(files[0], {
                    file: { name: files[0], path: files[0] }
                  });
                }}
              >
                Browse
              </a>
            </div>
          )}
        </div>
      </>
    );
  }
}

DropZone.defaultProps = {
  onChange: () => {},
  file: null,
  headerRow: '',
  dataRowsFrom: '',
  dataRowsTo: '',
  template: ''
};

export default DropZone;
