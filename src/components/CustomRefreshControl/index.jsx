import React from 'react';
import PropTypes from 'prop-types';
import { RefreshControl } from 'react-native';

import colors from 'themes/colors';

function CustomRefreshControl({ refreshing, onRefresh }) {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.white}
    />
  );
}

CustomRefreshControl.propTypes = {
  refreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.bool.isRequired,
};

CustomRefreshControl.defaultProps = {

};

export default CustomRefreshControl;
