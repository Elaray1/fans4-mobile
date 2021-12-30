import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

import CrossIcon from 'assets/icons/cross';

import Text from 'components/Text';
import Header from 'components/Header';

import { toLocalDateAndTime } from 'helpers/toLocalTime';

import styles from './styles';

const { width } = Dimensions.get('window');

const posterAspectRatio = 16 / 9;
const posterContainerStyles = {
  width,
  height: width / posterAspectRatio,
};

const addZeroToNumber = number => (number.toString().length < 2 ? `0${number}` : number);

const formateCountdownTime = (ms) => {
  if (ms <= 0) {
    return '00:00:00';
  }

  const tempTime = moment.duration(ms);

  let days = tempTime.asDays();
  days = days < 1 ? 0 : Math.ceil(days);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  }

  const hours = addZeroToNumber(tempTime.hours());
  const minutes = addZeroToNumber(tempTime.minutes());
  const seconds = addZeroToNumber(tempTime.seconds());

  return `${hours}:${minutes}:${seconds}`;
};

const CountdownTimer = ({ visible, event, onClose }) => {
  const { t } = useTranslation();

  const eventDate = moment(event.date);

  const [dateDiff, setDateDiff] = useState(null);

  const intervalId = useRef();

  useEffect(() => {
    intervalId.current = setInterval(() => {
      const currentDate = moment();
      const dateDiffInMilliseconds = eventDate.diff(currentDate);

      setDateDiff(dateDiffInMilliseconds);
    }, 1000);

    return () => clearInterval(intervalId.current);
  }, [eventDate]);

  return (
    <Modal visible={visible}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header
            title={event.name}
            leftItemType="icon"
            leftItemIcon={CrossIcon}
            onLeftItemPress={onClose}
          />
        </View>

        <View style={styles.countdownWrapper}>
          <View style={styles.countdown}>
            <FastImage style={[styles.posterImage, posterContainerStyles]} source={{ uri: event.imageUrl }} />
            <View style={styles.posterBackgroundColor} />

            <View style={[styles.countdownTextContainer, posterContainerStyles]}>
              {dateDiff && (
                <>
                  <Text style={styles.countdownTitle}>
                    {`${t('CountdownTimer.liveIn')} ${formateCountdownTime(dateDiff)}`}
                  </Text>
                  <Text style={styles.countdownText}>
                    {dateDiff > 0
                      ? toLocalDateAndTime(event)
                      : t('CountdownTimer.waitingForLiveStreaming')
                    }
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

CountdownTimer.propTypes = {
  visible: PropTypes.bool,
  event: PropTypes.shape().isRequired,
  onClose: PropTypes.func.isRequired,
};

CountdownTimer.defaultProps = {
  visible: false,
};


export default React.memo(CountdownTimer);
