/* eslint-disable import/first */

import * as Sentry from '@sentry/react-native';
import config from 'resources/config';

Sentry.init({
  dsn: config.sentryDSN,
  environment: config.mode,
});

import React from 'react';
import { Provider } from 'react-redux';
import Orientation from 'react-native-orientation-locker';
import { ToastProvider } from 'react-native-fast-toast';

import './services/i18n.service';
import AppNavigation from './navigation';
import store from './store';

Orientation.lockToPortrait();

function App() {
  return (
    <ToastProvider placement="top" offset={30}>
      <Provider store={store}>
        <AppNavigation />
      </Provider>
    </ToastProvider>
  );
}

export default Sentry.wrap(App);
