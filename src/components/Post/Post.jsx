import React from 'react';
import { View, Image } from 'react-native';
import PropTypes from 'prop-types';

import { CONTENT_TYPES, POST_STATUSES } from 'resources/post/post.constants';

import Text from 'components/Text';

import styles from './Post.styles';

function Post({
  description,
  type,
  contentUrl,
  avatarUrl,
  location,
  fullName,
  status,
}) {
  return (
    <View style={styles.post}>

      {avatarUrl && fullName && location && (
      <View>
        <Image
          style={styles.avatar}
          source={{ uri: avatarUrl }}
        />
        <View>
          <Text>
            {fullName}
          </Text>
          <Text>
            {location}
          </Text>
        </View>
      </View>
      )}

      <View>
        {contentUrl && (
          <Image
            style={{ width: '100%' }}
            source={{ uri: contentUrl }}
          />
        )}
        <Text>{description}</Text>
      </View>


      {status === POST_STATUSES.APPROVED && (
        <View><Text>Approved</Text></View>
      )}
      {status === POST_STATUSES.PENDING && (
      <View><Text>Pending</Text></View>
      )}
    </View>
  );
}

Post.propTypes = {
  description: PropTypes.string,
  type: PropTypes.oneOf(Object.values(CONTENT_TYPES)).isRequired,
  contentUrl: PropTypes.string,
  avatarUrl: PropTypes.string,
  location: PropTypes.string,
  fullName: PropTypes.string,
  status: PropTypes.oneOf(Object.values(POST_STATUSES)).isRequired,
};

Post.defaultProps = {
  description: null,
  contentUrl: null,
  avatarUrl: null,
  location: null,
  fullName: null,
};

export default React.memo(Post);
