import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import IllustrationScreen from 'components/IllustrationScreen';

import * as userSelectors from 'resources/user/user.selectors';

import EmailIllustration from 'assets/illustrations/email';

function ConfirmYourEmailAddress() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const userNewEmail = useSelector(userSelectors.getUserNewEmail);

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
  const description = `${weHaveSentYou} ${userNewEmail}.\n\n${plsCheckYourInbox}`;

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

export default ConfirmYourEmailAddress;
