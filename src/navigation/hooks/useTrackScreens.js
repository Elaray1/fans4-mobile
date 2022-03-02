import { useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';

import analyticsService from 'services/analytics.service';
import * as rootNavigation from 'helpers/rootNavigation';
import * as userSelectors from 'resources/user/user.selectors';

const useTrackScreens = () => {
  const userType = useSelector(userSelectors.getUserType);

  const routeNameRef = useRef();

  const trackScreens = useCallback(() => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = rootNavigation.navigationRef.current.getCurrentRoute().name;

    if (previousRouteName !== currentRouteName) {
      analyticsService.logEvent({
        name: analyticsService.events.SCREEN_OPENED,
        data: { userType },
      });
    }

    routeNameRef.current = currentRouteName;
  }, [userType]);

  return { trackScreens, routeNameRef };
};

export default useTrackScreens;
