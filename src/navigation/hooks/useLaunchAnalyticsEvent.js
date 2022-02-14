import { useEffect } from 'react';

import { STORAGE_KEYS } from 'helpers/constants';
import { getItem } from 'helpers/storage';
import analyticsService from 'services/analytics.service';

const useLaunchAnalyticsEvent = () => {
  useEffect(() => {
    const checkAndSend = async () => {
      const wasOpenedBefore = await getItem(STORAGE_KEYS.WAS_OPENED_BEFORE);
      if (wasOpenedBefore) {
        analyticsService.logEvent({ name: analyticsService.events.LAUNCH });
      }
    };

    checkAndSend();
  }, []);
};

export default useLaunchAnalyticsEvent;
