// @flow
import React, { Component } from 'react';

// $FlowFixMe
import Select from 'react-select';
// $FlowFixMe
import CreatableSelect from 'react-select/creatable';

type Option = {
  value: string | boolean | void | null,
  label: string | ?null
};

type Props = {
  label: string,
  options: Array<Option>,
  onChange: (Array<string> | Option) => void,
  isMulti: boolean,
  value: Option,
  creatable: boolean,
  isDisabled?: boolean
};

class CombinedSelect extends Component<Props> {
  props: Props;

  handleChange = (value: Option) => {
    const { isMulti, onChange } = this.props;
    if (value === null && isMulti) return onChange([]);
    onChange(value);
  };

  static defaultProps = {
    isDisabled: false
  };

  render() {
    const {
      label,
      options,
      isMulti,
      value,
      creatable,
      isDisabled
    } = this.props;

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
        isDisabled={isDisabled}
      />
    );
  }
}

export default CombinedSelect;
