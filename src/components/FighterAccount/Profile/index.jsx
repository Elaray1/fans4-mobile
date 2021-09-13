import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';

import StatusBadge from 'components/StatusBadge';
import Text from 'components/Text';
import GrayscaledImage from 'components/GrayscaledImage';


import { USER_STATUSES, FIGHTER_TYPES } from 'resources/user/user.constants';

import styles from './styles';

const Profile = ({
  avatarUrl,
  fullName,
  nickname,
  location,
  fightingStatus,
  status,
  fighterType,
}) => {
  const { t } = useTranslation();
  const ImageComponent = status === USER_STATUSES.BLOCKED ? GrayscaledImage : FastImage;

  const FIGHTER_TYPE_LABEL = useMemo(() => ({
    pro: t('Fighter.pro'),
    amateur: t('Fighter.amateur'),
  }), [t]);

  return (
    <View style={styles.profileBlock}>
      <ImageComponent
        style={styles.photoImage}
        source={{ uri: avatarUrl }}
      />
      <View style={[styles.fighterBadge, fighterType === FIGHTER_TYPES.AMATEUR && styles.amateur]}>
        <Text style={styles.fighterBadgeText}>{FIGHTER_TYPE_LABEL[fighterType]}</Text>
      </View>
      <View>
        <Text style={styles.fullName}>{fullName}</Text>

        {nickname && (
          <Text style={styles.nickname}>
            “
            {nickname}
            ”
          </Text>
        )}

        <Text style={styles.location}>{location}</Text>

        <StatusBadge status={status === USER_STATUSES.BLOCKED ? status : fightingStatus} />
      </View>
    </View>
  );
};

Profile.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  nickname: PropTypes.string,
  location: PropTypes.string.isRequired,
  fightingStatus: PropTypes.string.isRequired,
  status: PropTypes.string,
  fighterType: PropTypes.string.isRequired,
};

Profile.defaultProps = {
  nickname: null,
  status: null,
};

export default React.memo(Profile);
