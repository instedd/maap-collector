// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Routes from '../Routes';
import { Dispatch } from '../reducers/types';
import { runMigrations } from '../actions/migrations';
import { syncStart } from '../actions/sync';

type Props = {
  history: *,
  migrations: { ran: boolean },
  user: *,
  dispatch: Dispatch
};

const mapStateToProps = ({ migrations, user }) => ({ migrations, user });

class AppEntryPoint extends React.Component<Props> {
  shouldRunMigrations() {
    const { migrations, user } = this.props;
    return user.data && !migrations.ran;
  }

  checkMigrations() {
    const { dispatch } = this.props;

    if (this.shouldRunMigrations()) {
      return dispatch(runMigrations()).then(() => dispatch(syncStart()));
    }
  }

  componentDidMount() {
    this.checkMigrations();
  }

  componentDidUpdate() {
    this.checkMigrations();
  }

  render() {
    const { history } = this.props;

    if (this.shouldRunMigrations()) {
      return <>Checking migrations...</>;
    }

    return (
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    );
  }
}

export default connect(mapStateToProps)(AppEntryPoint);
