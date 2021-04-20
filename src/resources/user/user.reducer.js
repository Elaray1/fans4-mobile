import {
  SET_USER_DATA,
  USER_LOGGED_OUT,
} from './user.constants';

export default (state = null, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return action.user;
    case USER_LOGGED_OUT:
      return null;
    default:
      return state;
  }
};
