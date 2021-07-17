import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { toLocalDate } from 'helpers/toLocalTime';

import getLocation from '../../getLocation';
import formatDuration from '../../formatDuration';
import { FIGHT_RESULT_LABELS } from '../../constants';

import styles from './styles';

const PastFightInfo = ({ fight }) => {
  const { t } = useTranslation();


  const [firstFighter, secondFighter] = fight.fighters;

  if (fight.results) {
    return (
      <View style={styles.pastContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.text}>
            {fight.event.name} / {toLocalDate(fight.event)}
          </Text>
        </View>
        <View style={styles.resultContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.resultsText}>{FIGHT_RESULT_LABELS[fight.results.winMethodCategory]}</Text>
            <Text style={styles.text}>{t('Fight.round')} {fight.results.roundNumber}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{_.startCase(fight.results.winMethod)}</Text>
            <Text style={styles.text}>{formatDuration(fight.results.duration)}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.location}>
      <Text style={styles.text}>{getLocation(firstFighter.hometown)}</Text>
      <Text style={styles.text}>{getLocation(secondFighter.hometown)}</Text>
    </View>
  );
};

PastFightInfo.propTypes = {
  fight: PropTypes.shape().isRequired,
};

export default React.memo(PastFightInfo);
