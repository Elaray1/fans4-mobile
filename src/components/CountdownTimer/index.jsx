import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

import CrossIcon from 'assets/icons/cross';

import Text from 'components/Text';
import Header from 'components/Header';

import { LIVE_STREAM_STATUSES } from 'resources/event/event.constants';

import { toLocalDateAndTime } from 'helpers/toLocalTime';

import styles from './styles';

const posterAspectRatio = 16 / 9;

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

const CountdownTimer = ({ eventName, eventImageUrl, eventDate, eventTimezone, onClose, eventLiveStreamStatus }) => {
  const { t } = useTranslation();

  const { width } = useWindowDimensions();

  const posterContainerStyles = useMemo(() => ({
    width,
    height: width / posterAspectRatio,
  }), [width]);

  const eventDateAsMoment = moment(eventDate);

  const [dateDiff, setDateDiff] = useState(null);

  const intervalId = useRef();

  const isStreamEnded = eventLiveStreamStatus === LIVE_STREAM_STATUSES.PROCESSING;
  const isNeedToUpdateTime = !isStreamEnded && eventDate > moment();

  const setTime = useCallback(() => {
    const currentDate = moment();
    const dateDiffInMilliseconds = eventDateAsMoment.diff(currentDate);

    setDateDiff(dateDiffInMilliseconds);
  }, [eventDateAsMoment]);

  useEffect(() => {
    if (isNeedToUpdateTime) {
      setTime();
      return;
    }

    setDateDiff(0);
  }, [isNeedToUpdateTime, setTime]);

  useEffect(() => {
    if (isNeedToUpdateTime) {
      intervalId.current = setInterval(() => {
        setTime();
      }, 1000);

      return () => clearInterval(intervalId.current);
    }
  }, [isNeedToUpdateTime, setTime]);

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

      <View style={styles.countdownWrapper}>
        <View style={styles.countdown}>
          <FastImage style={[styles.posterImage, posterContainerStyles]} source={{ uri: eventImageUrl }} />
          <View style={styles.posterBackgroundColor} />

          <View style={[styles.countdownTextContainer, posterContainerStyles]}>
            {isStreamEnded && (
              <>
                <Text style={styles.countdownTitle}>{t('CountdownTimer.liveStreamHasEnded')}</Text>
                <Text style={styles.countdownText}>{t('CountdownTimer.videoWillBeAvailableSoon')}</Text>
              </>
            )}
            {dateDiff !== null && !isStreamEnded && (
              <>
                <Text style={styles.countdownTitle}>
                  {`${t('CountdownTimer.liveIn')} ${formateCountdownTime(dateDiff)}`}
                </Text>
                <Text style={styles.countdownText}>
                  {dateDiff > 0
                    ? toLocalDateAndTime({ date: eventDate, location: { timezone: eventTimezone } })
                    : t('CountdownTimer.waitingForLiveStreaming')
                    }
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

CountdownTimer.propTypes = {
  eventName: PropTypes.string.isRequired,
  eventImageUrl: PropTypes.string.isRequired,
  eventDate: PropTypes.string.isRequired,
  eventTimezone: PropTypes.string.isRequired,
  eventLiveStreamStatus: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};


export default React.memo(CountdownTimer);
