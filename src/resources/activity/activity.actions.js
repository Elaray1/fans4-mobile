import {
  SET_USER_DATA,
} from 'resources/user/user.constants';

import * as api from './activity.api';

export const readActivities = () => async (dispatch) => {
  const user = await api.readActivities();


  dispatch({ type: SET_USER_DATA, user });
  return user;
};
