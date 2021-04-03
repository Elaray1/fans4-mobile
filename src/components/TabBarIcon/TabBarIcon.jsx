import React from 'react';
import PropTypes from 'prop-types';

import colors from 'themes/colors';

function TabBarIcon({ icon: Icon, focused }) {
  return (
    <Icon
      fill={focused ? colors.tabBarActive : colors.tabBarInactive}
      style={{
        stroke: focused ? colors.tabBarActive : colors.tabBarInactive,
        color: focused ? colors.tabBarActive : colors.tabBarInactive,
      }}
    />
  );
}

TabBarIcon.propTypes = {
  focused: PropTypes.bool,
  icon: PropTypes.elementType.isRequired,
};

TabBarIcon.defaultProps = {
  focused: false,
};

export default TabBarIcon;
