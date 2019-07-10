// @flow
import React, { Component } from 'react';
import TopAppBar, {
  TopAppBarFixedAdjust,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle
} from '@material/react-top-app-bar';
import TabBar from '@material/react-tab-bar';
import Tab from '@material/react-tab';
import MaterialIcon from '@material/react-material-icon';
import { connect } from 'react-redux';
import type { Dispatch } from '../reducers/types';

import styles from './NavBar.css';
import SyncStatus from './SyncStatus'

type Props = {};
type State = {};

const mapStateToProps = ({currentLab}) => ({
  currentLab
})

class NavBar extends Component<Props, State> {
  props: Props;

  state: State;

  render() {
    const { currentLab } = this.props;
    return (
      <div>
        <TopAppBar className={styles.navBar}>
          <TopAppBarRow>
            <TopAppBarSection align="start">
              <TopAppBarTitle className={styles.navBarTitle}>
                MAAP
              </TopAppBarTitle>
              <SyncStatus />
            </TopAppBarSection>
            <TopAppBarSection align="end" />
          </TopAppBarRow>
          {currentLab && <TopAppBarRow>
            <TabBar className={styles.navBarTabs}>
              <Tab minWidth="true">
                <MaterialIcon icon="local_pharmacy" />
                Lab records
              </Tab>
              <Tab minWidth="true">
                <MaterialIcon icon="assignment_ind" />
                Patient Records
              </Tab>
              <Tab minWidth="true">
                <MaterialIcon icon="local_pharmacy" />
                Pharmacy records
              </Tab>
              <Tab minWidth="true">
                <MaterialIcon icon="bar_chart" />
                Pharmacy stats
              </Tab>
              <Tab minWidth="true">
                <MaterialIcon icon="settings" />
                Settings
              </Tab>
            </TabBar>
          </TopAppBarRow>}
        </TopAppBar>
        <TopAppBarFixedAdjust />
        {currentLab && <TopAppBarFixedAdjust />}
      </div>
    );
  }
}

export default connect(mapStateToProps)(NavBar);