import {
  USER_SIGNED_IN,
  USER_LOGGED_OUT,
  USER_FILLED_REGISTRATION_FORM,
} from './user.constants';

export default (state = {}, action) => { // TODO: change to null
  switch (action.type) {
    case USER_SIGNED_IN:
      return {
        ...state,
        ...action.userInfo,
      };

    case USER_LOGGED_OUT:
      return null;

    case USER_FILLED_REGISTRATION_FORM:
      return {
        ...state,
        ...action.user,
      };

    default:
      return state;
  }
};
