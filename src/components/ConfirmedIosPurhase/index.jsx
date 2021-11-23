import React, { useMemo } from 'react';
import { View, Text, useWindowDimensions, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';

import Button from 'components/Button';
import SubscriptionPosibilities from 'components/SubscriptionPosibilities';

import colors from 'themes/colors';
import hexToRgba from 'helpers/hexToRgba';

import illustrationSource from 'assets/illustrations/onboarding2-fighter.png';

import styles from './styles';

const MAX_WIDTH_HEIGHT_PERCENT = 45;

const ConfirmedIosPurchase = ({ handleDonePress }) => {
  const { t } = useTranslation();
  const { width, height: screenHeight } = useWindowDimensions();


  const height = screenHeight * MAX_WIDTH_HEIGHT_PERCENT / 100;

  const ilustrationStyle = useMemo(() => (
    { width, height }), [height, width]);

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View>
        <View>
          <FastImage
            source={illustrationSource}
            style={ilustrationStyle}
            resizeMode="cover"
          />
          <LinearGradient
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            colors={[colors.main, hexToRgba(colors.main, 0)]}
            style={styles.linearGradient}
          />
        </View>

        <View style={styles.descriptionContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.processingIosPurchaseTitle}>{t('Fighter.subscriptionCongratulation')}</Text>
            <Text style={styles.processingIosPurchaseInfoText}>{t('Fighter.accessToContent')}</Text>
          </View>


          <SubscriptionPosibilities />
        </View>
      </View>

      <Button style={styles.doneButton} title={t('Fighter.done')} onPress={handleDonePress} />
    </ScrollView>
  );
};

ConfirmedIosPurchase.propTypes = {
  handleDonePress: PropTypes.func.isRequired,
};

export default React.memo(ConfirmedIosPurchase);
