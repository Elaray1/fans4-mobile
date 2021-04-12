/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { AppRegistry } from 'react-native';
import PropTypes from 'prop-types';

import messaging from '@react-native-firebase/messaging';

import App from './src/App';
import { name as appName } from './app.json';

messaging()
  .setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
  });

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}

HeadlessCheck.propTypes = {
  isHeadless: PropTypes.bool,
};

HeadlessCheck.defaultProps = {
  isHeadless: false,
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
