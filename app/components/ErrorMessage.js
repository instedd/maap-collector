// @flow

import type { Node } from 'react';
import React from 'react';
import style from './ErrorMessage.scss';

type Props = {
  children: Node | string
};

const ErrorMessage = ({ children }: Props) => (
  <div className={style.errorMessage}>{children}</div>
);

export default ErrorMessage;
