// @flow
import * as React from 'react';

import { Cell, Grid, Row } from '@material/react-layout-grid';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import { syncStart } from '../actions/sync';
import { Dispatch } from '../reducers/types';

import NavBar from '../components/NavBar';

type Props = {
  children: React.Node,
  user: { data: {} },
  dispatch: Dispatch,
  location: {
    pathname: string
  }
} & ContextRouter;

const mapStateToProps = ({ user }) => ({ user });

class App extends React.Component<Props> {
  componentDidUpdate(prevProps) {
    const { dispatch, location } = this.props;
    if (location.pathname !== prevProps.location.pathname) {
      dispatch(syncStart());
    }
  }

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

export default connect(mapStateToProps)(withRouter(App));
