// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select, { Option } from '@material/react-select';
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
  componentDidMount() {
    const { enumState, dispatch, entityName } = this.props;

    if (enumState.state === 'notLoaded') {
      dispatch(fetchEnum(entityName)());
    }
  }

  render() {
    const {
      label,
      value,
      onSelectionChange,
      enumState,
      className
    } = this.props;

    if (enumState === 'notLoaded') return `Loading ${label} selector...`;
    if (enumState === 'failed')
      return `Failed loading ${label}, please reload the app or contact support`;

    return (
      <Select
        label={label}
        className={className}
        value={value || ''}
        enhanced
        onEnhancedChange={(index, item) => {
          let selection = item.getAttribute('data-value');
          if (selection === '') selection = null;

          onSelectionChange(selection);
        }}
      >
        {enumState.options.map(o => (
          <Option key={o.id} value={o.id}>
            {o.name}
          </Option>
        ))}
      </Select>
    );
  }
}

export default connect(mapStateToProps)(EnumSelector);
