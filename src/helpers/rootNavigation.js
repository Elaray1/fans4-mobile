import * as React from 'react';

import { CommonActions, StackActions } from '@react-navigation/native';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function push(...args) {
  navigationRef.current?.dispatch(StackActions.push(...args));
}

export function reset(...args) {
  navigationRef.current?.dispatch({ ...CommonActions.reset(...args) });
}

export function isInitialRoute() {
  return navigationRef.current?.getCurrentRoute().name === 'SelectUserType';
}

export function resetToScreen(stack, screen, params) {
  reset({
    index: 0,
    routes: [{
      name: stack,
      state: {
        routes: [{
          name: screen,
          params,
        }],
      },
    }],
  });
}
