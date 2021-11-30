import moment from 'moment';

class IsSubscribedService {
  isSubscribed({ subscriptionToFighter }) {
    const isRenewalDatePassed = moment(subscriptionToFighter.renewalDate).isBefore(moment());
    const isGracePeriodEndDatePassed = moment(subscriptionToFighter.gracePeriodEndDate).isBefore(moment());

    return !isRenewalDatePassed || (subscriptionToFighter.autorenewal && !isGracePeriodEndDatePassed);
  }

  isSubscriptionWillBeStopped({ subscriptionToFighter }) {
    return subscriptionToFighter
    && !subscriptionToFighter.autorenewal
    && moment(subscriptionToFighter.renewalDate).isAfter(moment());
  }
}

export default new IsSubscribedService();
