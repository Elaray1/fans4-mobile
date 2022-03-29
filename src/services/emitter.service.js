import mitt from 'mitt';

export const emitter = mitt();

export const EMITTER_EVENTS = {
  NEW_REPLAY: 'new_replay',
  USER_TOGGLED_LIKE: 'user_toggled_like',
  HIGHLIGHT_COMMENT: 'highlight_comment',
};

const eventValues = Object.values(EMITTER_EVENTS);

emitter._emit = emitter.emit;

emitter.emit = (eventName, data) => {
  if (!eventValues.find(e => e === eventName)) {
    throw new Error('no such event');
  }

  return emitter._emit(eventName, data);
};
