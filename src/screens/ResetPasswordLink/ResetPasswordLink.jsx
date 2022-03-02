import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import EmailIllustration from 'assets/illustrations/email';

import { USER_TYPES } from 'resources/user/user.constants';

function ResetPasswordLink({ route }) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { email } = route.params;

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
      description={`${t('ResetPassword.description_0')}${email}${t('ResetPassword.description_1')}`}
      title={t('ResetPassword.title')}
      illustration={<EmailIllustration />}
    />
  );
}

ResetPasswordLink.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      email: PropTypes.string.isRequired,
      userType: PropTypes.oneOf(Object.values(USER_TYPES)).isRequired,
    }),
  }).isRequired,
};

export default React.memo(ResetPasswordLink);
