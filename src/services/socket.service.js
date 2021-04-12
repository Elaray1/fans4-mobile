import io from 'socket.io-client';
import { getMaskedDeviceId } from 'helpers/deviceInfo';

import config from 'resources/config';

let socket; // eslint-disable-line import/no-mutable-exports

export const emit = (event, ...args) => {
  if (!socket) return;
  socket.emit(event, ...args);
};

export const on = (event, callback) => {
  if (!socket) return;
  socket.on(event, callback);
};

export const removeListener = (event, callback) => {
  if (!socket) return;
  socket.removeListener(event, callback);
};

export const connect = async () => {
  socket = io(config.webSocketUrl, {
    transports: ['websocket'],
    query: {
      accessToken: config.accessToken,
      deviceId: getMaskedDeviceId(),
    },
  });

  socket.on('connect', () => {
    console.log('WS connected'); // eslint-disable-line no-console
  });

  socket.on('disconnect', () => {
    console.log('WS disconnected'); // eslint-disable-line no-console
  });
};

export const disconnect = () => {
  if (!socket) return;
  socket.disconnect();
};

export const disconnected = () => {
  return !socket || socket.disconnected;
};

export const connected = () => {
  return socket && socket.connected;
};
