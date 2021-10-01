import { apiClient } from 'helpers/api';

export const getChatByParticipantIds = participantIds => apiClient
  .get('chats', { participantIds });
