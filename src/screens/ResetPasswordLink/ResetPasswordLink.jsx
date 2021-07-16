import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import EmailIllustration from 'assets/illustrations/email';

function ResetPasswordLink() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const onLinkPress = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'SelectUserType',
        },
      ],
    });
  }, [navigation]);

  return (
    <IllustrationScreen
      linkText={t('ResetPassword.linkText')}
      onLinkPress={onLinkPress}
      description={t('ResetPassword.description')}
      title={t('ResetPassword.title')}
      illustration={<EmailIllustration />}
    />
  );
}

export default React.memo(ResetPasswordLink);
