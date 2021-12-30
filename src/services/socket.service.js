import io from 'socket.io-client';

import config from 'resources/config';

class WebsocketsService {
  connect({ query, rooms }) {
    this._socket = io(config.webSocketUrl, {
      transports: ['websocket'],
      query,
    });

    this.rooms = rooms || [];

    this._socket.on('connect', () => {
      console.log('websockets connected');

      this.rooms.forEach((roomId) => {
        this._socket.emit('subscribe', roomId);
      });
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

    this.rooms = [];
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

  joinRoom(roomId) {
    if (!this._socket) {
      return;
    }

    this.rooms.push(roomId);
    this._socket.emit('subscribe', roomId);
  }

  leaveRoom(roomId) {
    if (!this._socket) {
      return;
    }

    const i = this.rooms.findIndex(r => r === roomId);
    if (i === -1) {
      return;
    }

    this._socket.emit('unsubscribe', roomId);
    this.rooms.splice(i, 1);
  }
}

export default new WebsocketsService();
