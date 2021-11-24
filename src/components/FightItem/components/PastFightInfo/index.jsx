import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import getLocation from '../../getLocation';
import formatDuration from '../../formatDuration';
import { FIGHT_RESULT_LABELS } from '../../constants';

import styles from './styles';

const titleCase = (str) => {
  const splitStr = str.split(' ');
  return splitStr.map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
};

const PastFightInfo = ({ fight }) => {
  const { t } = useTranslation();


  const [firstFighter, secondFighter] = fight.fighters;

  const firstFighterRecord = firstFighter.role.record;
  const secondFighterRecord = secondFighter.role.record;

  if (fight.results) {
    return (
      <View style={styles.pastContainer}>
        <View style={styles.fightInfoContainer}>
          <Text style={[styles.text, styles.recordText]}>
            {`${firstFighterRecord.wins}-${firstFighterRecord.losses}-${firstFighterRecord.draws}`}
          </Text>
          <Text style={styles.text}>
            {titleCase(fight.fightersType)}
          </Text>
          <Text style={[styles.text, styles.recordText]}>
            {`${secondFighterRecord.wins}-${secondFighterRecord.losses}-${secondFighterRecord.draws}`}
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
      <Text style={[styles.text, styles.recordText]}>
        {`${firstFighterRecord.wins}-${firstFighterRecord.losses}-${firstFighterRecord.draws}`}
      </Text>
      <Text style={styles.text}>
        {titleCase(fight.fightersType)}
      </Text>
      <Text style={[styles.text, styles.recordText]}>
        {`${secondFighterRecord.wins}-${secondFighterRecord.losses}-${secondFighterRecord.draws}`}
      </Text>
    </View>
  );
};

PastFightInfo.propTypes = {
  fight: PropTypes.shape().isRequired,
};

export default React.memo(PastFightInfo);
