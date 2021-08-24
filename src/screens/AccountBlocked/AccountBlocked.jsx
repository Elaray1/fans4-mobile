import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';

import BlockedIllustration from 'assets/illustrations/account-blocked.svg';

function AccountBlocked() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userName = useSelector(userSelectors.getUserFullName);
  const userType = useSelector(userSelectors.getUserType);

  const onButtonPress = useCallback(() => {
    Linking.openURL(`mailto:admin@fans4.com?subject=Blocked account. ${userName}`);
  }, [userName]);

  const onLinkPress = useCallback(async () => {
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
  }, [navigation, dispatch]);

  return (
    <IllustrationScreen
      linkText={t('AccountBlocked.linkText')}
      buttonText={t('AccountBlocked.buttonText')}
      description={t('AccountBlocked.description')}
      title={t('AccountBlocked.title')}
      onButtonPress={onButtonPress}
      onLinkPress={onLinkPress}
      illustration={<BlockedIllustration />}
    />
  );
}

export default React.memo(AccountBlocked);
