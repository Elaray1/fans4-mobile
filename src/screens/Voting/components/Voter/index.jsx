import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';

import * as fightApi from 'resources/fight/fight.api';

import VoteYesIcon from 'assets/icons/vote-yes.svg';
import VoteNoIcon from 'assets/icons/vote-no.svg';

import useToast from 'hooks/useToast';
import colors from 'themes/colors';

import FightItem from 'components/FightItem';
import Text from 'components/Text';

import styles from './styles';


const Voter = ({ onFightsToVoteEnded }) => {
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
        console.error(error);
        showFailure();
      }
      setLoading(false);
    }

    init();
  }, [showFailure]);

  const Loader = () => (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  const vote = useCallback(async ({ fightId, isYes }) => {
    try {
      await fightApi.vote({ fightId, isYes });

      if (fights.length === 0) {
        onFightsToVoteEnded();
      } else {
        const [current, ...another] = fights;
        setFight(current);
        setFights(another);
      }
    } catch (error) {
      console.error(error);
      showFailure();
    }
  }, [fights, onFightsToVoteEnded, showFailure]);

  const onVoteYes = useCallback(() => vote({ fightId: fight._id, isYes: true }), [fight?._id, vote]);
  const onVoteNo = useCallback(() => vote({ fightId: fight._id, isYes: false }), [fight?._id, vote]);

  if (loading) {
    return <Loader />;
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
          onPress={onVoteNo}
        >
          <VoteNoIcon />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={onVoteYes}
        >
          <VoteYesIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

Voter.propTypes = {
  onFightsToVoteEnded: PropTypes.func.isRequired,
};

export default React.memo(Voter);
