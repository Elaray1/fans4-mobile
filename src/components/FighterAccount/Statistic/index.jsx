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
  recordCount,
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
      <View style={styles.profileData}>
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
          style={[styles.profileData, styles.profileCenterData]}
          activeOpacity={0.7}
          onPress={onFansPress}
        >
          {fansBlock}
        </TouchableOpacity>
      ) : (
        <View style={[styles.profileData, styles.profileCenterData]}>
          {fansBlock}
        </View>
      )}
      <View style={styles.profileData}>
        <Text style={styles.profileDataTitle}>{t('Account.record')}</Text>
        <Text style={styles.profileDataText}>
          {`${recordCount?.wins ?? 0}-${recordCount?.losses ?? 0}-${recordCount?.draws ?? 0}`}
        </Text>
      </View>
    </View>
  );
};

Statistic.propTypes = {
  postsCount: PropTypes.number,
  fansCount: PropTypes.number,
  onFansPress: PropTypes.func,
  recordCount: PropTypes.objectOf(PropTypes.number),
};

Statistic.defaultProps = {
  postsCount: null,
  fansCount: null,
  onFansPress: null,
  recordCount: null,
};

export default React.memo(Statistic);
