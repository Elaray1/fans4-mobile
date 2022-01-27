import { combineReducers } from 'redux';

import { USER_LOGGED_OUT } from 'resources/user/user.constants';
import user from 'resources/user/user.reducer';
import post from 'resources/post/post.reducer';
import message from 'resources/message/message.reducer';
import activity from 'resources/activity/activity.reducer';

import purchases from './purchases/purchases.reducer';
import introVideo from './introVideo/introVideo.reducer';

const appReducer = combineReducers({
  user,
  purchases,
  post,
  introVideo,
  message,
  activity,
});

const rootReducer = (state, action) => {
  if (action.type === USER_LOGGED_OUT) {
    // eslint-disable-next-line no-param-reassign
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
