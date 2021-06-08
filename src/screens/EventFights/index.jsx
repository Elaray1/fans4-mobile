import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView, View, FlatList, ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import * as fightApi from 'resources/fight/fight.api';

import Header from 'components/Header';
import Fight from 'components/Fight';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import { FIGHT_STATUSES } from 'resources/fight/fight.constants';
import { FIGHT_VIEW_TYPE } from 'components/Fight/constants';


import styles from './styles';

const PER_PAGE_COUNT = 10;

function EventFights({ route }) {
  const { t } = useTranslation();
  const { showFailure } = useToast();

  const {
    title,
    eventId,
  } = route?.params;

  const [fights, setFights] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNewItems = useCallback(async ({ refresh } = {}) => {
    let fetchingPage = 1;
    let currentFights = [];

    if (!refresh) {
      fetchingPage = page;
      currentFights = fights;
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
          eventId,
        });
        setPage(fetchingPage + 1);
        setTotalCount(fetchedTotalCount);
        setFights([...currentFights, ...fetchedFights]);
      } catch (error) {
        showFailure(t('EventFights.couldntLoadTheFightsPullToRefresh'));
      }
      setIsLoading(false);
    }
  }, [fights, page, totalCount, showFailure, t, eventId]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchNewItems({ refresh: true });
    setIsRefreshing(false);
  }, [fetchNewItems]);

  useEffect(() => {
    const fetchFights = async () => {
      await fetchNewItems();
    };

    fetchFights();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    return (
      <Fight
        fight={item}
        status={item.status === FIGHT_STATUSES.PAST ? FIGHT_VIEW_TYPE.EVENT_PAST : FIGHT_VIEW_TYPE.EVENT_UPCOMING}
      />
    );
  };

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }
    return <Loader />;
  };
  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={title}
        leftItemType="backArrow"
      />
      <View style={styles.content}>
        {isLoading ? <Loader /> : (Boolean(fights.length) && (
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
        ))}
      </View>
    </SafeAreaView>
  );
}

EventFights.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      title: PropTypes.string.isRequired,
      eventId: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default React.memo(EventFights);
