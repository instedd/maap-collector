// @flow
/* eslint no-plusplus: off */
import React, { Component } from 'react';
import Button from '@material/react-button';
import Card, { CardPrimaryContent, CardActions, CardActionButtons } from '@material/react-card';
import {Cell, Grid, Row} from '@material/react-layout-grid';
import TextField, { Input } from '@material/react-text-field';
import styles from './Home.css';

type Props = {};
type State = {
  username: string,
  password: string
};

export default class Home extends Component<Props, State> {
  props: Props;

  state: State = {
    username: "",
    password: ""
  };

  handleSubmit(event) {
    console.log('Submit');
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <h2>Home</h2>
          </Row>
          <Row>
            <Cell columns={4} align="middle">
            <Card>
              <Grid>
                <form onSubmit={this.handleSubmit}>
                  <Row>
                    <Cell columns={12}>
                      <TextField
                        label='Username'
                      ><Input
                        value={this.state.username}
                        onChange={(e) => this.setState({username: e.currentTarget.value})} />
                      </TextField>
                    </Cell>
                    <Cell columns={12}>
                      <TextField
                        label='Password'
                      ><Input
                        value={this.state.password}
                        onChange={(e) => this.setState({password: e.currentTarget.value})} />
                      </TextField>
                    </Cell>
                  </Row>
                  <CardActions>
                    <CardActionButtons>
                      <Button
                      raised
                      onClick={() => console.log(this.state.username)}
                      >
                        Login
                      </Button>
                    </CardActionButtons>
                  </CardActions>
                </form>
                </Grid>
              </Card>
            </Cell>
          </Row>
        </Grid>
      </div>
    );
  }
}
