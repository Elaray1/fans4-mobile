import React, {
  useMemo, useState, useCallback, useEffect,
} from 'react';
import {
  View, SafeAreaView, FlatList, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import * as fightApi from 'resources/fight/fight.api';
import { FIGHT_STATUSES } from 'resources/fight/fight.constants';

import { ITEM_TYPES } from 'components/Header/Header.constants';

import Header from 'components/Header';
import Toggle from 'components/Toggle';
import Fight from 'components/Fight';
import Text from 'components/Text';

import PlusIcon from 'assets/icons/big-plus';

import useToast from 'hooks/useToast';
import useDidUpdate from 'hooks/useDidUpdate';

import colors from 'themes/colors';

import styles from './styles';

const PER_PAGE_COUNT = 20;

const Voting = () => {
  const { t } = useTranslation();
  const { showFailure } = useToast();

  const [fights, setFights] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleItems = useMemo(() => {
    return [
      {
        id: '1',
        value: t('Voting.all'),
        createdByMe: false,
      },
      {
        id: '2',
        value: t('Voting.yourProposals'),
        createdByMe: true,
      },
    ];
  }, [t]);

  const [selectedToggleItem, setSelectedToggleItem] = useState(toggleItems[0]);

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <View style={styles.illustration} />
      <Text style={styles.titleText}>{ t('Voting.noFights')}</Text>
      <TouchableOpacity style={styles.plusButton}>
        <PlusIcon />
        <Text styles={styles.plusText}>{ t('Voting.propose')}</Text>
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
    } else {
      setIsRefreshing(true);
    }

    if (fetchingPage === 1 || currentFights.length < totalCount) {
      setIsLoading(true);
      try {
        const {
          fights: fetchedFights,
          totalCount: fetchedTotalCount,
        } = await fightApi.getFights({
          page: fetchingPage,
          perPage: PER_PAGE_COUNT,
          statuses: [FIGHT_STATUSES.IN_VOTING],
          createdByMe: selectedToggleItem.createdByMe,
        });
        setPage(fetchingPage + 1);
        setTotalCount(fetchedTotalCount);
        setFights([...currentFights, ...fetchedFights]);
      } catch (error) {
        showFailure(t('Fights.couldntRefreshTheFeedPullToRefresh'));
      }
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [totalCount, page, fights, selectedToggleItem.createdByMe, showFailure, t]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchNewItems({ refresh: true });
    setIsRefreshing(false);
  }, [fetchNewItems]);

  useEffect(() => {
    const fetchFights = async () => {
      await fetchNewItems({ refresh: true });
    };

    fetchFights();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onToggleSelect = useCallback(async (item) => {
    setSelectedToggleItem(item);
  }, []);

  useDidUpdate(async () => {
    await fetchNewItems({ refresh: true });
  }, [selectedToggleItem.createdByMe]);

  const onVote = useCallback((fightId, userId) => {
    setFights((fs) => {
      return fs.map((fight) => {
        if (fight._id !== fightId) return fight;

        const votedUserIds = fight.votedUserIds.includes(userId)
          ? fight.votedUserIds.filter(id => id !== userId)
          : [...fight.votedUserIds, userId];

        return { ...fight, votedUserIds };
      });
    });
  }, []);

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    return (
      <Fight fight={item} onVote={onVote} />
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Header title={t('Voting.voting')} rightItemType={ITEM_TYPES.PLUS_AND_TEXT} rightItemText={t('Voting.propose')} />
      <View style={styles.content}>
        <Toggle items={toggleItems} onSelect={onToggleSelect} selectedItemId={selectedToggleItem.id} />
        {isRefreshing && <Loader />}
        {!isRefreshing && (fights.length ? (
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
        ) : (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
            keyboardShouldPersistTaps="handled"
          >
            <EmptyView />
          </ScrollView>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default React.memo(Voting);
