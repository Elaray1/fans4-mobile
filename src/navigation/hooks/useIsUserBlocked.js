import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import * as rootNavigation from 'helpers/rootNavigation';
import useToast from 'hooks/useToast';
import * as userSelectors from 'resources/user/user.selectors';
import * as userActions from 'resources/user/user.actions';
import { USER_STATUSES } from 'resources/user/user.constants';

const useIsUserBlocked = () => {
  const dispatch = useDispatch();
  const { showFailure } = useToast();

  const userStatus = useSelector(userSelectors.getUserStatus);
  const userAuthenticated = useSelector(userSelectors.getAuthenticated);

  const blockAccountIfNeeded = useCallback(async () => {
    if (userStatus && userStatus !== USER_STATUSES.BLOCKED) {
      try {
        const user = await dispatch(userActions.getUserData());
        if (user.status === USER_STATUSES.BLOCKED) {
          rootNavigation.resetToScreen('AppStack', 'AccountBlocked');
        }
      } catch (error) {
        console.log('blockAccountIfNeeded error', error);
        showFailure();
      }
    }
  }, [dispatch, showFailure, userStatus]);

  useEffect(() => {
    const checkIsAccountBlocked = (appState) => {
      if (appState === 'active' && userAuthenticated) {
        blockAccountIfNeeded();
      }
    };

    AppState.addEventListener('change', checkIsAccountBlocked);

    return () => {
      AppState.removeEventListener('change', checkIsAccountBlocked);
    };
  }, [blockAccountIfNeeded, userAuthenticated]);
};

export default useIsUserBlocked;
