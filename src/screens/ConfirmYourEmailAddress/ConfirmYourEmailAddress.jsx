import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';

import EmailIllustration from 'assets/illustrations/email';

function ConfirmYourEmailAddress({ route }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { newEmail } = route?.params;

  const onNext = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{
        name: 'AppStack',
        state: {
          routes: [{ name: 'AccountInformation' }],
        },
      }],
    });
  }, [navigation]);

  const weHaveSentYou = t('ConfirmYourEmailAddress.weHaveSentYouAConfirmationEmailTo');
  const plsCheckYourInbox = t('ConfirmYourEmailAddress.pleaseCheckYourInbox');
  const description = `${weHaveSentYou} ${newEmail}.\n\n${plsCheckYourInbox}`;

  return (
    <IllustrationScreen
      headerText={t('ConfirmYourEmailAddress.changeEmail')}
      title={t('ConfirmYourEmailAddress.confirmYourEmailAddress')}
      description={description}
      buttonText={t('ConfirmYourEmailAddress.done')}
      illustration={<EmailIllustration />}
      onButtonPress={onNext}
    />
  );
}

ConfirmYourEmailAddress.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      newEmail: PropTypes.string.isRequired,
    }),
  }).isRequired,
};


export default ConfirmYourEmailAddress;
