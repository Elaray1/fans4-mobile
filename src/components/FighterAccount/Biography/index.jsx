import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import ArrowUpIcon from 'assets/icons/arrow-up';
import ArrowDownIcon from 'assets/icons/arrow-down';

import Text from 'components/Text';

import styles from './styles';

const Biography = ({
  biography,
  onAddBiographyPress,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(onAddBiographyPress ? !biography : false);

  const onBiographyPress = () => {
    setIsOpen(!isOpen);
  };

  const renderBiography = () => {
    if (biography) {
      return (
        <Text style={styles.biographyText}>
          {biography}
        </Text>
      );
    }

    if (onAddBiographyPress) {
      return (
        <TouchableOpacity
          style={styles.addBiographyContainter}
          activeOpacity={0.7}
          onPress={onAddBiographyPress}
        >
          <Text style={styles.addBiographyText}>
            {t('Account.addBiography')}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <Text style={styles.biographyText}>
        {t('Fighter.fighterHasntAddedBiographyYet')}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.biographyBlock}
      onPress={onBiographyPress}
    >
      <View
        style={[styles.biographyData, !isOpen && styles.biographyClosedData]}
      >
        <Text style={styles.blockTitle}>
          {t('Account.biography')}
        </Text>
        {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </View>

      {isOpen && renderBiography()}
    </TouchableOpacity>
  );
};

Biography.propTypes = {
  biography: PropTypes.string,
  onAddBiographyPress: PropTypes.func,
};

Biography.defaultProps = {
  biography: null,
  onAddBiographyPress: null,
};

export default React.memo(Biography);
