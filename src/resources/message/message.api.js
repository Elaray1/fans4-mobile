import { apiClient } from 'helpers/api';

export const getChatMessages = ({ chatId, offset, perPage }) => apiClient
  .get('messages', { chatId, offset, perPage });

export const sendMessage = ({ text, chatId }) => apiClient
  .post('messages', { text, chatId });

export const readMessage = _id => apiClient
  .put(`messages/${_id}/read`);
