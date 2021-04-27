import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import IllustrationScreen from 'components/IllustrationScreen';

import PlaceholderIllustration from 'assets/illustrations/placeholder';

import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';


function VerificationPending() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userType = useSelector(userSelectors.getUserType);

  const goToSignIn = useCallback(async () => {
    navigation.reset({
      index: 1,
      routes: [{
        name: 'AuthStack',
        state: {
          routes: [{
            name: 'SelectUserType',
          }],
        },
      }, {
        name: 'AuthStack',
        state: {
          routes: [{
            name: 'SignIn',
            params: {
              userType,
            },
          }],
        },
      }],
    });

    try {
      await dispatch(userActions.logout());
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, [navigation, dispatch, userType]);

  return (
    <IllustrationScreen
      linkText={t('VerificationPending.linkText')}
      description={t('VerificationPending.description')}
      title={t('VerificationPending.title')}
      illustration={<PlaceholderIllustration />}
      onLinkPress={goToSignIn}
    />
  );
}

export default React.memo(VerificationPending);
