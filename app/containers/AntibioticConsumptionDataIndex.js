// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import style from '@material/react-fab/dist/fab.css';
import { Fab } from '@material/react-fab';
import MaterialIcon from '@material/react-material-icon';
import { withRouter } from 'react-router-dom';
import AntibioticConsumptionStatsList from '../components/AntibioticConsumptionStatsList';
import routes from '../constants/routes';

type Props = {
  sync: {
    synchronizing: boolean
  },
  history: {}
};

const mapStateToProps = ({ sync }) => ({ sync });

class AntibioticConsumptionStatsIndex extends Component<Props> {
  props: Props;

  render() {
    const { history } = this.props;
    return (
      <div>
        <AntibioticConsumptionStatsList />
        <Fab
          className={[style['mdc-fab'], 'app-fab--absolute']}
          icon={<MaterialIcon icon="add" />}
          onClick={() => history.push(routes.NEW_ANTIBIOTIC_CONSUMPTION_STAT)}
        />
      </div>
    );
  }
}

export default withRouter(
  connect(mapStateToProps)(AntibioticConsumptionStatsIndex)
);
