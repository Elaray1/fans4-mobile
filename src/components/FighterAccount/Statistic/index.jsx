import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import colors from 'themes/colors';

import Text from 'components/Text';

import styles from './styles';

const Statistic = ({
  postsCount,
  fansCount,
  onFansPress,
}) => {
  const { t } = useTranslation();

  const fansBlock = (
    <>
      <Text style={styles.profileDataTitle}>{t('Account.fans')}</Text>
      <Text style={styles.profileDataText}>
        {fansCount === null
          ? <ActivityIndicator color={colors.white} />
          : fansCount
        }
      </Text>
    </>
  );

  return (
    <View style={styles.profileBlock}>
      <View style={[styles.profileData, styles.profileLeftData]}>
        <Text style={styles.profileDataTitle}>{t('Account.posts')}</Text>
        <Text style={styles.profileDataText}>
          {postsCount === null
            ? <ActivityIndicator color={colors.white} />
            : postsCount
          }
        </Text>
      </View>
      {onFansPress ? (
        <TouchableOpacity
          style={[styles.profileData, styles.profileRightData]}
          activeOpacity={0.7}
          onPress={onFansPress}
        >
          {fansBlock}
        </TouchableOpacity>
      ) : (
        <View style={[styles.profileData, styles.profileRightData]}>
          {fansBlock}
        </View>
      )}

    </View>
  );
};

Statistic.propTypes = {
  postsCount: PropTypes.number,
  fansCount: PropTypes.number,
  onFansPress: PropTypes.func,
};

Statistic.defaultProps = {
  postsCount: null,
  fansCount: null,
  onFansPress: null,
};

export default React.memo(Statistic);
