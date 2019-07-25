// @flow
import React, { Component } from 'react';
import Card from '@material/react-card';
import { Grid, Row, Cell } from '@material/react-layout-grid';

const { remote } = require('electron');
const XLSX = require('xlsx');

class LabRecordsImport extends Component<Props> {
  props: Props;

  handleClick = e => {
    e.preventDefault();
    /* show a file-open dialog and read the first selected file */
    const o = remote.dialog.showOpenDialog({ properties: ['openFile'] });
    const workbook = XLSX.readFile(o[0]);

    console.log(workbook);
  };

  render() {
    return (
      <Card>
        <Grid align="left">
          <Row>
            <Cell cols={12}>
              <h2>Import</h2>

              <a href="#" onClick={this.handleClick}>
                Import
              </a>
            </Cell>
          </Row>
        </Grid>
      </Card>
    );
  }
}

export default LabRecordsImport;
