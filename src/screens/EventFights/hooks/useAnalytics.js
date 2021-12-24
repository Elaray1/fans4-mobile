import { useEffect } from 'react';

import analyticsService from 'services/analytics.service';

const useAnalytics = (isFan, eventId) => {
  useEffect(() => {
    if (isFan) {
      analyticsService.logEvent({
        name: analyticsService.events.FAN_OPENED_EVENT_SCREEN,
        data: { eventId },
      });
    }
  }, [isFan, eventId]);
};

export default useAnalytics;
