import { useEffect } from 'react';
import { Linking, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import useToast from 'hooks/useToast';
import * as userSelectors from 'resources/user/user.selectors';

import handleDeeplink from '../helpers/handleDeeplink';

const useDeepLink = () => {
  const { showFailure } = useToast();
  const { t } = useTranslation();

  const userId = useSelector(userSelectors.getUserId);

  useEffect(() => {
    const handleDeepLinkEvent = async ({ url }) => {
      // on ios url event triggers even on start of the app from universal link
      // so we skip this case on is since we handle starting from universal link in app init function
      const initialUrl = await Linking.getInitialURL();
      if (Platform.OS === 'ios' && initialUrl) {
        return;
      }

      handleDeeplink({
        url,
        showFailure,
        userId,
        t,
      });
    };

    Linking.addEventListener('url', handleDeepLinkEvent);
    return () => Linking.removeEventListener('url', handleDeepLinkEvent);
  }, [t, showFailure, userId]);
};

export default useDeepLink;
