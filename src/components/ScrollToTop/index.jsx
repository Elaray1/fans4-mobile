import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';

function ScrollToTop({ children }) {
  const scrollViewRef = useRef(null);
  useScrollToTop(scrollViewRef);

  return (
    <ScrollView ref={scrollViewRef}>
      {children}
    </ScrollView>
  );
}

ScrollToTop.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ScrollToTop;
