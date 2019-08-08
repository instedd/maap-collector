// @flow
import React, { Component } from 'react';

type Props = {
  value: string,
  onChange: (SyntheticKeyboardEvent<HTMLTextAreaElement>) => void,
  label: string,
  rows?: number
};

type State = {
  focus: boolean
};

class TextArea extends Component<Props, State> {
  static defaultProps: { rows: number };

  state: State = { focus: false };

  render() {
    const { value, onChange, rows, label } = this.props;
    const { focus } = this.state;
    return (
      <div
        className={[
          value || focus ? 'mdc-text-field--focused' : '',
          'mdc-text-field',
          'textarea',
          'full-width'
        ].join(' ')}
      >
        <textarea
          value={value}
          className="mdc-text-field__input"
          rows={rows}
          onFocus={() => this.setState({ focus: true })}
          onBlur={() => this.setState({ focus: false })}
          onChange={onChange}
        />
        <label
          className={[
            value || focus ? 'mdc-floating-label--float-above' : '',
            'mdc-floating-label'
          ].join(' ')}
        >
          {label}
        </label>
      </div>
    );
  }
}

TextArea.defaultProps = {
  rows: 4
};

export default TextArea;
