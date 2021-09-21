import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  SafeAreaView, View, FlatList, ActivityIndicator, ScrollView, RefreshControl, Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import * as activityApi from 'resources/activity/activity.api';

import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';

import ArrowDownIcon from 'assets/icons/arrow-down.svg';
import NoAcitivtiesIllustration from 'assets/illustrations/no-events.svg';

import Header from 'components/Header';
import Text from 'components/Text';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import { ACTIVITY_TYPES } from 'resources/activity/activity.constants';

import ActivityItem from './components/ActivityItem';
import FiltersModal from './components/FiltersModal';

import styles from './styles';

const PER_PAGE_COUNT = 20;

function Activity() {
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const isUnreadActivities = useSelector(userSelectors.getUserActivityIndicator);

  const [activities, setActivities] = useState({
    today: [],
    yesterday: [],
    thisWeek: [],
    thisMonth: [],
  });

  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isFiltersOpened, setIsFiltersOpened] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(Object.values(ACTIVITY_TYPES));

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNewItems = useCallback(async ({ refresh } = {}) => {
    let fetchingPage = 1;
    let currentActivities = {
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
    };

    if (!refresh) {
      fetchingPage = page;
      currentActivities = activities;
    }

    if (fetchingPage === 1
      || (currentActivities.today.length + currentActivities.yesterday.length
        + currentActivities.thisWeek.length + currentActivities.thisMonth.length) < totalCount) {
      setIsLoading(true);

      try {
        const {
          activities: fetchedActivities,
          totalCount: fetchedTotalCount,
        } = await activityApi.getUserActivities({
          page: fetchingPage,
          perPage: PER_PAGE_COUNT,
        });

        setPage(fetchingPage + 1);
        setTotalCount(fetchedTotalCount);
        setActivities({
          today: [...currentActivities.today, ...fetchedActivities.today],
          yesterday: [...currentActivities.yesterday, ...fetchedActivities.yesterday],
          thisWeek: [...currentActivities.thisWeek, ...fetchedActivities.thisWeek],
          thisMonth: [...currentActivities.thisMonth, ...fetchedActivities.thisMonth],
        });
      } catch (error) {
        showFailure(t('Activity.couldntRefreshTheFeedPullToRefresh'));
      }

      setIsLoading(false);
    }
  }, [activities, page, totalCount, showFailure, t]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchNewItems({ refresh: true });
    setIsRefreshing(false);
  }, [fetchNewItems]);

  const onPressActivivtyFilters = useCallback(() => {
    setIsFiltersOpened(!isFiltersOpened);
  }, [isFiltersOpened]);

  const onCloseFiltersModal = useCallback((newSelectedFilters) => {
    setSelectedFilters(newSelectedFilters);
    setIsFiltersOpened(false);
  }, []);

  useEffect(() => {
    const readActivities = async () => {
      const user = await activityApi.readActivities();

      dispatch(userActions.setUserData(user));
    };

    if (isUnreadActivities && isFocused) {
      readActivities();
    }
  }, [dispatch, isUnreadActivities, isFocused]);

  useEffect(() => {
    const fetchActivities = async () => {
      await fetchNewItems();
    };

    fetchActivities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.activity} key={item._id}>
        <ActivityItem
          createdOn={item.createdOn}
          type={item.type}
          data={item.data}
          title={item.title}
          showTime={item.showTime}
          isLast={item.isLast}
        />
      </View>
    );
  };

  const activitiesArray = useMemo(() => {
    const todayActivities = activities.today
      .map((item, index) => {
        item.showTime = true;
        if (index === 0) {
          return { ...item, title: t('Activity.today') };
        }
        if (index === activities.today.length - 1) {
          return { ...item, isLast: true };
        }
        return item;
      });
    const yesterdayActivities = activities.yesterday
      .map((item, index) => {
        if (index === 0) {
          return { ...item, title: t('Activity.yesterday') };
        }
        if (index === activities.yesterday.length - 1) {
          return { ...item, isLast: true };
        }
        return item;
      });
    const thisWeekActivities = activities.thisWeek
      .map((item, index) => {
        if (index === 0) {
          return { ...item, title: t('Activity.thisWeek') };
        }
        if (index === activities.thisWeek.length - 1) {
          return { ...item, isLast: true };
        }
        return item;
      });
    const thisMonthActivities = activities.thisMonth
      .map((item, index) => {
        if (index === 0) {
          return { ...item, title: t('Activity.thisMonth') };
        }
        if (index === activities.thisMonth.length - 1) {
          return { ...item, isLast: true };
        }
        return item;
      });

    return [...todayActivities, ...yesterdayActivities, ...thisWeekActivities, ...thisMonthActivities];
  }, [activities.today, activities.yesterday, activities.thisWeek, activities.thisMonth, t]);

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }
    return <Loader />;
  };

  const NoActivities = () => (
    <View style={styles.noActivities}>
      <NoAcitivtiesIllustration style={styles.illustration} />
      <Text style={styles.titleText}>{t('Activity.noActivityHereYet')}</Text>
      <Text style={styles.text}>{t('Activity.createYourFirstPostToSeeCommentsFromYourFans')}</Text>
    </View>
  );

  const EmptyView = () => {
    return (
      !isLoading ? <NoActivities /> : <Loader />
    );
  };

  const filteredActivitiesArray = useMemo(() => activitiesArray
    .filter(activity => selectedFilters.includes(activity.type)), [activitiesArray, selectedFilters]);

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('Activity.activity')}
        titleIcon={<ArrowDownIcon style={styles.headerIcon} />}
        onTitlePress={onPressActivivtyFilters}
      />
      {isFiltersOpened
      && (
      <FiltersModal
        visible
        onClose={onCloseFiltersModal}
        selectedFilters={selectedFilters}
      />
      )}
      <View style={styles.content}>
        {isRefreshing && <Loader />}

        {!isRefreshing && (filteredActivitiesArray.length ? (
          <FlatList
            data={filteredActivitiesArray}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onEndReachedThreshold={0.3}
            onEndReached={fetchNewItems}
            style={styles.fightersList}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
          />
        ) : (
          <ScrollView
            contentContainerStyle={styles.emptyScroll}
            refreshControl={<RefreshControl refreshing={Platform.OS === 'ios' && isRefreshing} onRefresh={onRefresh} />}
            keyboardShouldPersistTaps="handled"
          >
            <EmptyView />
          </ScrollView>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default React.memo(Activity);
