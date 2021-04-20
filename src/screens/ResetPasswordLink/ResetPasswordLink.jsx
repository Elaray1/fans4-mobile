import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import PlaceholderIllustration from 'assets/illustrations/placeholder';

function ResetPasswordLink() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const onLinkPress = useCallback(() => {
    navigation.navigate('SelectUserType');
  }, [navigation]);

  return (
    <IllustrationScreen
      linkText={t('ResetPassword.linkText')}
      onLinkPress={onLinkPress}
      description={t('ResetPassword.description')}
      title={t('ResetPassword.title')}
      illustration={<PlaceholderIllustration />}
    />
  );
}

export default React.memo(ResetPasswordLink);
