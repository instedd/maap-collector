// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Fab from '@material/react-fab';
import MaterialIcon from '@material/react-material-icon';
import LabRecordsList from '../components/LabRecordsList';

type Props = {
  sync: {
    synchronizing: boolean
  },
  history: {
    push: string => void
  }
};

const mapStateToProps = ({ sync }) => ({ sync });

class HomePage extends Component<Props> {
  props: Props;

  render() {
    const { history } = this.props;
    return (
      <div>
        <LabRecordsList />
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
