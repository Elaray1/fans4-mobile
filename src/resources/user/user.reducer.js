import {
  USER_LOGGED_OUT,
  USER_FILLED_REGISTRATION_FORM,
  SET_USER_DATA,
} from './user.constants';

export default (state = null, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        userData: {
          ...state.userData,
          ...action.user,
        },
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
