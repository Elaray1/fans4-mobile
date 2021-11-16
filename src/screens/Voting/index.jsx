import React, { useState, useEffect, useCallback } from 'react';

import * as fightApi from 'resources/fight/fight.api';

import useToast from 'hooks/useToast';

import Voter from './components/Voter';
import Results from './components/Results';

const PAGE_MODES = {
  RESULTS: 'results',
  VOTER: 'voter',
};

function Voting() {
  const { showFailure } = useToast();

  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(PAGE_MODES.RESULTS);

  useEffect(() => {
    async function init() {
      try {
        const fights = await fightApi.getFightsForVoting();
        if (fights.length > 0) {
          setMode(PAGE_MODES.VOTER);
        }
      } catch (error) {
        console.error(error);
        showFailure();
      }
      setLoading(false);
    }

    init();
  }, [showFailure]);

  const onVotingEnd = useCallback(() => {
    setMode(PAGE_MODES.RESULTS);
  }, []);

  if (loading) {
    return null;
  }

  if (mode === PAGE_MODES.VOTER) {
    return (
      <Voter
        onFightsToVoteEnded={onVotingEnd}
      />
    );
  }

  if (mode === PAGE_MODES.RESULTS) {
    return <Results />;
  }
}

export default React.memo(Voting);
