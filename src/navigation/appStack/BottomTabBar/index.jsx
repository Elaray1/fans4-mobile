/* eslint react/prop-types: off */
import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import TabBarIcon from 'components/TabBarIcon';

import styles from './styles';

// https://reactnavigation.org/docs/5.x/bottom-tab-navigator#tabbar
const TabBarRoute = React.memo(({ navigation, route, index, state, descriptors }) => {
  const { options } = descriptors[route.key];
  const label = options.title || route.name;
  const isFocused = state.index === index;

  const onPress = useCallback(() => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  }, [navigation, route.key, route.name, isFocused]);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      style={styles.tabButtonView}
    >
      <TabBarIcon
        icon={options.icon}
        focused={isFocused}
      />
      {!options.hideLabel
      && (
      <Text style={[styles.buttonText, isFocused && styles.focused]}>
        {label}
      </Text>
      )}
    </TouchableOpacity>
  );
});

function BottomTabBar({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={styles.tabBarView}>
      {state.routes.map((route, index) => (
        <TabBarRoute
          key={route.key}
          navigation={navigation}
          route={route}
          index={index}
          state={state}
          descriptors={descriptors}
        />
      ))}
    </View>
  );
}

export default React.memo(BottomTabBar);
