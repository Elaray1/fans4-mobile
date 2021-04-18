import {
  SET_USER_AUTHENTICATED,
  SET_USER_DATA,
} from './user.constants';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_USER_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_USER_DATA:
      return {
        ...state,
        userData: {
          ...state.userData,
          ...action.user,
        },
      };
    default:
      return state;
  }
};
