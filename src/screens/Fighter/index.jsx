import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import * as userSelectors from 'resources/user/user.selectors';
import { USER_TYPES } from 'resources/user/user.constants';

import FighterForFighter from './components/Fighter';
import FighterForFan from './components/Fan';


function Fighter({ route }) {
  const {
    _id,
  } = route?.params;


  const userType = useSelector(userSelectors.getUserType);

  return (
    userType === USER_TYPES.FIGHTER
      ? (
        <FighterForFighter fighterId={_id} />
      )
      : (
        <FighterForFan fighterId={_id} />
      )
  );
}

Fighter.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default React.memo(Fighter);
