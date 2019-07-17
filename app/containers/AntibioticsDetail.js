// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AntibioticConsumptionStatsList from '../components/AntibioticConsumptionStatsList';

type Props = {
  sync: {
    synchronizing: boolean
  },
  match: {
    params: {
      id: string
    }
  }
};

const mapStateToProps = ({ sync }) => ({ sync });

class AntibioticsDetail extends Component<Props> {
  props: Props;

  render() {
    const { match } = this.props;
    return (
      <div>
        <AntibioticConsumptionStatsList antibioticId={match.params.id} />
        {/* <Fab
          className={[style['mdc-fab'], 'app-fab--absolute']}
          icon={<MaterialIcon icon="add" />}
          onClick={() => history.push(routes.NEW_ANTIBIOTIC_CONSUMPTION_STAT)}
        /> */}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(AntibioticsDetail));
