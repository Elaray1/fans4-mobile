import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';

import StatusBadge from 'components/StatusBadge';
import Text from 'components/Text';
import GrayscaledImage from 'components/GrayscaledImage';


import { USER_STATUSES } from 'resources/user/user.constants';

import styles from './styles';

const Profile = ({
  avatarUrl,
  fullName,
  nickname,
  location,
  fightingStatus,
  status,
}) => {
  const ImageComponent = status === USER_STATUSES.BLOCKED ? GrayscaledImage : FastImage;

  return (
    <View style={styles.profileBlock}>
      <ImageComponent
        style={styles.photoImage}
        source={{ uri: avatarUrl }}
      />
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
  status: PropTypes.string.isRequired,
};

Profile.defaultProps = {
  nickname: null,
};

export default React.memo(Profile);
