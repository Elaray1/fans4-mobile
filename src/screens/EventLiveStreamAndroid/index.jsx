import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { SafeAreaView, View, ActivityIndicator, useWindowDimensions,
  TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import Orientation from 'react-native-orientation-locker';

import * as eventApi from 'resources/event/event.api';
import config from 'resources/config';

import CloseWithBackgroundIcon from 'assets/icons/close-with-background.svg';

import Header from 'components/Header';
import Text from 'components/Text';

import colors from 'themes/colors';

import useHorizontalModeHeader from './hooks/useHorizontaModeHeader';

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

  useEffect(() => {
    Orientation.unlockAllOrientations();
    return () => Orientation.lockToPortrait();
  }, []);

  const { width, height } = useWindowDimensions();
  const isPortraitOrientation = height > width;

  const liveStreamSource = useMemo(() => ({
    uri: `${config.liveStreamPlayerUrl}/?link=${eventStreamLink}`,
  }), [eventStreamLink]);

  const [isHorizontalModeHeaderShown, setIsHorizontalModeHeaderShown] = useState(true);
  const { prolongControlsShowing } = useHorizontalModeHeader({
    onHorizontalModeHeaderToggled: setIsHorizontalModeHeaderShown,
  });

  const onWebViewMessage = useCallback((msg) => {
    if (msg.nativeEvent.data === 'video_started') {
      prolongControlsShowing();
      setIsLoading(false);
    }
  }, [prolongControlsShowing]);

  return (
    <>
      <SafeAreaView style={styles.screen}>
        {isPortraitOrientation && (
          <Header
            title={eventName}
            leftItemType="close"
            onLeftItemPress={goBack}
          />
        )}

        <View style={styles.container}>
          {eventStreamLink && (
            <TouchableWithoutFeedback onPress={prolongControlsShowing} style={styles.webViewPressableContainer}>
              <WebView
                scrollEnabled={false}
                nestedScrollEnabled={false}
                cacheEnabled={false}
                allowsFullscreenVideo
                style={styles.webView}
                onMessage={onWebViewMessage}
                source={liveStreamSource}
                mediaPlaybackRequiresUserAction={false}
              />
            </TouchableWithoutFeedback>
          )}

          {(!eventStreamLink || isLoading) && (
            <View style={styles.loadingView}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        </View>

        {!isPortraitOrientation && isHorizontalModeHeaderShown && (
          <View style={styles.horizontalModeHeader}>
            <TouchableOpacity activeOpacity={0.7} onPress={goBack}>
              <CloseWithBackgroundIcon />
            </TouchableOpacity>
            <Text style={styles.horizontalModeTitle}>{eventName}</Text>
          </View>
        )}
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
