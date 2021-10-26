import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { SafeAreaView, View, FlatList, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';


import * as fightApi from 'resources/fight/fight.api';

import Header from 'components/Header';
import Text from 'components/Text';
import Toggle from 'components/Toggle';
import FightItem from 'components/FightItem';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import NoFightsIllustration from 'assets/illustrations/no-events.svg';

import { FIGHT_STATUSES } from 'resources/fight/fight.constants';
import * as userSelectors from 'resources/user/user.selectors';

import analyticsService from 'services/analytics.service';

import styles from './styles';

const PER_PAGE_COUNT = 20;

function Fights() {
  const { t } = useTranslation();
  const { showFailure } = useToast();

  const [fights, setFights] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchedFirstTime, setIsFetchedFirstTime] = useState(false);

  const userId = useSelector(userSelectors.getUserId);

  useEffect(() => {
    analyticsService.logEvent({
      name: analyticsService.events.FIGHTER_OPENED_FIGHTS_SCREEN,
      data: {
        userId,
      },
    });
  }, [userId]);

  const toggleItems = useMemo(() => {
    return [
      {
        id: '1',
        value: t('Fights.voting'),
        statuses: [FIGHT_STATUSES.IN_VOTING],
        emptyView: {
          title: t('Fights.noFightsYyet'),
          text: t('Fights.onceFightsAreAdded'),
        },
      },
      {
        id: '2',
        value: t('Fights.upcoming'),
        statuses: [FIGHT_STATUSES.UPCOMING],
        emptyView: {
          title: t('Fights.noFightsYyet'),
          text: t('Fights.onceFightsAreScheduledYouWillSeeThemHere'),
        },
      },
      {
        id: '3',
        value: t('Fights.past'),
        statuses: [FIGHT_STATUSES.PAST],
        emptyView: {
          title: t('Fights.noFightsYyet'),
          text: t('Fights.onceYouParticipateInFightsYouWillSeeThemHere'),
        },
      },
    ];
  }, [t]);

  const [selectedToggleItem, setSelectedToggleItem] = useState(toggleItems[0]);

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <NoFightsIllustration style={styles.illustration} />
      <Text style={styles.titleText}>{selectedToggleItem.emptyView.title}</Text>
      <Text style={styles.text}>{selectedToggleItem.emptyView.text}</Text>
    </View>
  );

  const fetchNewItems = useCallback(async ({ refresh, statuses } = {}) => {
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
          statuses: statuses || selectedToggleItem.statuses,
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
  }, [fights, page, totalCount, showFailure, t, selectedToggleItem.statuses, isFetchedFirstTime]);

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

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    return (
      <FightItem fight={item} />
    );
  };

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }
    return <Loader />;
  };

  const onToggleSelect = useCallback(async (item) => {
    setSelectedToggleItem(item);
    await fetchNewItems({ refresh: true, statuses: item.statuses });
  }, [fetchNewItems]);

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('Fights.fights')}
      />
      <View style={styles.content}>
        <Toggle items={toggleItems} onSelect={onToggleSelect} selectedItemId={selectedToggleItem.id} />

        {!isFetchedFirstTime && isRefreshing && <Loader />}

        {!!fights.length && (
          <FlatList
            data={fights}
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

        {isFetchedFirstTime && fights.length <= 1 && (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          keyboardShouldPersistTaps="handled"
        >
          <EmptyView />
        </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

export default React.memo(Fights);
