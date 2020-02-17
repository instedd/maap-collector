// @flow

import type { Node } from 'react';
import React from 'react';
import style from './ErrorMessage.scss';

type Props = {
  children: Node | string,
  center?: boolean
};

const ErrorMessage = ({ children, center }: Props) => (
  <div className={[style.errorMessage, center ? style.center : ''].join(' ')}>
    {children}
  </div>
);

ErrorMessage.defaultProps = {
  center: false
};

export default ErrorMessage;
