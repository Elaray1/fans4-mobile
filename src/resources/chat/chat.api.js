import { apiClient } from 'helpers/api';

export const getChatByParticipantIds = participantIds => apiClient
  .get('chats', { participantIds });

export const getChatsList = ({ page, perPage }) => apiClient
  .get('chats/list', { page, perPage });

export const getChatWithFans4 = () => apiClient
  .get('chats/fans4');

export const getListOfFans = ({ page, perPage, search }) => apiClient
  .get('chats/list/new-chat', { page, perPage, search });
