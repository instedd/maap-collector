import React, { Component } from 'react';
import MaterialIcon from '@material/react-material-icon';
import TextField, { Input } from '@material/react-text-field';
import { remote } from 'electron';
import fs from 'fs';
import XlsxManager from '../utils/xlsxManager';
import styles from './DropZone.scss';

type Props = {
  onChange?: () => void,
  file?: File | null,
  headerRow?: string | null,
  dataRowsFrom?: string | null,
  dataRowsTo?: string | null,
  title: string,
  template?: string
};
type State = {};

const initialState = {
  file: null,
  dragging: false,
  headerRow: '',
  dataRowsFrom: '',
  dataRowsTo: ''
};

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
    const { onChange } = this.props;
    e.preventDefault();
    this.setState({ dragging: false });

    onChange({ file: e.dataTransfer.files[0] });
    this.parseSheet({ file: e.dataTransfer.files[0] });
  };

  parseSheet = ({ file }) => {
    const sheet = new XlsxManager(file.path);

    this.setState({
      maxRow: sheet.maxRow
    });
  };

  handleChange = (field, e) => {
    const { onChange } = this.props;
    const { value, min, max } = e.target;
    const val =
      value === ''
        ? ''
        : Math.max(Number(min), Math.min(Number(max), Number(value)));

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
          fs.createWriteStream(filePathAndName)
        );
      }
    );
  };

  render() {
    const { dragging, maxRow } = this.state;
    const {
      file,
      headerRow,
      dataRowsFrom,
      dataRowsTo,
      onChange,
      title,
      template
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
              <div className={styles.fileLimits}>
                <TextField label="Header row" className="full-width">
                  <Input
                    className={styles.input}
                    type="number"
                    min="0"
                    max={maxRow}
                    value={headerRow}
                    onChange={e => this.handleChange('headerRow', e)}
                  />
                </TextField>
                <TextField label="Data rows from">
                  <Input
                    type="number"
                    className={styles.input}
                    min={parseInt(headerRow, 10) || 0 + 1}
                    max={maxRow}
                    value={dataRowsFrom}
                    onChange={e => this.handleChange('dataRowsFrom', e)}
                  />
                </TextField>
                <TextField label="Data rows to">
                  <Input
                    type="number"
                    className={styles.input}
                    min={parseInt(dataRowsFrom, 10) || 0 + 1}
                    max={maxRow}
                    value={dataRowsTo}
                    onChange={e => this.handleChange('dataRowsTo', e)}
                  />
                </TextField>
              </div>
            </div>
          ) : (
            <div className={styles.message}>
              <MaterialIcon icon="insert_drive_file" />
              Drop your files here (Excel) or&nbsp;
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  const files = remote.dialog.showOpenDialog({
                    properties: ['openFile']
                  });
                  if (!files) return;
                  console.log(files);
                  onChange({ file: { name: files[0], path: files[0] } });
                  this.parseSheet({ file: { name: files[0], path: files[0] } });
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
