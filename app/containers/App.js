// @flow
import * as React from 'react';

import { Cell, Grid, Row } from '@material/react-layout-grid';

import NavBar from '../components/NavBar';

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    const { children } = this.props;
    return (
      <div>
        <NavBar />
        <Grid align="middle">
          <Row>
            <Cell columns={12}>{children}</Cell>
          </Row>
        </Grid>
      </div>
    );
  }
}
