// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Card, { CardActions, CardActionButtons } from '@material/react-card';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import TextField, { Input } from '@material/react-text-field';
import Button from '@material/react-button';

import routes from '../constants/routes';
import { createAntibioticConsumptionStat } from '../actions/antibioticConsumptionStat';
import type { Dispatch } from '../reducers/types';

type Props = {
  history: {},
  dispatch: Dispatch
};

type State = {
  date: string
};

const mapStateToProps = ({ sync }) => ({ sync });

class NewAntibioticConsumptionStat extends Component<Props> {
  props: Props;

  state: State = { date: new Date().toISOString().substr(0, 10) };

  save = () => {
    const { date } = this.state;
    const { dispatch } = this.props;
    return dispatch(
      createAntibioticConsumptionStat({
        date
      })
    );
  };

  saveAndRedirectToIndex = () =>
    this.save().then(() => {
      const { history } = this.props;
      return history.push(routes.ANTIBIOTIC_CONSUMPTION_DATA_INDEX);
    });

  saveAndAddAnother = async () =>
    this.save().then(() => {
      const { history } = this.props;

      // To reload the form page, we need to redirect to another route and then come back to the form
      history.push(routes.ANTIBIOTIC_CONSUMPTION_DATA_INDEX);
      return history.push(routes.NEW_ANTIBIOTIC_CONSUMPTION_STAT);
    });

  render() {
    const { date } = this.state;
    return (
      <Card className="full-width">
        <Grid>
          <Row>
            <Cell columns="12">
              <h2>New Antibiotic Consumption Stat</h2>
            </Cell>
          </Row>
          <Row align="center">
            <Cell columns="2" />
            <Cell columns="8" offset="4">
              <TextField fullWidth label="Date">
                <Input
                  type="date"
                  value={date}
                  onChange={e => this.setState({ date: e.currentTarget.value })}
                />
              </TextField>
            </Cell>
          </Row>
        </Grid>
        <CardActions>
          <CardActionButtons>
            <Grid>
              <Row>
                {/* TODO: Solve the alignment */}
                <Cell columns="9">
                  <Button>Cancel</Button>
                </Cell>
                <Cell columns="3">
                  <Button onClick={this.saveAndRedirectToIndex}>Save</Button>
                  <Button onClick={this.saveAndAddAnother}>
                    Save & add another
                  </Button>
                </Cell>
              </Row>
            </Grid>
          </CardActionButtons>
        </CardActions>
      </Card>
    );
  }
}

export default withRouter(
  connect(mapStateToProps)(NewAntibioticConsumptionStat)
);
