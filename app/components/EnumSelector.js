// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select, { Option } from '@material/react-select';
import { fetchEnum } from '../actions/enums';

type EnumOption = {
  id: string,
  name: string
};

type Props = {
  label: string,
  className: string,
  value: null | string,
  onSelectionChange: string => void,
  entityName: string,
  options: EnumOption[],
  dispatch: *
};

const mapStateToProps = (state, ownProps) => {
  const options = state[ownProps.entityName];
  return { options, dispatch: state.dispatch };
};

class EnumSelector extends Component<Props> {
  componentDidMount() {
    const { options, dispatch, entityName } = this.props;

    if (!options) {
      dispatch(fetchEnum(entityName)());
    }
  }

  render() {
    const { label, value, onSelectionChange, options, className } = this.props;

    if (!options || !options.length) return 'Loading selector...';

    return (
      <Select
        label={label}
        className={className}
        value={value || ''}
        enhanced
        onEnhancedChange={(index, item) => {
          onSelectionChange(item.getAttribute('data-value'));
        }}
      >
        {options.map(o => (
          <Option key={o.id} value={o.id}>
            {o.name}
          </Option>
        ))}
      </Select>
    );
  }
}

export default connect(mapStateToProps)(EnumSelector);
