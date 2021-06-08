import React from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';

import StatusBadge from 'components/StatusBadge';
import Text from 'components/Text';

import styles from './styles';

const Profile = ({
  avatarUrl,
  fullName,
  nickname,
  location,
  fightingStatus,
}) => {
  return (
    <View style={styles.profileBlock}>
      <Image
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
        {fightingStatus && <StatusBadge status={fightingStatus} />}
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
};

Profile.defaultProps = {
  nickname: null,
};

export default React.memo(Profile);
