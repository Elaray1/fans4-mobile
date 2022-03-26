import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, View, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import * as userSelectors from 'resources/user/user.selectors';

import * as fightApi from 'resources/fight/fight.api';

import useToast from 'hooks/useToast';

import { USER_TYPES } from 'resources/user/user.constants';
import colors from 'themes/colors';
import Header from 'components/Header';

import Voter from './components/Voter';
import Results from './components/Results';

import styles from './styles';

const PAGE_MODES = {
  RESULTS: 'results',
  VOTER: 'voter',
};

function Voting({ route }) {
  const { showFailure } = useToast();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState(PAGE_MODES.RESULTS);

  const userType = useSelector(userSelectors.getUserType);

  const fight = route?.params?.fight;

  const fetchFightsForVoting = useCallback(async ({ refreshing } = {}) => {
    if (!refreshing) {
      setLoading(true);
    }

    if (fight) {
      let pageMode = userType === USER_TYPES.FIGHTER ? PAGE_MODES.RESULTS : PAGE_MODES.VOTER;

      if (pageMode === PAGE_MODES.VOTER) {
        try {
          const fights = await fightApi.getFightsForVoting();
          if (!fights.length) {
            pageMode = PAGE_MODES.RESULTS;
          }
        } catch (error) {
          console.error(error);
          showFailure();
        }
      }

      setMode(pageMode);
      setLoading(false);
      return pageMode;
    }

    try {
      const fights = await fightApi.getFightsForVoting();
      if (fights.length > 0) {
        setMode(PAGE_MODES.VOTER);
        setLoading(false);

        return PAGE_MODES.VOTER;
      }

      setLoading(false);
      return PAGE_MODES.RESULTS;
    } catch (error) {
      console.error(error);
      showFailure();
      setLoading(false);
    }
  }, [showFailure, fight, userType]);

  useEffect(() => {
    async function init() {
      await fetchFightsForVoting();
    }

    init();
  }, []);

  const refresh = useCallback(() => {
    return fetchFightsForVoting({ refreshing: true });
  }, [fetchFightsForVoting]);

  const Loader = () => (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  const onVotingEnd = useCallback(() => {
    setMode(PAGE_MODES.RESULTS);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <Header title={t('Voting.voting')} />
        <Loader />
      </SafeAreaView>
    );
  }

  if (mode === PAGE_MODES.VOTER) {
    return (
      <Voter
        onFightsToVoteEnded={onVotingEnd}
        firstFight={fight}
      />
    );
  }

  if (mode === PAGE_MODES.RESULTS) {
    return <Results onPullToRefresh={refresh} />;
  }
}

Voting.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      fight: PropTypes.shape(),
    }),
  }),
};

export default React.memo(Voting);
