import {
  USER_LOGGED_OUT,
  SET_USER_DATA,
} from './user.constants';

export default (state = null, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        ...action.user,
      };
    case USER_LOGGED_OUT:
      return null;
    default:
      return state;
  }
};
