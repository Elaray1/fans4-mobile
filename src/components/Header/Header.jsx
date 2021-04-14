import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Text from 'components/Text';

import BackArrowIcon from 'assets/icons/back-arrow.svg';

import styles from './Header.styles';

const WIDTH_ICON = 32;

function Header({ title, isBackArrow }) {
  const navigation = useNavigation();

  const onBackNavigation = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.headerWrapper}>
      <View style={[styles.header, isBackArrow ? { marginTop: 25 } : { marginTop: 30 }]}>
        {isBackArrow ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBackNavigation}
            style={styles.backButtonWrapper}
          >
            <View style={styles.backButton}>
              <BackArrowIcon />
            </View>
          </TouchableOpacity>
        ) : <View style={{ width: WIDTH_ICON }} />}

        <Text>{title}</Text>

        <View style={{ width: WIDTH_ICON }} />
      </View>

      <View style={[styles.line, isBackArrow ? { marginTop: 18 } : { marginTop: 23 }]} />
    </View>

  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  isBackArrow: PropTypes.bool,
};

Header.defaultProps = {
  isBackArrow: false,
};

export default React.memo(Header);
