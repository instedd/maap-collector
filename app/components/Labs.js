// @flow

import React, { Component } from 'react';
// import style from './Labs.css';
import { connect } from 'react-redux'
import type { Dispatch } from '../reducers/types';
import { fetchLabs } from '../actions/labs';

type Props = {
  dispatch: Dispatch,
  labs: Object
};
type State = {};

const mapStateToProps = state => {
  const { dispatch, labs } = state;
  return ({ dispatch, labs })
}

class Labs extends Component<Props, State> {
  state: State = {};

  componentDidMount () {
    const {dispatch} = this.props
    dispatch(fetchLabs())
  }

  render() {
    const { labs } = this.props;
    return (
      <div>
        <div className="lab-list">
          <h2>Labs</h2>
          <table>
            <thead>
              <tr>
                <th id="name">Name</th>
                <th id="address">Address</th>
                <th id="location">Location</th>
                <th id="ownership">Ownership</th>
              </tr>
            </thead>
            <tbody>
              {labs.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.address}</td>
                  <td>{item.location}</td>
                  <td>{item.ownership}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Labs);
