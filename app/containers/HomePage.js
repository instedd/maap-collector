// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Fab from '@material/react-fab';
import MaterialIcon from '@material/react-material-icon';
import LabRecordsList from '../components/LabRecordsList';
import Sites from '../components/Sites';

type Props = {
  sync: {
    synchronizing: boolean
  },
  history: {
    push: string => void
  },
  site: *
};

const mapStateToProps = ({ sync, site }) => ({ sync, site });

class HomePage extends Component<Props> {
  props: Props;

  render() {
    const { history, site } = this.props;
    return (
      <div>
        {site ? <LabRecordsList /> : <Sites />}
        <Fab
          className="mdc-fab app-fab--absolute"
          icon={<MaterialIcon icon="add" />}
          onClick={() => history.push(`/lab_records/import`)}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(HomePage);
