import React, { useCallback, useState, useMemo, useRef } from 'react';
import { View, SafeAreaView, useWindowDimensions, TouchableOpacity } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import BackArrowIcon from 'assets/icons/back-arrow';

import OnBoarding1 from 'components/OnBoarding1';
import OnBoarding2 from 'components/OnBoarding2';
import OnBoarding3 from 'components/OnBoarding3';

import styles from './styles';

const onboardingStyles = { titleStyles: styles.title, illustrationContainerStyles: styles.illustrationContainer };

function OnBoarding() {
  const { width: screenWidth } = useWindowDimensions();

  const carouselRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const onNextStep = useCallback(() => {
    setActiveIndex(activeIndex + 1);
    carouselRef.current.snapToNext();
  }, [activeIndex]);

  const onPreviousStep = useCallback(() => {
    setActiveIndex(activeIndex - 1);
    carouselRef.current.snapToPrev();
  }, [activeIndex]);

  const onSnapToItem = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const OnboardingSteps = useMemo(() => {
    return [
      <OnBoarding1 {...onboardingStyles} onNext={onNextStep} />,

      <View style={styles.screen}>
        <TouchableOpacity
          onPress={onPreviousStep}
          activeOpacity={0.7}
          style={styles.backArrow}
        >
          <BackArrowIcon />
        </TouchableOpacity>
        <OnBoarding2 {...onboardingStyles} onNext={onNextStep} />
      </View>,

      <View style={styles.screen}>
        <TouchableOpacity
          onPress={onPreviousStep}
          activeOpacity={0.7}
          style={styles.backArrow}
        >
          <BackArrowIcon />
        </TouchableOpacity>
        <OnBoarding3 {...onboardingStyles} />
      </View>,
    ];
  }, [onNextStep, onPreviousStep]);

  const renderItem = useCallback(({ item }) => item, []);

  const pagination = useCallback(() => {
    return (
      <Pagination
        dotsLength={OnboardingSteps.length}
        activeDotIndex={activeIndex}
        containerStyle={styles.pagination}
        dotStyle={styles.dot}
        inactiveDotStyle={styles.inactiveDot}
        inactiveDotScale={1}
      />
    );
  }, [activeIndex, OnboardingSteps.length]);

  return (
    <SafeAreaView style={styles.screen}>
      <Carousel
        ref={carouselRef}
        data={OnboardingSteps}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        renderItem={renderItem}
        onSnapToItem={onSnapToItem}
      />
      {pagination()}
    </SafeAreaView>
  );
}

export default React.memo(OnBoarding);
