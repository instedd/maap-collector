// @flow

import React, { Component } from 'react';
import Sequelize from 'sequelize';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import type { Dispatch, State as ReduxState } from '../reducers/types';
import { fetchAntibiotics } from '../actions/antibiotics';
import Table from './Table';

type StoreProps = {
  dispatch: Dispatch,
  antibiotics: {
    items: [],
    totalCount: number,
    offset: number,
    limit: number,
    prevPage: number,
    nextPage: number
  }
};

type State = {
  searchText: string
};
type Props = ReduxState & StoreProps & ContextRouter;

const mapStateToProps = state => {
  const { dispatch, antibiotics } = state;
  return { dispatch, antibiotics };
};

class AntibioticList extends Component<Props, State> {
  state: State = {
    searchText: ''
  };

  getSearchConditions() {
    const { searchText } = this.state;
    if (!searchText) return {};
    return {
      [Sequelize.Op.and]: searchText
        .trim()
        .split(' ')
        .reduce((words, word) => {
          words.push({
            [Sequelize.Op.or]: [
              { name: { [Sequelize.Op.like]: `%${word}%` } },
              { brand: { [Sequelize.Op.like]: `%${word}%` } }
            ]
          });
          return words;
        }, [])
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchAntibiotics(this.getSearchConditions()));
  }

  componentDidUpdate(_, prevState) {
    const { searchText } = this.state;
    const { dispatch } = this.props;
    if (prevState.searchText !== searchText)
      dispatch(fetchAntibiotics(this.getSearchConditions()));
  }

  render() {
    const { antibiotics, history, dispatch } = this.props;
    return (
      <div>
        <Table
          entityName="antibiotics"
          items={antibiotics.items}
          totalCount={antibiotics.totalCount}
          offset={antibiotics.offset}
          pagination
          limit={antibiotics.limit}
          prevPage={antibiotics.prevPage}
          nextPage={antibiotics.nextPage}
          onReload={() => dispatch(fetchAntibiotics())}
          columns={['Name', 'Strength', 'Form', 'Pack size', 'Brand']}
          fields={['name', 'strength', 'form', 'packSize', 'brand']}
          onClick={({ id }) => history.push(`/antibiotics/${id}`)}
          search={value => {
            this.setState({ searchText: value });
          }}
        />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(AntibioticList));
