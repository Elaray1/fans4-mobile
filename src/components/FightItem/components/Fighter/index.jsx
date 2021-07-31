import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';

import Text from 'components/Text';

import { toFixLength } from 'helpers/modifyText';

import styles from './styles';

function Fighter({
  fighter, isWinner, style, onPress,
}) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={style}
      onPress={() => onPress(fighter._id)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <FastImage
          style={[styles.photoImage, isWinner && styles.winnerImage]}
          source={{ uri: fighter.avatarUrl }}
        />
        {isWinner && (
        <View style={styles.winner}>
          <Text style={styles.winnerText}>{t('Fight.winner')}</Text>
        </View>
        )}
      </View>
      <Text style={styles.captionText}>
        {toFixLength({ text: fighter.fullName, length: 30 })}
      </Text>
    </TouchableOpacity>
  );
}

Fighter.propTypes = {
  fighter: PropTypes.shape().isRequired,
  isWinner: PropTypes.bool,
  style: PropTypes.shape(),
  onPress: PropTypes.func,
};

Fighter.defaultProps = {
  isWinner: false,
  style: {},
  onPress: () => null,
};

export default React.memo(Fighter);
