// @flow
import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable';

type Props = {
  label: string
};

type State = {
  value: *
};

const options = [
  { value: 'amoxicillin', label: 'Amoxicillin' },
  { value: 'bleomycin-a5', label: 'Bleomycin A5' },
  { value: 'ceftobiprole medocaril', label: 'Ceftobiprole Medocaril' },
];

class CombinedSelect extends Component<Props, State> {
  props: Props;

  state: State = { value: null };

  handleChange = (value: any, actionMeta: any) => {
    console.group('Value Changed');
    console.log(value);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    const { label } = this.props;

    return (
      <CreatableSelect
        isMulti
        onChange={this.handleChange}
        options={options}
        value={value}
        placeholder={label}
        className='cs'
        classNamePrefix='cs'
      />
    )
  }
}

export default CombinedSelect;
