// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import TextField, { Input } from '@material/react-text-field';
import Select, { Option } from '@material/react-select';
import MaterialIcon from '@material/react-material-icon';
import type { Dispatch } from '../reducers/types';
import { fetchAntibioticConsumptionStats } from '../actions/antibioticConsumptionStats';
import { createAntibioticConsumptionStat } from '../actions/antibioticConsumptionStat';
import Table from './Table';
import RowForm from './RowForm';

type Props = {
  dispatch: Dispatch,
  antibioticConsumptionStats: {
    items: [],
    totalCount: number
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

const mapStateToProps = state => {
  const { dispatch, antibioticConsumptionStats } = state;
  return { dispatch, antibioticConsumptionStats };
};

class AntibioticConsumptionStatsList extends Component<Props, State> {
  state: State = {};

  handleSubmit = () => {
    const { dispatch, antibioticId } = this.props;

    dispatch(createAntibioticConsumptionStat({ ...this.state, antibioticId }));
  };

  componentDidMount() {
    const { dispatch, antibioticId } = this.props;
    dispatch(fetchAntibioticConsumptionStats(antibioticId));
  }

  render() {
    const { antibioticConsumptionStats } = this.props;
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
            <Link to="/antibiotics">
              <MaterialIcon icon="arrow_back" />
            </Link>
          }
          items={antibioticConsumptionStats.items}
          totalCount={antibioticConsumptionStats.totalCount}
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

export default connect(mapStateToProps)(AntibioticConsumptionStatsList);
