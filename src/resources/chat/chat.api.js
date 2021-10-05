import { apiClient } from 'helpers/api';

export const getChatByParticipantIds = participantIds => apiClient
  .get('chats', { participantIds });

export const getChatsList = ({ page, perPage }) => apiClient
  .get('chats/list', { page, perPage });

export const readMessages = ({ _id }) => apiClient
  .put(`chats/${_id}`);
