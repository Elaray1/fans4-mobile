import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import * as userSelectors from 'resources/user/user.selectors';

import { clear } from 'helpers/storage';

import PlaceholderIllustration from 'assets/illustrations/placeholder';

function AccountBlocked() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const userName = useSelector(userSelectors.getUserFullName);

  const onButtonPress = useCallback(() => {
    Linking.openURL(`mailto:admin@fans4.com?subject=Blocked account. ${userName}`);
  }, [userName]);

  const onLinkPress = useCallback(() => {
    clear(); // TODO replace with logout
    navigation.reset({ routes: [{ name: 'AuthStack', params: { screen: 'SelectUserType' } }] });
  }, [navigation]);

  return (
    <IllustrationScreen
      linkText={t('AccountBlocked.linkText')}
      buttonText={t('AccountBlocked.buttonText')}
      description={t('AccountBlocked.description')}
      title={t('AccountBlocked.title')}
      onButtonPress={onButtonPress}
      onLinkPress={onLinkPress}
      illustration={<PlaceholderIllustration />}
    />
  );
}

export default React.memo(AccountBlocked);
