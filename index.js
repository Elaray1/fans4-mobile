/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { AppRegistry } from 'react-native';
import PropTypes from 'prop-types';
import crashlytics from '@react-native-firebase/crashlytics'; // eslint-disable-line no-unused-vars
import 'react-native-url-polyfill/auto'; // eslint-disable-line no-unused-vars

import App from './src/App';
import { name as appName } from './app';

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
