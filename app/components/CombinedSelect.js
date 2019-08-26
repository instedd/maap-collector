// @flow
import React, { Component } from 'react';

// $FlowFixMe
import CreatableSelect from 'react-select/creatable';

type Props = {
  label: string,
  options: {},
  onChange: (Array<string>) => void,
  isMulti: boolean,
  value: { label: string, value: string }
};

class CombinedSelect extends Component<Props> {
  props: Props;

  handleChange = (value: any) => {
    const { isMulti, onChange } = this.props;
    if (value === null && isMulti) return onChange([]);
    onChange(value);
  };

  render() {
    const { label, options, isMulti, value } = this.props;

    return (
      <CreatableSelect
        isMulti={isMulti}
        onChange={this.handleChange}
        options={options}
        isSearchable
        value={value}
        placeholder={label}
        className="cs"
        classNamePrefix="cs"
      />
    );
  }
}

export default CombinedSelect;
