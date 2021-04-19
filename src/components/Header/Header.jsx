import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Text from 'components/Text';

import BackArrowIcon from 'assets/icons/back-arrow';

import styles from './Header.styles';

const WIDTH_ICON = 32;

function Header({
  title,
  isBackArrow,
  isBottomLine,
}) {
  const navigation = useNavigation();

  const onBackNavigation = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.header}>
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

        <Text style={styles.title}>{title}</Text>

        <View style={{ width: WIDTH_ICON }} />
      </View>

      {isBottomLine && <View style={[styles.line, { marginTop: isBackArrow ? 18 : 23 }]} />}
    </View>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  isBackArrow: PropTypes.bool,
  isBottomLine: PropTypes.bool,
};

Header.defaultProps = {
  isBackArrow: false,
  isBottomLine: true,
};

export default React.memo(Header);
