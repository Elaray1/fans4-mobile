import { apiClient } from 'helpers/api';

export const getChatByParticipantIds = participantIds => apiClient
  .get('chats', { participantIds });

export const getChatsList = ({ page, perPage }) => apiClient
  .get('chats/list', { page, perPage });

export const getListOfFans = ({ page, perPage, search }) => apiClient
  .get('chats/list/new-chat', { page, perPage, search });

export const readMessages = ({ _id }) => apiClient
  .put(`chats/${_id}`);
