export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  WAS_OPENED_BEFORE: 'was_opened_before',
};

export const UNCLEEANABLE_STORAGE_KEYS = [STORAGE_KEYS.WAS_OPENED_BEFORE];

export const PUSH_NOTIFICATION_TYPES = {
  POST_STATUS_CHANGED: 'post_status_changed',
  FIGHTER_REGISTRATION_APPROVED: 'fighter_registration_approved',
  FIGHTER_REGISTRATION_DECLINED: 'fighter_registration_declined',
  STRIPE_PAYOUT_ACCOUNT_STATUS_CHANGED: 'stripe_payout_account_status_changed',
  NEW_SUBSCRIBER: 'new_subscriber',
  FIGHTER_IN_FIGHT_VOTING: 'FIGHTER_IN_FIGHT_VOTING',
  FAN_PROPOSED_FIGHT_IN_VOTING: 'fan_proposed_fight_in_voting',
  FAN_PROPOSED_FIGHT_IN_UPCOMING_EVENT: 'fan_proposed_fight_in_voting',
  FAN_VOTED_FIGHT_IN_UPCOMING_EVENT: 'fan_proposed_fight_in_voting',
};

export const FANS4_ACCOUNT = {
  _id: 'fans4',
};

export const MEDIA_UPLOADING_STATUSES = {
  UPLOADING: 'uploading',
  ERROR: 'error',
  COMPLETED: 'completed',
};
