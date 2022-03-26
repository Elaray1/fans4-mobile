import React, {
  useState, useCallback, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  View, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation, useScrollToTop } from '@react-navigation/native';

import * as userSelectors from 'resources/user/user.selectors';

import * as fightApi from 'resources/fight/fight.api';
import { FIGHT_STATUSES, FIGHT_SORT_OPTIONS } from 'resources/fight/fight.constants';

import analyticsService from 'services/analytics.service';

import { ITEM_TYPES } from 'components/Header/Header.constants';

import FlatList from 'components/FlatList';
import Header from 'components/Header';
import FightItem from 'components/FightItem';
import Text from 'components/Text';
import CustomRefreshControl from 'components/CustomRefreshControl';


import PlusIcon from 'assets/icons/grey-plus';
import NoPostsIllustration from 'assets/illustrations/no-events';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import styles from './styles';

const PER_PAGE_COUNT = 20;

const PAGE_MODES = {
  RESULTS: 'results',
  VOTER: 'voter',
};

const Results = ({ onPullToRefresh }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showFailure } = useToast();

  const userSubscriptions = useSelector(userSelectors.getSupportedFighters);

  const listRef = useRef(null);
  useScrollToTop(listRef);

  const [fights, setFights] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchedFirstTime, setIsFetchedFirstTime] = useState(false);

  useEffect(() => {
    analyticsService.logEvent({
      name: analyticsService.events.FAN_OPENED_VOTING_PAGE,
    });
  }, []);

  const navigateToPropose = useCallback(() => {
    if (userSubscriptions.length) {
      navigation.navigate('ProposeAFight');
    } else {
      const alertOptions = [
        { text: t('BecomeFanAlert.ok') },
      ];

      if (Platform.OS === 'ios') {
        alertOptions.push({
          text: t('BecomeFanAlert.chooseFighter'),
          onPress: () => navigation.navigate('SearchFighters'),
        });
      }

      Alert.alert(
        t('BecomeFanVotingAlert.title'),
        t('BecomeFanVotingAlert.proposeFightDescription'),
        alertOptions,
      );
    }
  }, [navigation, t, userSubscriptions?.length]);

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <NoPostsIllustration style={styles.illustration} />
      <Text style={styles.titleText}>{t('Voting.noFights')}</Text>
      <Text style={styles.descriptionText}>{t('Voting.description')}</Text>
      <TouchableOpacity style={styles.plusButton} onPress={navigateToPropose}>
        <PlusIcon />
        <Text style={styles.buttonText}>{t('Voting.propose')}</Text>
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

        if (isFetchedFirstTime && onPullToRefresh) {
          const pageMode = await onPullToRefresh();

          if (pageMode !== PAGE_MODES.RESULTS) {
            setIsRefreshing(false);
            return;
          }
        }
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
          sortOption: FIGHT_SORT_OPTIONS.STATUS,
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
  }, [totalCount, page, fights, showFailure, t, isFetchedFirstTime, onPullToRefresh]);


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

  const RefreshControl = (
    <CustomRefreshControl
      refreshing={isRefreshing}
      onRefresh={onRefresh}
    />
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('Voting.voting')}
        rightItemType={ITEM_TYPES.PLUS_AND_TEXT}
        rightItemText={t('Voting.propose')}
        onRightItemPress={navigateToPropose}
      />

      <View style={styles.content}>
        {!isFetchedFirstTime && isRefreshing && <Loader />}

        {!!fights.length && (
          <FlatList
            ref={listRef}
            style={styles.fights}
            data={fights}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onEndReachedThreshold={0.3}
            onEndReached={fetchNewItems}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            refreshControl={RefreshControl}
          />
        )}

        {isFetchedFirstTime && !fights.length && (
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={RefreshControl}
            keyboardShouldPersistTaps="handled"
          >
            <EmptyView />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

Results.propTypes = {
  onPullToRefresh: PropTypes.func,
};

Results.defaultProps = {
  onPullToRefresh: null,
};

export default React.memo(Results);
