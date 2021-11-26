import React from 'react';
import PropTypes from 'prop-types';
import { RefreshControl } from 'react-native';

import colors from 'themes/colors';

function CustomRefreshControl(props) {
  const { refreshing, onRefresh } = props;

  return (
    <RefreshControl
      {...props}
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.white}
    />
  );
}

CustomRefreshControl.propTypes = {
  refreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

CustomRefreshControl.defaultProps = {

};

export default React.memo(CustomRefreshControl);
