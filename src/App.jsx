import React from 'react';
import { Provider } from 'react-redux';

import './services/i18n.service';
import AppNavigation from './navigation';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
}

export default App;
