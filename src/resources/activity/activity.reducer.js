import {
  SET_IS_UNREAD_ACTIVITIES,
} from './activity.constants';

const defaultState = {
  isUnreadActivities: false,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_IS_UNREAD_ACTIVITIES:
      return {
        ...state,
        isUnreadActivities: action.isUnreadActivities,
      };
    default:
      return state;
  }
};
