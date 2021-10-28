import {
  ADD_UNREAD_MESSAGE,
  REMOVE_UNREAD_MESSAGE,
  SET_UNREAD_MESSAGES,
} from './message.constants';

const defaultState = {
  unreadMessageIds: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_UNREAD_MESSAGES:
      return {
        ...state,
        unreadMessageIds: action.messageIds,
      };
    case ADD_UNREAD_MESSAGE:
      return {
        ...state,
        unreadMessageIds: [...state.unreadMessageIds, action.messageId],
      };
    case REMOVE_UNREAD_MESSAGE:
      return {
        ...state,
        unreadMessageIds: state.unreadMessageIds.filter(messageId => messageId !== action.messageId),
      };
    default:
      return state;
  }
};
