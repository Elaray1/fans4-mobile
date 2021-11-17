import React, {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  View, SafeAreaView, FlatList, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';

import * as userSelectors from 'resources/user/user.selectors';

import * as fightApi from 'resources/fight/fight.api';
import { FIGHT_STATUSES } from 'resources/fight/fight.constants';

import Header from 'components/Header';
import FightItem from 'components/FightItem';
import Text from 'components/Text';

import NoPostsIllustration from 'assets/illustrations/no-events';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import styles from './styles';

const PER_PAGE_COUNT = 20;

const FighterVoting = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showFailure } = useToast();

  const { fight } = route?.params;
  const isVotingCardsIndicator = useSelector(userSelectors.getVotingCardsIndicator);

  const [fights, setFights] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchedFirstTime, setIsFetchedFirstTime] = useState(false);

  const updatedFights = useMemo(() => {
    return fight
      ? [fight, ...fights.filter(f => f._id !== fight._id)]
      : fights;
  }, [fight, fights]);

  useEffect(() => {
    const readVotingCards = async () => {
      if (isVotingCardsIndicator) {
        try {
          await fightApi.readVotingCards();
        } catch (error) {
          console.error(error);
        }
      }
    };

    readVotingCards();
  }, [isVotingCardsIndicator]);

  const navigateToFightersList = useCallback(() => {
    navigation.navigate('Tabs', {
      screen: 'SearchFighters',
    });
  }, [navigation]);

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <NoPostsIllustration style={styles.illustration} />
      <Text style={styles.titleText}>{ t('FighterVoting.noFightsYet')}</Text>
      <Text style={styles.descriptionText}>{ t('FighterVoting.description')}</Text>
      <TouchableOpacity style={styles.plusButton} onPress={navigateToFightersList}>
        <Text style={styles.buttonText}>{ t('FighterVoting.chooseFighter')}</Text>
      </TouchableOpacity>
    </View>
  );

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }
    return <Loader />;
  };


  const fetchNewItems = useCallback(async ({ refresh } = {}) => {
    let fetchingPage = 1;
    let currentFights = [];

    if (!refresh) {
      fetchingPage = page;
      currentFights = fights;
    }

    if (fetchingPage === 1 || currentFights.length < totalCount) {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const {
          fights: fetchedFights,
          totalCount: fetchedTotalCount,
        } = await fightApi.getFights({
          page: fetchingPage,
          perPage: PER_PAGE_COUNT,
          statuses: [FIGHT_STATUSES.IN_VOTING, FIGHT_STATUSES.VOTING_CLOSED],
          hasVotes: true,
        });

        setPage(fetchingPage + 1);
        setTotalCount(fetchedTotalCount);
        setFights([...currentFights, ...fetchedFights]);
      } catch (error) {
        showFailure(t('Fights.couldntRefreshTheFeedPullToRefresh'));
      }

      if (!isFetchedFirstTime) {
        setIsFetchedFirstTime(true);
      }

      if (refresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [totalCount, page, fights, showFailure, t, isFetchedFirstTime]);


  const onRefresh = useCallback(async () => {
    await fetchNewItems({ refresh: true });
  }, [fetchNewItems]);

  useEffect(() => {
    const fetchFights = async () => {
      await fetchNewItems({ refresh: true });
    };

    fetchFights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keyExtractor = useCallback(item => item?._id, []);

  const renderItem = ({ item }) => {
    return (
      <FightItem fight={item} />
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('FighterVoting.voting')}
        leftItemType="backArrow"
      />

      <View style={styles.content}>
        {!isFetchedFirstTime && isRefreshing && <Loader />}

        {!!updatedFights.length && (
        <FlatList
          data={updatedFights}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReachedThreshold={0.3}
          onEndReached={fetchNewItems}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
        />
        )}

        {isFetchedFirstTime && !updatedFights.length && (
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          keyboardShouldPersistTaps="handled"
        >
          <EmptyView />
        </ScrollView>
        )}
      </View>

    </SafeAreaView>
  );
};

FighterVoting.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      fight: PropTypes.shape(),
    }),
  }).isRequired,
};

export default React.memo(FighterVoting);
