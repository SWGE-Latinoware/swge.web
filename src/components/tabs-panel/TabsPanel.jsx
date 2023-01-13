import React, { useEffect, useState } from 'react';
import { AppBar, Tab, Tabs } from '@mui/material';
import { useParams } from 'react-router';
import TabPanel from '../tabpanel/TabPanel';
import history from '../../services/History';
import { FlexGrow } from '../context/ThemeChangeContext';

export const getInitialTabIndex = (idx) => {
  if (idx == null) {
    return 0;
  }
  const intIndex = Number.parseInt(idx, 10);
  if (Number.isNaN(intIndex)) {
    return 0;
  }
  return intIndex;
};

const TabsPanel = (props) => {
  const {
    activeTab, setActiveTab, ...otherProps
  } = props;

  const { index } = useParams();

  const [activeTabAux, setActiveTabAux] = useState(getInitialTabIndex(index));

  return (
    <InnerTabsPanel
      activeTab={activeTab == null ? activeTabAux : activeTab}
      setActiveTab={setActiveTab == null ? setActiveTabAux : setActiveTab}
      {...otherProps}
    />
  );
};

const InnerTabsPanel = (props) => {
  const {
    tabs, panels, primary, secondary, activeTab, setActiveTab,
  } = props;

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    let url = history.location.pathname;

    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    if (url.split('/').at(-2) === 'tab') {
      const path = url.split('/');
      path[path.length - 1] = newValue;
      history.replace(path.join('/'));
    } else {
      history.replace(`${url}/tab/${newValue}`);
    }
  };

  const a11yProps = (index) => ({
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  });

  useEffect(() => {
    if (activeTab < 0 || activeTab >= tabs.length) {
      setActiveTab(0);
    }
  }, [activeTab, setActiveTab, tabs.length]);

  return (
    <FlexGrow width="100%">
      <AppBar
        position="relative"
      >
        <Tabs
          value={activeTab}
          onChange={handleChange}
          textColor={(primary && 'primary') || (secondary && 'secondary') || 'inherit'}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((obj, idx) => (
            <Tab
              key={obj.label}
              label={obj.label}
              icon={obj.icon}
              wrapped
              disabled={!obj.enabled}
              {...a11yProps(idx)}
            />
          ))}
        </Tabs>
      </AppBar>
      {panels.map((panel, idx) => (
        <TabPanel
            /* eslint-disable-next-line react/no-array-index-key */
          key={`panel${idx}`}
          primary={primary}
          secondary={secondary}
          value={activeTab}
          index={idx}
        >
          {panel}
        </TabPanel>
      ))}
    </FlexGrow>
  );
};

export default TabsPanel;
