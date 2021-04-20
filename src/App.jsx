import React from 'react';
import { Provider } from 'react-redux';

import './services/i18n.service';
import AppNavigation from './navigation';
import configureStore from './resources/store';

const { store } = configureStore();

function App() {
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
}

export default App;
