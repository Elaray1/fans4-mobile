import React, { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import Swiper from 'react-native-deck-swiper';

import Header from 'components/Header';

import * as fightApi from 'resources/fight/fight.api';

import VoteYesIcon from 'assets/icons/vote-yes.svg';
import VoteNoIcon from 'assets/icons/vote-no.svg';

import useToast from 'hooks/useToast';
import colors from 'themes/colors';

import FightItem from 'components/FightItem';
import Text from 'components/Text';

import styles from './styles';


const Voter = ({ onFightsToVoteEnded, firstFight }) => {
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const useSwiper = useRef();

  const [loading, setLoading] = useState(true);
  const [fights, setFights] = useState([]);
  const [cardPositionX, setCardPositionX] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    async function init() {
      try {
        if (firstFight) {
          const another = await fightApi.getFightsForVoting();
          setFights([firstFight, ...another.filter(f => f._id !== firstFight._id)]);
        } else {
          const fetchedFights = await fightApi.getFightsForVoting();
          setFights(fetchedFights);
        }
      } catch (error) {
        console.error(error);
        showFailure();
      }
      setLoading(false);
    }

    init();
  }, [showFailure, firstFight]);

  const Loader = () => (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  const renderItem = useCallback((item, index) => {
    return (
      <FightItem
        fight={item}
        inVotingMode
        cardPosition={index === currentCardIndex ? cardPositionX : null}
      />
    );
  }, [cardPositionX, currentCardIndex]);

  const vote = useCallback(async ({ fightId, isYes }) => {
    try {
      await fightApi.vote({ fightId, isYes });

      if (fights.length === 0) {
        onFightsToVoteEnded();
      } else {
        const fetchedFights = fights;
        setFights(fetchedFights);
      }
    } catch (error) {
      console.error(error);
      showFailure();
    }
  }, [fights, onFightsToVoteEnded, showFailure]);

  const onVoteYes = useCallback((index) => {
    setCardPositionX(0);
    setCurrentCardIndex(currentCardIndex + 1);
    return vote({ fightId: fights[(index)]._id, isYes: true });
  },
  [currentCardIndex, fights, vote]);

  const onVoteNo = useCallback((index) => {
    setCardPositionX(0);
    setCurrentCardIndex(currentCardIndex + 1);
    return vote({ fightId: fights[index]._id, isYes: false });
  },
  [currentCardIndex, fights, vote]);

  const onPressYes = useCallback(() => useSwiper.current.swipeRight(), []);
  const onPressNo = useCallback(() => useSwiper.current.swipeLeft(), []);

  const onSwiping = useCallback((x) => {
    setCardPositionX(x);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView>
      <Header
        title={t('Voting.voting')}
      />
      <View style={styles.container}>
        <Text style={styles.text}>
          {t('Voting.wantToSeeThis')}
        </Text>
        <View style={styles.fight}>
          {cardPositionX > 10 && <Text style={[styles.helper, styles.yes, { left: 65 + cardPositionX }]}>YES</Text>}
          <Swiper
            ref={useSwiper}
            keyExtractor={fight => String(fight._id)}
            cards={fights}
            renderCard={renderItem}
            stackSize={5}
            backgroundColor="transparent"
            verticalSwipe={false}
            onSwipedLeft={onVoteNo}
            onSwipedRight={onVoteYes}
            dragEnd={() => setCardPositionX(0)}
            onSwipedAll={onFightsToVoteEnded}
            onSwiping={onSwiping}
          />
          {cardPositionX < -10 && <Text style={[styles.helper, styles.no, { right: 65 - cardPositionX }]}>NO</Text>}
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, cardPositionX < -10 && styles.litedButton]}
            onPress={onPressNo}
          >
            <VoteNoIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, cardPositionX > 10 && styles.litedButton]}
            onPress={onPressYes}
          >
            <VoteYesIcon />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

Voter.propTypes = {
  onFightsToVoteEnded: PropTypes.func.isRequired,
  firstFight: PropTypes.shape(),
};

Voter.defaultProps = {
  firstFight: null,
};

export default React.memo(Voter);
