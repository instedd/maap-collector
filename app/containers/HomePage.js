// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Fab from '@material/react-fab';
import MaterialIcon from '@material/react-material-icon';
import LabRecordsList from '../components/LabRecordsList';
import Facilities from '../components/Facilities';

type Props = {
  sync: {
    synchronizing: boolean
  },
  history: {
    push: string => void
  },
  facility: *
};

const mapStateToProps = ({ sync, facility }) => ({ sync, facility });

class HomePage extends Component<Props> {
  props: Props;

  render() {
    const { history, facility } = this.props;
    return (
      <div>
        {facility ? <LabRecordsList /> : <Facilities />}
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
