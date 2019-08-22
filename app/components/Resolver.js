import React from 'react';
import PropTypes from 'prop-types';

export default class Resolver extends React.Component {
  constructor(props) {
    super(props);
    this.state = { state: 'loading', result: null };
  }

  componentDidMount() {
    const { promise } = this.props;
    promise
      .then(r => this.setState({ state: 'loaded', result: r }))
      .catch(() => this.setState({ state: 'failed', result: null }));
  }

  render() {
    const { state, result } = this.state;

    if (state === 'loading') return <>Loading...</>;
    if (state === 'failed') return <>Unexpected error, please reload</>;

    return <>{result}</>;
  }
}

Resolver.propTypes = { promise: PropTypes.func.isRequired };
