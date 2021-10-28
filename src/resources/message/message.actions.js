import {
  ADD_UNREAD_MESSAGE,
  REMOVE_UNREAD_MESSAGE,
  SET_UNREAD_MESSAGES,
} from './message.constants';

export const setUnreadMessages = messageIds => async (dispatch) => {
  dispatch({ type: SET_UNREAD_MESSAGES, messageIds });
};

export const addUnreadMessage = messageId => async (dispatch) => {
  dispatch({ type: ADD_UNREAD_MESSAGE, messageId });
};

export const removeUnreadMessage = messageId => async (dispatch) => {
  dispatch({ type: REMOVE_UNREAD_MESSAGE, messageId });
};
