import { useRef, useCallback } from 'react';
import { Animated, Easing, Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const ANIMATION_DURATION = 300;

function useAnimatedModal() {
  const animatedValue = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const showModal = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);

  const hideModal = useCallback((callback) => {
    Animated.timing(animatedValue, {
      toValue: SCREEN_HEIGHT,
      duration: ANIMATION_DURATION,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(callback);
  }, [animatedValue]);

  return [animatedValue, showModal, hideModal];
}

export default useAnimatedModal;
