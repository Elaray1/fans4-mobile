import React, {
  useMemo, useState, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  View, SafeAreaView, FlatList, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import * as userSelectors from 'resources/user/user.selectors';

import * as fightApi from 'resources/fight/fight.api';
import { FIGHT_STATUSES, FIGHT_SORT_OPTIONS } from 'resources/fight/fight.constants';

import analyticsService from 'services/analytics.service';

import { ITEM_TYPES } from 'components/Header/Header.constants';

import Header from 'components/Header';
import Toggle from 'components/Toggle';
import FightItem from 'components/FightItem';
import Text from 'components/Text';

import PlusIcon from 'assets/icons/big-plus';
import NoPostsIllustration from 'assets/illustrations/no-events';

import useToast from 'hooks/useToast';
import useDidUpdate from 'hooks/useDidUpdate';

import colors from 'themes/colors';

import styles from './styles';

const PER_PAGE_COUNT = 20;

const Voting = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showFailure, showSuccess } = useToast();
  const userSubscriptions = useSelector(userSelectors.getSupportedFighters);
  const userId = useSelector(userSelectors.getUserId);

  const [fights, setFights] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    analyticsService.logEvent({
      name: analyticsService.events.FAN_OPENED_VOTING_PAGE,
      data: {
        userId,
      },
    });
  }, [userId]);

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

  const navigateToPropose = useCallback(() => {
    if (userSubscriptions.length) {
      navigation.navigate('ProposeAFight');
    } else {
      Alert.alert(
        t('Voting.subscription'),
        t('Voting.youHaveToBeSubscribed'),
        [
          { text: t('Voting.ok') },
        ],
      );
    }
  }, [navigation, t, userSubscriptions?.length]);

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <NoPostsIllustration style={styles.illustration} />
      <Text style={styles.titleText}>{ t('Voting.noFights')}</Text>
      <TouchableOpacity style={styles.plusButton} onPress={navigateToPropose}>
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
          statuses: selectedToggleItem.id === '1' ? [FIGHT_STATUSES.IN_VOTING] : null,
          sortOption: selectedToggleItem.id === '2' ? FIGHT_SORT_OPTIONS.STATUS : null,
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
  }, [totalCount, page, fights, selectedToggleItem.id, selectedToggleItem.createdByMe, showFailure, t]);

  const onToggleSelect = useCallback(async (item) => {
    setSelectedToggleItem(item);
  }, []);

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

  useEffect(() => {
    if (!route.params) {
      return;
    }

    const { status, fight } = route.params;

    if (status === 'created') {
      showSuccess(t('Voting.created'));
      onToggleSelect(toggleItems[1]);
      setFights(fs => [fight, ...fs]);
    }

    if (status === 'voted') {
      showSuccess(t('Voting.voted'));
      onToggleSelect(toggleItems[1]);
    }

    if (status === 'processing') {
      const message = {
        [FIGHT_STATUSES.PENDING]: t('Voting.pending'),
        [FIGHT_STATUSES.VOTING_CLOSED]: t('Voting.votingClosed'),
        [FIGHT_STATUSES.APPROVED]: t('Voting.approved'),
        [FIGHT_STATUSES.UPCOMING]: t('Voting.upcoming'),
      };

      showSuccess(message[fight.status]);
    }
  }, [onToggleSelect, route.params, showSuccess, t, toggleItems]);

  useDidUpdate(async () => {
    await fetchNewItems({ refresh: true });
  }, [selectedToggleItem.createdByMe]);

  const onVote = useCallback((fightId, userIdArg) => {
    const newFights = (fs) => {
      return fs.map((fight) => {
        if (fight._id !== fightId) {
          return fight;
        }

        const votedUserIds = fight.votedUserIds.includes(userIdArg)
          ? fight.votedUserIds.filter(id => id !== userIdArg)
          : [...fight.votedUserIds, userIdArg];

        return { ...fight, votedUserIds };
      });
    };
    setFights(newFights);
  }, []);

  const keyExtractor = useCallback(item => item?._id, []);

  const renderItem = ({ item }) => {
    return (
      <FightItem fight={item} onVote={onVote} />
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('Voting.voting')}
        rightItemType={ITEM_TYPES.PLUS_AND_TEXT}
        rightItemText={t('Voting.propose')}
        onRightItemPress={navigateToPropose}
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
            <EmptyView />
          </ScrollView>
        ))}
      </View>
    </SafeAreaView>
  );
};

Voting.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      status: PropTypes.string,
      fight: PropTypes.shape(),
    }),
  }).isRequired,
};

export default React.memo(Voting);
