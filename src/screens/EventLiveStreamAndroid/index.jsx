import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { SafeAreaView, View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

import * as eventApi from 'resources/event/event.api';
import config from 'resources/config';

import Header from 'components/Header';

import colors from 'themes/colors';

import styles from './styles';

const EventLiveStreamAndroid = ({ route }) => {
  const { eventId, eventName, eventStreamLink: prefetchedEventStreamLink } = route.params;

  const navigation = useNavigation();

  const [eventStreamLink, setEventStreamLink] = useState(prefetchedEventStreamLink);
  const [isLoading, setIsLoading] = useState(true);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    const getStreamLink = async () => {
      if (!eventStreamLink) {
        const { link } = await eventApi.getStreamLinkByEventId(eventId);
        setEventStreamLink(link);
      }
    };

    getStreamLink();
  }, [eventStreamLink, eventId]);

  const liveStreamSource = useMemo(() => ({
    uri: `${config.liveStreamPlayerUrl}/?link=${eventStreamLink}`,
  }), [eventStreamLink]);

  const onWebViewMessage = useCallback((msg) => {
    if (msg.nativeEvent.data === 'video_started') {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <SafeAreaView style={styles.screen}>
        <Header
          title={eventName}
          leftItemType="backArrow"
          onLeftItemPress={goBack}
        />

        <View style={styles.container}>
          {eventStreamLink && (
            <WebView
              style={styles.webView}
              onMessage={onWebViewMessage}
              source={liveStreamSource}
              mediaPlaybackRequiresUserAction={false}
            />
          )}

          {(!eventStreamLink || isLoading) && (
            <View style={styles.loadingView}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

EventLiveStreamAndroid.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      eventId: PropTypes.string.isRequired,
      eventName: PropTypes.string.isRequired,
      eventStreamLink: PropTypes.string,
    }),
  }).isRequired,
};

export default React.memo(EventLiveStreamAndroid);
