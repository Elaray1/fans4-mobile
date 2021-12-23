import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Animated,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';

import OfflineIcon from 'assets/icons/offline';

import styles from './styles';

const initialAnimationValue = -50;

function OfflineBanner() {
  const [isConnected, setIsConneted] = useState(false);
  const { t } = useTranslation();

  const animation = useRef(new Animated.Value(initialAnimationValue)).current;

  useEffect(() => {
    NetInfo.addEventListener((state) => {
      setIsConneted(state.isConnected);
    });
  }, []);

  useEffect(() => {
    if (!isConnected) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: initialAnimationValue,
        duration: 10,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected, animation]);

  if (isConnected) {
    return null;
  }

  return (
    <View style={styles.bannerWrapper}>
      <Animated.View style={[styles.bannerContainer, {
        transform: [{
          translateY: animation,
        }],
      }]}
      >
        <OfflineIcon />
        <View>
          <Text style={styles.bannerText}>{t('OfflineBanner.youAreOffline1')}</Text>
          <Text style={styles.bannerText}>{t('OfflineBanner.youAreOffline2')}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

export default OfflineBanner;
