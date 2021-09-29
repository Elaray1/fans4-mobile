import { apiClient } from 'helpers/api';

export const getChatMessages = ({ chatId, page, perPage }) => apiClient
  .get('messages', { page, perPage, chatId });

export const sendMessage = ({ text, chatId }) => apiClient
  .post('messages', { text, chatId });
