// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import style from '@material/react-fab/dist/fab.css';
import { Fab } from '@material/react-fab';
import MaterialIcon from '@material/react-material-icon';
import AntibioticConsumptionStatsList from '../components/AntibioticConsumptionStatsList';

type Props = {
  sync: {
    synchronizing: boolean
  }
};

const mapStateToProps = ({ sync }) => ({ sync });

class AntibioticConsumptionStatsIndex extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <AntibioticConsumptionStatsList />
        <Fab
          className={[style['mdc-fab'], 'app-fab--absolute']}
          icon={<MaterialIcon icon="add" />}
          onClick={() => console.log('test')}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(AntibioticConsumptionStatsIndex);
