// @flow

import React, { Component } from 'react';
import style from './ErrorMessage.scss';

type Props = {
  children: typeof Component
};

const ErrorMessage = ({ children }: Props) => (
  <div className={style.errorMessage}>{children}</div>
);

export default ErrorMessage;
