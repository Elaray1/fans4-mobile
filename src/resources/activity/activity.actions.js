import {
  SET_IS_UNREAD_ACTIVITIES,
} from './activity.constants';

export const setIsUnreadActivities = isUnreadActivities => (dispatch) => {
  dispatch({ type: SET_IS_UNREAD_ACTIVITIES, isUnreadActivities });
};
