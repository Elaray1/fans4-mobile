import io from 'socket.io-client';

import config from 'resources/config';

class WebsocketsService {
  connect({ query, onConnect }) {
    this._socket = io(config.webSocketUrl, {
      transports: ['websocket'],
      query,
    });

    this._socket.on('connect', () => {
      console.log('websockets connected');

      if (onConnect) {
        onConnect();
      }
    });

    this._socket.on('disconnect', () => {
      console.log('websockets disconnected');
    });

    this._socket.connect();
  }

  disconnect() {
    if (this._socket) {
      this._socket.disconnect();
    }

    this._socket = null;
  }

  emit(event, ...args) {
    if (!this._socket) {
      return;
    }

    this._socket.emit(event, ...args);
  }

  on(event, callback) {
    if (!this._socket) {
      return;
    }

    this._socket.on(event, callback);
  }

  off(event, callback) {
    if (!this._socket) {
      return;
    }

    this._socket.removeListener(event, callback);
  }
}

export default new WebsocketsService();
