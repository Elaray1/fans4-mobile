import {
  USER_LOGGED_OUT,
  SET_USER_DATA,
  SET_USER_SUBSCRIPTIONS,
} from './user.constants';

export default (state = null, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        ...action.user,
      };
    case SET_USER_SUBSCRIPTIONS:
      return {
        ...state,
        role: {
          ...state.role,
          subscription: {
            ...state.role.subscription,
            fighters: action.fighters,
          },
        },
      };
    case USER_LOGGED_OUT:
      return null;
    default:
      return state;
  }
};
