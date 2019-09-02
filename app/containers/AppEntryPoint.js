// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Routes from '../Routes';
import { Dispatch } from '../reducers/types';
import { runMigrations } from '../actions/migrations';

type Props = {
  history: *,
  migrations: { ran: boolean },
  dispatch: Dispatch
};

const mapStateToProps = ({ migrations }) => ({ migrations });

class AppEntryPoint extends React.Component<Props> {
  componentDidMount() {
    const { migrations, dispatch } = this.props;

    if (!migrations.ran) {
      dispatch(runMigrations());
    }
  }

  render() {
    const { migrations, history } = this.props;

    if (!migrations.ran) {
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
