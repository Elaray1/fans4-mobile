import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';

import styles from './styles';

function ScrollToTop({ children }) {
  const scrollViewRef = useRef(null);
  useScrollToTop(scrollViewRef);

  return (
    <ScrollView contentContainerStyle={styles.contentContainerStyle} ref={scrollViewRef}>
      {children}
    </ScrollView>
  );
}

ScrollToTop.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ScrollToTop;
