import React, { useCallback, useState } from 'react';
import {
  View, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment-timezone';

import { EVENT_STATUSES, LIVE_STREAM_STATUSES } from 'resources/event/event.constants';

import Text from 'components/Text';

import LiveIcon from 'assets/icons/live.svg';

import { toLocalDateAndTime } from 'helpers/toLocalTime';

import useEventUpdated from '../../hooks/useEventUpdated';

import styles from './styles';

const TABS = { UPCOMING: 'upcoming', PAST: 'past' };

const posterAspectRatio = 16 / 9;
const aspectRatioStyle = { aspectRatio: posterAspectRatio };

function EventItem({ event: initialEvent, activeTab }) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [event, setEvent] = useState(initialEvent);
  const [visible, setVisible] = useState(true);

  const onEventUpdated = useCallback((updatedEvent) => {
    const isPast = updatedEvent.status === EVENT_STATUSES.PAST
      && (updatedEvent.liveStream.status === LIVE_STREAM_STATUSES.FINISHED
      || updatedEvent.liveStream.status === LIVE_STREAM_STATUSES.PROCESSING);

    const isEventVisible = !(isPast && activeTab !== TABS.PAST);
    setVisible(isEventVisible);

    setEvent(updatedEvent);
  }, [activeTab]);

  useEventUpdated({ eventId: event._id, onEventUpdated });

  const onEventPress = useCallback(() => {
    navigation.navigate('EventFights', { event, isNeedToFetchEvent: true });
  }, [navigation, event]);

  if (!visible) {
    return null;
  }

  const progress = `${(event.fights.filter(fight => fight.results !== undefined).length) / event.fights.length * 100}%`;

  const isLive = event.status === EVENT_STATUSES.PAST
    && event.liveStream.status !== LIVE_STREAM_STATUSES.FINISHED
    && event.liveStream.status !== LIVE_STREAM_STATUSES.PROCESSING;

  return (
    <TouchableOpacity
      onPress={onEventPress}
      activeOpacity={0.7}
      style={styles.event}
    >
      <View style={[styles.imageContainer, aspectRatioStyle]}>
        <FastImage
          style={[styles.photoImage, aspectRatioStyle]}
          source={{ uri: event.imageUrl }}
        />

        {event.status === EVENT_STATUSES.CANCELLED && moment().isBefore(event.date) && (
          <View style={styles.imageStatus}>
            <Text style={styles.imageText}>{t('Events.cancelled')}</Text>
          </View>
        )}

        {isLive && (
          <View style={styles.live}>
            <LiveIcon />
            <Text>{t('Events.live')}</Text>
          </View>
        )}

        {isLive && (
          <View style={styles.line}>
            <View style={[styles.progress, {
              width: progress,
            }]}
            />
          </View>
        )}
      </View>
      <View>
        <Text style={styles.titleText}>{event.name}</Text>
        <Text style={styles.text}>{toLocalDateAndTime(event)}</Text>
        <Text style={styles.text}>
          {`${event.location.cityName}, ${event.location.stateCode}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

EventItem.propTypes = {
  event: PropTypes.shape().isRequired,
  activeTab: PropTypes.oneOf(Object.values(TABS)).isRequired,
};

export default React.memo(EventItem);
