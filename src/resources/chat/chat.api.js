import { apiClient } from 'helpers/api';

export const getChatByParticipantIds = participantsIds => apiClient
  .get('chats', { participantsIds });
