import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

import * as fightApi from 'resources/fight/fight.api';

import VoteYesIcon from 'assets/icons/vote-yes.svg';
import VoteNoIcon from 'assets/icons/vote-no.svg';

import useToast from 'hooks/useToast';

import FightItem from 'components/FightItem';
import Text from 'components/Text';

import styles from './styles';


const Voter = ({ onEnd }) => {
  const { t } = useTranslation();
  const { showFailure } = useToast();

  const [loading, setLoading] = useState(true);

  const [fights, setFights] = useState([]);
  const [fight, setFight] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const [current, ...another] = await fightApi.getFightsForVoting();
        setFight(current);
        setFights(another);
      } catch (error) {
        showFailure();
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [showFailure]);

  const vote = useCallback(async ({ fightId, isYes }) => {
    try {
      await fightApi.vote({ fightId, isYes });

      if (fights.length === 0) {
        onEnd();
      } else {
        const [current, ...another] = fights;
        setFight(current);
        setFights(another);
      }
    } catch (error) {
      showFailure();
    }
  }, [fights, onEnd, showFailure]);

  if (loading) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>
        {t('Voting.wantToSeeThis')}
      </Text>
      <View style={styles.fight}>
        <FightItem fight={fight} inVotingMode />
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => vote({ fightId: fight._id, isYes: false })}
        >
          <VoteNoIcon />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => vote({ fightId: fight._id, isYes: true })}
        >
          <VoteYesIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

Voter.propTypes = {
  onEnd: PropTypes.func.isRequired,
};

export default React.memo(Voter);
