import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useSelector } from 'react-redux';

import store from 'store';

import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';

const useUpdateUser = () => {
  const userAuthenticated = useSelector(userSelectors.getAuthenticated);

  useEffect(() => {
    const updateUser = async (appState) => {
      if (appState === 'active' && userAuthenticated) {
        try {
          await store.dispatch(userActions.getUserData());
        } catch (err) {
          console.error('Failed updating user after app went to foreground', err);
        }
      }
    };

    AppState.addEventListener('change', updateUser);
    return AppState.removeEventListener('change', updateUser);
  }, [userAuthenticated]);
};

export default useUpdateUser;
