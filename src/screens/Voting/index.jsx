import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import * as userSelectors from 'resources/user/user.selectors';

import * as fightApi from 'resources/fight/fight.api';

import useToast from 'hooks/useToast';

import { USER_TYPES } from 'resources/user/user.constants';

import Voter from './components/Voter';
import Results from './components/Results';

const PAGE_MODES = {
  RESULTS: 'results',
  VOTER: 'voter',
};

function Voting({ route }) {
  const { showFailure } = useToast();

  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(PAGE_MODES.RESULTS);

  const userType = useSelector(userSelectors.getUserType);

  const fight = route?.params?.fight;

  useEffect(() => {
    async function init() {
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
        return;
      }

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
  }, [showFailure, fight, userType]);

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
        firstFight={fight}
      />
    );
  }

  if (mode === PAGE_MODES.RESULTS) {
    return <Results firstFight={fight} />;
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
