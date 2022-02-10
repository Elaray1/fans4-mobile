import React, { useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';

import CrossIcon from 'assets/icons/cross';

import Text from 'components/Text';
import Header from 'components/Header';

import styles from './styles';

const posterAspectRatio = 16 / 9;

const EndedStreamView = ({ eventName, eventImageUrl, onClose }) => {
  const { t } = useTranslation();

  const { width } = useWindowDimensions();

  const posterContainerStyles = useMemo(() => ({
    width,
    height: width / posterAspectRatio,
  }), [width]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header
          title={eventName}
          leftItemType="icon"
          leftItemIcon={CrossIcon}
          onLeftItemPress={onClose}
        />
      </View>

      <View style={styles.wrapper}>
        <View style={styles.posterContainer}>
          <FastImage style={[styles.posterImage, posterContainerStyles]} source={{ uri: eventImageUrl }} />
          <View style={styles.posterBackgroundColor} />
        </View>

        <View style={[styles.textContainer, posterContainerStyles]}>
          <Text style={styles.title}>{t('CountdownTimer.liveStreamHasEnded')}</Text>
          <Text style={styles.text}>{t('CountdownTimer.videoWillBeAvailableSoon')}</Text>
        </View>
      </View>
    </View>
  );
};

EndedStreamView.propTypes = {
  eventName: PropTypes.string.isRequired,
  eventImageUrl: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};


export default React.memo(EndedStreamView);
