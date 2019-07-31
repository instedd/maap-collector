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
import type { ContextRouter } from 'react-router';
import { State } from '../reducers/types';
import { userLoggedOut } from '../actions/user';

import routes from '../constants/routes';
import styles from './NavBar.scss';
import SyncStatus from './SyncStatus';

type StoreProps = {
  currentLab: number | null
};
type Props = State & StoreProps & ContextRouter;

const mapStateToProps = ({ currentLab, user }: State) => ({
  currentLab: currentLab || true,
  user
});

const tabs = [
  {
    name: 'Lab Records',
    icon: <MaterialIcon icon="local_pharmacy" />,
    path: routes.HOME
  },
  {
    name: 'Patient records',
    icon: <MaterialIcon icon="assignment_ind" />,
    path: '/patients/'
  },
  {
    name: 'Pharmacy stats',
    icon: <MaterialIcon icon="bar_chart" />,
    path: routes.ANTIBIOTIC_CONSUMPTION_DATA_INDEX
  }
];
class NavBar extends Component<Props, State> {
  props: Props;

  state: State = { userDropwdownOpen: false };

  handleSignOut = e => {
    const { dispatch } = this.props;
    e.preventDefault();

    dispatch(userLoggedOut());
  };

  render() {
    const { userDropwdownOpen } = this.state;
    const { currentLab, history, user } = this.props;
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

            <TopAppBarSection align="end">
              <TopAppBarTitle
                className={styles.navBarAccount}
                onClick={() =>
                  this.setState({ userDropwdownOpen: !userDropwdownOpen })
                }
              >
                {user.data.username}
                <MaterialIcon icon="arrow_drop_down" />

                <ul
                  className={[
                    userDropwdownOpen ? styles.open : '',
                    styles.navBarDropdown
                  ].join(' ')}
                >
                  <li>
                    <a href="#" onClick={this.handleSignOut}>
                      Sign out
                    </a>
                  </li>
                </ul>
              </TopAppBarTitle>
            </TopAppBarSection>
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
