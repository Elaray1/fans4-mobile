import moment from 'moment';

class IsSubscribedService {
  isSubscribed({ subscriptionToFighter }) {
    const isRenewalDatePassed = moment(subscriptionToFighter.renewalDate).isBefore(moment());
    const isGracePeriodEndDatePassed = moment(subscriptionToFighter.gracePeriodEndDate).isBefore(moment());

    return !isRenewalDatePassed || (subscriptionToFighter.autorenewal && !isGracePeriodEndDatePassed);
  }
}

export default new IsSubscribedService();
