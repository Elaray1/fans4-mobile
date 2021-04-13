import {
  USER_SIGNED_IN,
  USER_LOGGED_OUT,
} from './user.constants';

export default (state = null, action) => {
  switch (action.type) {
    case USER_SIGNED_IN:
      return {
        ...state,
        ...action.userInfo,
      };

    case USER_LOGGED_OUT:
      return null;

    default:
      return state;
  }
};
