// @flow

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import TextField, { Input } from '@material/react-text-field';
import Select, { Option } from '@material/react-select';
import MaterialIcon from '@material/react-material-icon';
import type { ContextRouter } from 'react-router';
import type { Dispatch, Page } from '../reducers/types';
import { fetchAntibioticConsumptionStats } from '../actions/antibioticConsumptionStats';
import { createAntibioticConsumptionStat } from '../actions/antibioticConsumptionStat';
import { fetchAntibiotic } from '../actions/antibiotic';
import Table from './Table';
import RowForm from './RowForm';

type ComponentProps = {
  dispatch: Dispatch,
  antibioticConsumptionStatsList: {
    antibioticName: string,
    antibioticConsumptionStats: Page
  },
  antibioticId: string
};
type State = {
  date?: Date,
  issued?: boolean,
  quantity?: number,
  balance?: number,
  recipientFacility?: string,
  recipientUnit?: string
};

type Props = ComponentProps & ContextRouter;

const mapStateToProps = state => {
  const { dispatch, antibioticConsumptionStatsList } = state;
  return { dispatch, antibioticConsumptionStatsList };
};

class AntibioticConsumptionStatsList extends Component<Props, State> {
  state: State = {};

  handleSubmit = () => {
    const {
      dispatch,
      antibioticId,
      history,
      antibioticConsumptionStatsList
    } = this.props;

    return dispatch(
      createAntibioticConsumptionStat({ ...this.state, antibioticId })
    ).then(() => {
      history.push({
        search: `page=${
          antibioticConsumptionStatsList.antibioticConsumptionStats.totalPages
        }`
      });
      return dispatch(fetchAntibioticConsumptionStats({ antibioticId }));
    });
  };

  componentDidMount() {
    const { dispatch, antibioticId } = this.props;
    dispatch(fetchAntibioticConsumptionStats({ antibioticId }));
    dispatch(fetchAntibiotic(antibioticId));
  }

  render() {
    const {
      dispatch,
      antibioticId,
      antibioticConsumptionStatsList
    } = this.props;
    const { antibioticConsumptionStats } = antibioticConsumptionStatsList;
    const {
      date,
      issued,
      quantity,
      balance,
      recipientFacility,
      recipientUnit
    } = this.state;

    return (
      <div>
        <Table
          title={
            <>
              <Link to="/antibiotics">
                <MaterialIcon icon="arrow_back" />
              </Link>
              {antibioticConsumptionStatsList &&
                antibioticConsumptionStatsList.antibioticName}
            </>
          }
          pagination
          items={antibioticConsumptionStats.items}
          totalCount={antibioticConsumptionStats.totalCount}
          offset={antibioticConsumptionStats.offset}
          limit={antibioticConsumptionStats.limit}
          prevPage={antibioticConsumptionStats.prevPage}
          nextPage={antibioticConsumptionStats.nextPage}
          onReload={() =>
            dispatch(fetchAntibioticConsumptionStats({ antibioticId }))
          }
          columns={[
            'Date',
            'Issued',
            'Quantity',
            'Balance',
            'Recipient facility',
            'Recipient unit'
          ]}
          fields={[
            'date',
            'issuedText',
            'quantity',
            'balance',
            'recipientFacility',
            'recipientUnit'
          ]}
          rowClassName={item => [item.issued ? 'highlight' : '']}
          lastRow={
            <RowForm onSubmit={this.handleSubmit}>
              <TextField>
                <Input
                  type="date"
                  value={date}
                  onChange={e => this.setState({ date: e.currentTarget.value })}
                />
              </TextField>
              <Select
                value={issued}
                onChange={evt => this.setState({ issued: evt.target.value })}
              >
                <Option value={false}>Out</Option>
                <Option value>In</Option>
              </Select>
              <TextField>
                <Input
                  type="number"
                  value={quantity}
                  onChange={e =>
                    this.setState({ quantity: e.currentTarget.value })
                  }
                />
              </TextField>
              <TextField>
                <Input
                  type="number"
                  value={balance}
                  onChange={e =>
                    this.setState({ balance: e.currentTarget.value })
                  }
                />
              </TextField>
              <TextField>
                <Input
                  type="text"
                  value={recipientFacility}
                  onChange={e =>
                    this.setState({ recipientFacility: e.currentTarget.value })
                  }
                />
              </TextField>
              <TextField>
                <Input
                  type="text"
                  value={recipientUnit}
                  onChange={e =>
                    this.setState({ recipientUnit: e.currentTarget.value })
                  }
                />
              </TextField>
            </RowForm>
          }
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(
  withRouter(AntibioticConsumptionStatsList)
);
