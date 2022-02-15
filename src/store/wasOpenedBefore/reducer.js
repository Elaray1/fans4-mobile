import { SET_WAS_OPENED_BEFORE } from './constants';

export default (state = false, action) => {
  switch (action.type) {
    case SET_WAS_OPENED_BEFORE:
      return true;

    default:
      return state;
  }
};
