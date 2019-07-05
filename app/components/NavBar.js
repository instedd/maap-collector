// @flow
import React, { Component } from 'react';
import TopAppBar, {
  TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from '@material/react-top-app-bar';
import TabBar from '@material/react-tab-bar';
import Tab from '@material/react-tab';
import MaterialIcon from '@material/react-material-icon';

import styles from './NavBar.css';

type Props = {};
type State = {};

export default class NavBar extends Component<Props, State> {
  props: Props;

  state: State;

  render() {

    return (
      <div>
        <TopAppBar className={styles.navBar}>
          <TopAppBarRow>
            <TopAppBarSection align='start'>
              <TopAppBarTitle className={styles.navBarTitle}>MAAP</TopAppBarTitle>
            </TopAppBarSection>
            <TopAppBarSection align='end' />
          </TopAppBarRow>
          <TopAppBarRow>
            <TabBar className={styles.navBarTabs}>
              <Tab minWidth='true'><MaterialIcon icon='local_pharmacy' />Labs</Tab>
            </TabBar>
          </TopAppBarRow>
        </TopAppBar>
        <TopAppBarFixedAdjust />
      </div>
    )
  }
}
