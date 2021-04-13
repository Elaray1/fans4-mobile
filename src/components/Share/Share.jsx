import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, ViewPropTypes, Share as RNShare } from 'react-native';

function Share({
  message,
  children,
  style,
}) {
  const onShare = useCallback(async () => {
    try {
      const result = await RNShare.share({
        message,
      });
      if (result.action === RNShare.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === RNShare.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [message]);

  return (
    <TouchableOpacity
      style={style}
      onPress={onShare}
    >
      {children}
    </TouchableOpacity>
  );
}

Share.propTypes = {
  message: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  style: ViewPropTypes.style,
};

Share.defaultProps = {
  style: {},
};

export default React.memo(Share);
