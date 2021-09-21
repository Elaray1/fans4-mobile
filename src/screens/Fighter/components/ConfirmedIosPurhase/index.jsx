import React, { useMemo } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';

import illustrationSource from 'assets/illustrations/onboarding2-fighter.png';
import CheckmarkIcon from 'assets/icons/success.svg';

import styles from './styles';

const ConfirmedIosPurchase = ({ handleDonePress }) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const ilustrationStyle = useMemo(() => ({
    width,
    height: '42%',
  }), [width]);

  return (
    <View style={styles.container}>
      <FastImage
        source={illustrationSource}
        style={ilustrationStyle}
        resizeMode="cover"
      />

      <View style={styles.descriptionContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.processingIosPurchaseTitle}>{t('Fighter.subscriptionCongratulation')}</Text>
          <Text style={styles.processingIosPurchaseInfoText}>{t('Fighter.accessToContent')}</Text>
        </View>

        <View style={styles.subscriptionPosibilities}>
          <View style={styles.subscriptionPosibilityContainer}>
            <CheckmarkIcon />
            <Text style={[styles.subscriptionPosibility, styles.subscriptionPosibilityMargin]}>
              {t('Fighter.subscriptionPossibility1')}
            </Text>
          </View>

          <View style={styles.subscriptionPosibilityContainer}>
            <CheckmarkIcon />
            <Text style={[styles.subscriptionPosibility, styles.subscriptionPosibilityMargin]}>
              {t('Fighter.subscriptionPossibility2')}
            </Text>
          </View>

          <View style={styles.subscriptionPosibilityContainer}>
            <CheckmarkIcon />

            <Text style={[styles.subscriptionPosibility, styles.subscriptionPosibilityMargin]}>
              {t('Fighter.subscriptionPossibility3')}
            </Text>
          </View>

          <View style={styles.subscriptionPosibilityContainer}>
            <CheckmarkIcon />

            <Text style={styles.subscriptionPosibility}>
              {t('Fighter.subscriptionPossibility4')}
            </Text>
          </View>
        </View>

        <Button title={t('Fighter.done')} onPress={handleDonePress} />
      </View>
    </View>
  );
};

ConfirmedIosPurchase.propTypes = {
  handleDonePress: PropTypes.func.isRequired,
};

export default React.memo(ConfirmedIosPurchase);
