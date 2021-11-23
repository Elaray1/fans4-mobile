import { Platform } from 'react-native';
import config from 'react-native-config';
import analytics from '@react-native-firebase/analytics';
import { Amplitude } from '@amplitude/react-native';
import _ from 'lodash';

class AnalyticsService {
  events = {
    SCREEN_OPENED: 'screen_opened',
    FIRST_LAUNCH: 'first_app_launch',
    LAUNCH: 'app_launch',
    IAM_FIGHTER_PRESSED: 'iam_fighter_pressed',
    FIGHTER_SIGNED_UP: 'fighter_signed_up',
    FIGHTER_FORM_SUBMITTED: 'fighter_form_submitted',
    FIGHTER_TOS_ACCEPTED: 'fighter_tos_accepted',
    FIGHTER_SUCCESSFULL_VERIFICATION_OPENED: 'fighter_successful_verification_opened',
    FIGHTER_FAILED_VERIFICATION_OPENED: 'fighter_failed_verification_opened',
    FIGHTER_ONBOARDING_COMPLETED: 'fighter_onboarding_completed',
    FIGHTER_ADD_BIOGRAPHY_STARTED: 'fighter_add_biography_started',
    FIGHTER_BIOGRAPHY_ADDED: 'fighter_biography_added',
    FIGHTER_NEW_POST_ADDING_STARTED: 'fighter_new_post_adding_started',
    FIGHTER_ADDED_POST: 'fighter_added_post',
    FIGHTER_APPLYING_FOR_A_FIGHT_STARTED: 'fighter_applying_for_a_fight_started',
    FIGHTER_OPENED_FIGHTERS_SCREEN: 'fighter_opened_fighters_screen',
    FIGHTER_OPENED_OTHER_FIGHTER_SCREEN: 'fighter_opened_other_fighter_screen',
    FIGHTER_OPENED_EVENTS_SCREEN: 'fighter_opened_events_screen',
    FIGHTER_OPENED_FIGHTS_SCREEN: 'fighter_opened_fights_screen',
    FIGHTER_OPENED_FINANCES_SCREEN: 'fighter_opened_finances_screen',
    FIGHTER_OPENED_SUPPORT_SCREEN: 'fighter_opened_support_screen',
    FIGHTER_OPENED_INVITE_FAN: 'fighter_opened_invite_fan',
    IAM_FAN_PRESSED: 'iam_fan_pressed',
    SIGN_IN_AS_FAN_PRESSED: 'sign_in_as_fan_pressed',
    FAN_ONBOARDING_COMPLETED: 'fan_onboarding_completed',
    FAN_OPENED_FIGHTERS_SCREEN: 'fan_opened_fighters_screen',
    FAN_OPENED_FIGHTER_SCREEN: 'fan_opened_fighter_screen',
    FAN_OPENED_VOTING_PAGE: 'fan_opened_voting_page',
    FAN_STARTED_PROPOSE_FIGHT: 'fan_started_propose_fight',
    FAN_PROPOSED_FIGHT: 'fan_proposed_fight',
    FAN_OPENED_POST_COMMENTS: 'fan_opened_post_comments',
    FAN_SENT_POST_COMMENT: 'fan_sent_post_comment',
    FAN_OPENED_SUPPORT_SCREEN: 'fan_opened_support_screen',
    FAN_OPENED_EVENTS_SCREEN: 'fan_opened_events_screen',
    FAN_OPENED_EVENT_SCREEN: 'fan_opened_event_screen',
    FIGHTER_UPLOAD_MEDIA_FROM_GALLERY: 'fighter_upload_media_from_gallery',
    FIGHTER_UPLOAD_PHOTO_FROM_CAMERA: 'fighter_upload_photo_from_camera',
    FIGHTER_UPLOAD_VIDEO_FROM_CAMERA: 'fighter_upload_video_from_camera',
    VIDEO_PLAYBACK_STARTED: 'video_playback_started',
  }

  constructor({ firebaseAnalytics, amplitudeAnalytics, amplitudeApiKey }) {
    this.firebase = firebaseAnalytics;

    amplitudeAnalytics.init(amplitudeApiKey);
    this.amplitude = amplitudeAnalytics;
  }

  async logEvent({ name, data }) {
    try {
      data = _.mapKeys(data, (v, k) => _.snakeCase(k));
      data.app_env = config.APP_ENV;
      data.os = Platform.OS;

      await this.firebase().logEvent(name, data);
      await this.amplitude.logEvent(name, data);
    } catch (err) {
      console.error('Logging analytics event error:', err);
    }
  }
}

export default new AnalyticsService({
  firebaseAnalytics: analytics,
  amplitudeAnalytics: Amplitude.getInstance(),
  amplitudeApiKey: config.AMPLITUDE_API_KEY,
});
