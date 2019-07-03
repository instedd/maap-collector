// @flow
/* eslint no-plusplus: off */
import React, { Component } from 'react';
import Button from '@material/react-button';
import Card, { CardActions, CardActionButtons } from '@material/react-card';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import TextField, { Input } from '@material/react-text-field';
import { connect } from 'react-redux';
import type { Dispatch } from '../reducers/types';
import { requestLogin } from '../actions/user';

// import styles from './Login.css';

type Props = {
  dispatch: Dispatch
};
type State = {
  username: string,
  password: string
};

const mapStateToProps = state => {
  const { dispatch } = state;
  return { dispatch };
};

class Login extends Component<Props, State> {
  props: Props;

  state: State = {
    username: '',
    password: ''
  };

  handleSubmit(event: SyntheticEvent<HTMLButtonElement>) {
    const { dispatch } = this.props;
    const { username, password } = this.state;

    dispatch(requestLogin(username, password));
    event.preventDefault();
  }

  render() {
    const { username, password } = this.state;
    return (
      <Grid>
        <Row>
          <h2>Login</h2>
        </Row>
        <Row>
          <Cell columns={6}>
            <Card>
              <form onSubmit={e => this.handleSubmit(e)}>
                <TextField label="Username">
                  <Input
                    value={username}
                    onChange={e =>
                      this.setState({ username: e.currentTarget.value })
                    }
                  />
                </TextField>
                <TextField label="Password">
                  <Input
                    value={password}
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
            </Card>
          </Cell>
        </Row>
      </Grid>
    );
  }
}

export default connect(mapStateToProps)(Login);
