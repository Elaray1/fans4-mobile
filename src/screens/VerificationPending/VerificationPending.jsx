import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import IllustrationScreen from 'components/IllustrationScreen';

import PendingIllustration from 'assets/illustrations/verification-pending.svg';

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

    await dispatch(userActions.logout());
  }, [navigation, dispatch, userType]);

  return (
    <IllustrationScreen
      linkText={t('VerificationPending.linkText')}
      description={t('VerificationPending.description')}
      title={t('VerificationPending.title')}
      illustration={<PendingIllustration />}
      onLinkPress={goToSignIn}
    />
  );
}

export default React.memo(VerificationPending);
