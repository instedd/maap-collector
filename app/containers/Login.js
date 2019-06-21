// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Login from '../components/Login';

type Props = {};

export default class LoginPage extends Component<Props> {
  props: Props;

  render() {
    return <Login />;
  }
}
