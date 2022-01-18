import { useRef } from 'react';
import { useWindowDimensions, Animated } from 'react-native';

import useDidUpdate from 'hooks/useDidUpdate';

const ANIMATION_DURATION = 250;

const muteSound = (isMuted) => {
  return `
    document.querySelectorAll('video').forEach(video => {
      video.muted = ${isMuted};
    });
  `;
};

const useVisibilityChanged = ({ visible, webViewRef, pause }) => {
  const { height: windowHeight } = useWindowDimensions();
  const animation = useRef(new Animated.Value(windowHeight)).current;

  useDidUpdate(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();

      webViewRef.current?.injectJavaScript(muteSound(false));

      return;
    }

    webViewRef.current?.injectJavaScript(muteSound(true));

    Animated.timing(animation, {
      toValue: windowHeight,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }, [animation, visible, windowHeight, pause]);

  return animation;
};

export default useVisibilityChanged;
