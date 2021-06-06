import React, {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import {
  SafeAreaView, View, FlatList, ActivityIndicator, ScrollView, RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import * as fightApi from 'resources/fight/fight.api';

import Header from 'components/Header';
import Text from 'components/Text';
import Toggle from 'components/Toggle';
import Fight from 'components/Fight';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import { FIGHT_STATUSES } from 'resources/fight/fight.constants';

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

  // eslint-disable-next-line react/prop-types
  const EmptyView = ({ title, text }) => (
    <View style={styles.emptyView}>
      <View style={styles.illustration} />
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );

  const toggleItems = useMemo(() => {
    return [
      {
        id: '1',
        value: t('Fights.voting'),
        fightTypes: [FIGHT_STATUSES.IN_VOTING],
        emptyView: {
          title: t('Fights.noFightsYyet'),
          text: t('Fights.onceFightsAreAddedToTheVotingYouWillSeeThemHere'),
        },
      },
      {
        id: '2',
        value: t('Fights.upcoming'),
        fightTypes: [FIGHT_STATUSES.UPCOMING],
        emptyView: {
          title: t('Fights.noFightsYyet'),
          text: t('Fights.onceFightsAreScheduledYouWillSeeThemHere'),
        },
      },
      {
        id: '3',
        value: t('Fights.past'),
        fightTypes: [FIGHT_STATUSES.PAST],
        emptyView: {
          title: t('Fights.noFightsYyet'),
          text: t('Fights.onceYouParticipateInFightsYouWillSeeThemHere'),
        },
      },
    ];
  }, [t]);

  const [selectedToggleItem, setSelectedToggleItem] = useState(toggleItems[0]);

  const fetchNewItems = useCallback(async ({ refresh, fightTypes } = {}) => {
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
          fightTypes: fightTypes || selectedToggleItem.fightTypes,
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
  }, [fights, page, totalCount, showFailure, t, selectedToggleItem.fightTypes]);

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

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    return (
      <Fight fight={item} />
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
    await fetchNewItems({ refresh: true, fightTypes: item.fightTypes });
  }, [fetchNewItems]);

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('Fights.fights')}
      />
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
            <EmptyView title={selectedToggleItem.emptyView.title} text={selectedToggleItem.emptyView.text} />
          </ScrollView>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default React.memo(Fights);
