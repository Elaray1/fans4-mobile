import _ from 'lodash';

export default (oldSupportedFighter, newSupportedFighters) => {
  let oldOnes = oldSupportedFighter || [];
  let newOnes = newSupportedFighters || [];

  if (oldOnes.length !== newOnes.length) {
    return true;
  }

  oldOnes = _.sortBy(oldOnes, '_id');
  newOnes = _.sortBy(newOnes, '_id');

  return oldOnes.some((f, i) => {
    return f._id !== newOnes[i]._id
      || f.renewalDate !== newOnes[i].renewalDate
      || f.gracePeriodEndDate !== newOnes[i].gracePeriodEndDate
      || f.fullName !== newOnes[i].fullName
      || f.avatarUrl !== newOnes[i].avatarUrl
      || f.autorenewal !== newOnes[i].autorenewal;
  });
};
