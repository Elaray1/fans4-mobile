import React from 'react';
import { Provider } from 'react-redux';
import Orientation from 'react-native-orientation-locker';

import './services/i18n.service';
import AppNavigation from './navigation';
import store from './store';

Orientation.lockToPortrait();

function App() {
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
}

export default App;
