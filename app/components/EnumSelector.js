// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import CombinedSelect from './CombinedSelect';
import { EnumState } from '../reducers/types';
import { fetchEnum } from '../actions/enums';

type Props = {
  label: string,
  className: string,
  value: null | string,
  onSelectionChange: (string | null) => void,
  entityName: string,
  enumState: EnumState,
  dispatch: *
};

const mapStateToProps = (state, ownProps) => {
  const enumState = state[ownProps.entityName];
  return { enumState, dispatch: state.dispatch };
};

class EnumSelector extends Component<Props> {
  resolveValue() {
    const { value, enumState } = this.props;
    const enumValue = enumState.options.find(e => e.id === value);

    if (!enumValue) return { value: '', label: '' };

    return {
      value: enumValue.id,
      label: enumValue.name
    };
  }

  adaptOptions() {
    const { enumState } = this.props;
    return enumState.options.map(o => ({ value: o.id, label: o.name }));
  }

  componentDidMount() {
    const { enumState, dispatch, entityName } = this.props;

    if (enumState.state === 'notLoaded') {
      dispatch(fetchEnum(entityName)());
    }
  }

  render() {
    const { label, onSelectionChange, enumState, className } = this.props;

    if (enumState === 'notLoaded') return `Loading ${label} selector...`;
    if (enumState === 'failed')
      return `Failed loading ${label}, please reload the app or contact support`;

    return (
      <CombinedSelect
        isMulti={false}
        creatable={false}
        label={label}
        className={className}
        value={this.resolveValue()}
        onChange={val => {
          // $FlowFixMe
          onSelectionChange(val.value);
        }}
        options={this.adaptOptions()}
      />
    );
  }
}

export default connect(mapStateToProps)(EnumSelector);
