import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Text from 'components/Text';

import styles from './styles';

function StripeAccountStatus({ status }) {
  const { t } = useTranslation();

  return (
    <View style={styles.statusWrapper}>
      <View style={[
        styles.statusContainer,
        styles[`${status}Container`],
      ]}
      >
        <Text style={[styles.statusText, styles[`${status}Text`]]}>
          {t(`StripeAccountStatus.${status}`)}
        </Text>
      </View>
    </View>
  );
}

StripeAccountStatus.propTypes = {
  status: PropTypes.oneOf([
    'active',
    'pending',
    'restricted',
  ]).isRequired,
};

export default React.memo(StripeAccountStatus);
