// @flow
import React, { Component } from 'react';

// $FlowFixMe
import Select from 'react-select';
// $FlowFixMe
import CreatableSelect from 'react-select/creatable';

type Option = {
  value: string | boolean | void,
  label: string
};

type Props = {
  label: string,
  options: Array<Option>,
  onChange: (Array<string> | Option) => void,
  isMulti: boolean,
  value: Option,
  creatable: boolean
};

class CombinedSelect extends Component<Props> {
  props: Props;

  handleChange = (value: Option) => {
    const { isMulti, onChange } = this.props;
    if (value === null && isMulti) return onChange([]);
    onChange(value);
  };

  render() {
    const { label, options, isMulti, value, creatable } = this.props;

    const SelectComponent = creatable ? CreatableSelect : Select;

    return (
      <SelectComponent
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
