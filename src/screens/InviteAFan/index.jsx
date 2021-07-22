import React, { useEffect } from 'react';
import { View, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Text from 'components/Text';
import Button from 'components/Button';
import Header from 'components/Header';
import QRCode from 'components/QRCode';
import Share from 'components/Share';

import * as userSelectors from 'resources/user/user.selectors';
import config from 'resources/config';

import analyticsService from 'services/analytics.service';

import styles from './InviteAFan.styles';

const InviteAFan = () => {
  const { t } = useTranslation();

  const userId = useSelector(userSelectors.getUserId);
  const fullName = useSelector(userSelectors.getUserFullName);

  useEffect(() => {
    analyticsService.logEvent({
      name: analyticsService.events.FIGHTER_OPENED_INVITE_FAN,
      data: {
        userId,
      },
    });
  }, [userId]);

  const link = `${config.webUrl}/fighters/${userId}`;

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('InviteAFan.inviteAFan')}
        leftItemType="backArrow"
      />
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>
            {fullName}
            {' '}
            {t('InviteAFan.invitation')}
          </Text>
          <Text style={styles.description}>
            {t('InviteAFan.askYourFan')}
          </Text>
        </View>
        <View style={styles.qrContainer}>
          <QRCode link={link} size={270} />
          <Text style={styles.name}>{fullName}</Text>
        </View>
        <Share message={link}>
          <Button title={t('InviteAFan.shareALink')} disableWithoutFade />
        </Share>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(InviteAFan);
