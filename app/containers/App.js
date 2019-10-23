// @flow
import * as React from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import { syncStart } from '../actions/sync';
import { Dispatch } from '../reducers/types';
import styles from './App.scss';

import NavBar from '../components/NavBar';

type Props = {
  children: React.Node,
  user: { auth: {} },
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
        {user.auth && <NavBar />}
        <div className={styles.Content}>{children}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(App));
