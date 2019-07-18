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
import { withRouter } from 'react-router-dom';

import routes from '../constants/routes';
import styles from './NavBar.css';
import SyncStatus from './SyncStatus';

type Props = {
  currentLab: number | null,
  history: {}
};
type State = {};

const mapStateToProps = ({ currentLab }) => ({
  currentLab: currentLab || true
});

const tabs = [
  {
    name: 'Lab Records',
    icon: <MaterialIcon icon="local_pharmacy" />,
    path: routes.HOME
  },
  {
    name: 'Pharmacy stats',
    icon: <MaterialIcon icon="bar_chart" />,
    path: routes.ANTIBIOTIC_CONSUMPTION_DATA_INDEX
  }
];
class NavBar extends Component<Props, State> {
  props: Props;

  state: State;

  render() {
    const { currentLab, history } = this.props;
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
          {currentLab && (
            <TopAppBarRow>
              <TabBar activeIndex={null} className={styles.navBarTabs}>
                {tabs.map(tab => (
                  <Tab
                    key={tab.name}
                    active={history.location.pathname === tab.path}
                    onClick={() => history.push(tab.path)}
                    minWidth="true"
                  >
                    {tab.icon}
                    {tab.name}
                  </Tab>
                ))}
              </TabBar>
            </TopAppBarRow>
          )}
        </TopAppBar>
        <TopAppBarFixedAdjust />
        {currentLab && <TopAppBarFixedAdjust />}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(NavBar));
