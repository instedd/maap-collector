import React, { Component, cloneElement } from 'react';

type Props = {
  children: Array<typeof Component>,
  onSubmit: () => void
};

class RowForm extends Component<Props> {
  handleKeyPress = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    const { onSubmit } = this.props;
    if (e.key === 'Enter') return onSubmit();
  };

  render() {
    const { children } = this.props;

    /* eslint-disable */
    return (
      <tr>
        {children.map((child, index) => (
          <td
            key={`row-form-${index}`}
            colspan={index === children.length - 1 ? 2 : 1}
            onKeyPress={this.handleKeyPress}
          >
            {cloneElement(child, {})}
          </td>
        ))}
      </tr>
    );
    /* eslint-enable */
  }
}

export default RowForm;
