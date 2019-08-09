// @flow
import * as React from 'react';

import { Cell, Grid, Row } from '@material/react-layout-grid';
import { connect } from 'react-redux';

import NavBar from '../components/NavBar';

type Props = {
  children: React.Node,
  user: { data: {} }
};

const mapStateToProps = ({ user }) => ({ user });

class App extends React.Component<Props> {
  props: Props;

  render() {
    const { children, user } = this.props;
    return (
      <div>
        {user.data && <NavBar />}
        <Grid align="middle" className="app">
          <Row>
            <Cell columns={12}>{children}</Cell>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
