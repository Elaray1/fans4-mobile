import React, { useState, useEffect, useCallback } from 'react';

import * as fightApi from 'resources/fight/fight.api';

import useToast from 'hooks/useToast';

import Voter from './components/Voter';
import Results from './components/Results';

function Voting() {
  const { showFailure } = useToast();

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('results');

  useEffect(() => {
    async function init() {
      try {
        const fights = await fightApi.getFightsForVoting();
        if (fights.length > 0) setPage('voter');
      } catch (error) {
        showFailure();
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [showFailure]);

  const onVotingEnd = useCallback(() => {
    setPage('results');
  }, []);

  if (loading) {
    return null;
  }

  if (page === 'voter') {
    return (
      <Voter
        onEnd={onVotingEnd}
      />
    );
  }

  if (page === 'results') {
    return <Results />;
  }
}

export default React.memo(Voting);
