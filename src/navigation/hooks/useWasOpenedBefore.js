import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { STORAGE_KEYS } from 'helpers/constants';
import { getItem, setItem } from 'helpers/storage';
import analyticsService from 'services/analytics.service';
import * as wasOpenedBeforeActions from 'store/wasOpenedBefore/actions';

const useWasOpenedBefore = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAndSend = async () => {
      const wasOpenedBefore = await getItem(STORAGE_KEYS.WAS_OPENED_BEFORE);
      if (wasOpenedBefore) {
        dispatch(wasOpenedBeforeActions.setWasOpenedBefore());
        analyticsService.logEvent({ name: analyticsService.events.LAUNCH });

        return;
      }

      await setItem(STORAGE_KEYS.WAS_OPENED_BEFORE, JSON.stringify(true));
      analyticsService.logEvent({ name: analyticsService.events.FIRST_LAUNCH });
    };

    checkAndSend();
  }, [dispatch]);
};

export default useWasOpenedBefore;
