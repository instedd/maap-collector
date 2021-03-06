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
import Logo from '../assets/logo.svg';

import routes from '../constants/routes';
import styles from './NavBar.scss';
import SyncStatus from './SyncStatus';

import { exitSite } from '../actions/site';

type StoreProps = {
  site: *
};
type Props = State & StoreProps & ContextRouter;

const mapStateToProps = ({ site, user }: State) => ({
  site,
  user
});

const initialTabs = [
  {
    name: 'Lab records',
    icon: <MaterialIcon icon="local_pharmacy" />,
    path: routes.HOME
  },
  {
    name: 'Pharmacy stats',
    icon: <MaterialIcon icon="bar_chart" />,
    path: routes.ANTIBIOTIC_CONSUMPTION_DATA_INDEX
  },
  {
    name: 'Electronic Pharmacy Stock Records',
    icon: <MaterialIcon icon="bar_chart" />,
    path: '/electronic_pharmacy_stock_records'
  }
];

class NavBar extends Component<Props, State> {
  props: Props;

  state: State = { userDropwdownOpen: false };

  tabs = [...initialTabs];

  handleSignOut = e => {
    const { dispatch } = this.props;
    e.preventDefault();

    dispatch(userLoggedOut());
  };

  exitSite = async () => {
    const { dispatch, history } = this.props;
    await dispatch(exitSite());
    history.push('/');
  };

  render() {
    const { userDropwdownOpen } = this.state;
    const { history, user, site } = this.props;
    if (site && site.hasHospital && this.tabs.length === initialTabs.length)
      this.tabs.splice(1, 0, {
        name: 'Patient records',
        icon: <MaterialIcon icon="assignment_ind" />,
        path: '/patients/'
      });
    else if (
      site &&
      !site.hasHospital &&
      this.tabs.length !== initialTabs.length
    )
      this.tabs = [...initialTabs];

    return (
      <div>
        <TopAppBar className={styles.navBar}>
          <TopAppBarRow>
            <TopAppBarSection align="start">
              <TopAppBarTitle className={styles.navBarTitle}>
                <div
                  tabIndex="0"
                  role="button"
                  onClick={() => this.exitSite()}
                  onKeyPress={() => this.exitSite()}
                >
                  <img src={Logo} alt="Logo" />
                </div>
              </TopAppBarTitle>
              <MaterialIcon icon="keyboard_arrow_right" />
              {site && (
                <div className={styles.navBarCurrentSite}>{site.name}</div>
              )}
              <div className={styles.navBarSync}>
                <SyncStatus />
              </div>
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
                    <a href="/" onClick={this.handleSignOut}>
                      Sign out
                    </a>
                  </li>
                </ul>
              </TopAppBarTitle>
            </TopAppBarSection>
          </TopAppBarRow>
          {site && (
            <TopAppBarRow>
              <TabBar activeIndex={null} className={styles.navBarTabs}>
                {this.tabs.map(tab => (
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
        {site && <TopAppBarFixedAdjust />}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(NavBar));
