// @flow
/* eslint no-plusplus: off */
import React, { Component } from 'react';
import Button from '@material/react-button';
import Card, { CardActions, CardActionButtons } from '@material/react-card';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import TextField, { Input } from '@material/react-text-field';
import { connect } from 'react-redux';
import type { Dispatch } from '../reducers/types';
import { requestLogin, USER_LOGGED_IN_FAILURE } from '../actions/user';
import ErrorMessage from './ErrorMessage';

import styles from './Login.scss';

type Props = {
  dispatch: Dispatch
};
type State = {
  username: string,
  password: string,
  error: string
};

const mapStateToProps = state => {
  const { dispatch } = state;
  return { dispatch };
};

class Login extends Component<Props, State> {
  props: Props;

  state: State = {
    username: '',
    password: '',
    error: ''
  };

  handleSubmit = async (event: SyntheticEvent<HTMLButtonElement>) => {
    const { dispatch } = this.props;
    const { username, password } = this.state;
    event.preventDefault();

    const { type } = await dispatch(requestLogin(username, password));
    if (type === USER_LOGGED_IN_FAILURE)
      this.setState({
        error: 'The email and password combination does not match'
      });
  };

  render() {
    const { username, password, error } = this.state;
    return (
      <div className={styles.loginContainer}>
        <Card className={styles.loginCard}>
          <Grid>
            <Row>
              <Cell columns={12}>
                <h2>Login</h2>
              </Cell>
            </Row>
            <Row align="center">
              <Cell columns={12}>
                <ErrorMessage>{error}</ErrorMessage>
              </Cell>
              <Cell columns={12}>
                <form onSubmit={e => this.handleSubmit(e)}>
                  <TextField label="Username" className="full-width">
                    <Input
                      value={username}
                      onChange={e =>
                        this.setState({ username: e.currentTarget.value })
                      }
                    />
                  </TextField>
                  <TextField label="Password" className="full-width margin-top">
                    <Input
                      value={password}
                      type="password"
                      onChange={e =>
                        this.setState({ password: e.currentTarget.value })
                      }
                    />
                  </TextField>
                  <CardActions>
                    <CardActionButtons>
                      <Button raised>Login</Button>
                    </CardActionButtons>
                  </CardActions>
                </form>
              </Cell>
            </Row>
          </Grid>
        </Card>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Login);
