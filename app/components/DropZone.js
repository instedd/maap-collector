import React, { Component } from 'react';
import MaterialIcon from '@material/react-material-icon';
import TextField, { Input } from '@material/react-text-field';
import styles from './DropZone.scss';

type Props = {
  onChange?: () => void,
  file?: File | null,
  headerRow?: string | null,
  dataRowsFrom?: string | null,
  dataRowsTo?: string | null
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
  };

  render() {
    const { dragging } = this.state;
    const { file, headerRow, dataRowsFrom, dataRowsTo, onChange } = this.props;
    return (
      <>
        <h2>UPLOAD A FILE WITH ALL THE NEW ENTRIES</h2>
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
              <h3>File</h3>
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
                    type="number"
                    value={headerRow}
                    onChange={e => onChange({ headerRow: e.target.value })}
                  />
                </TextField>
                <TextField label="Data rows from">
                  <Input
                    type="number"
                    value={dataRowsFrom}
                    onChange={e => onChange({ dataRowsFrom: e.target.value })}
                  />
                </TextField>
                <TextField label="Data rows to">
                  <Input
                    type="number"
                    value={dataRowsTo}
                    onChange={e => onChange({ dataRowsTo: e.target.value })}
                  />
                </TextField>
              </div>
            </div>
          ) : (
            <div className={styles.message}>
              <MaterialIcon icon="insert_drive_file" />
              Drop your files here (Excel) or&nbsp;
              <a href="#">Browse</a>
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
  dataRowsTo: ''
};

export default DropZone;
