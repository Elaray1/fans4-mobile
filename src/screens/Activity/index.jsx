import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  SafeAreaView, View, ActivityIndicator, ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation, useScrollToTop } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import * as activityApi from 'resources/activity/activity.api';
import * as activityActions from 'resources/activity/activity.actions';
import * as activitySelectors from 'resources/activity/activity.selectors';

import * as userSelectors from 'resources/user/user.selectors';

import * as messageSelectors from 'resources/message/message.selectors';

import websocketsService from 'services/socket.service';

import ArrowDownIcon from 'assets/icons/arrow-down.svg';
import NoAcitivtiesIllustration from 'assets/illustrations/no-events.svg';
import ChatIcon from 'assets/icons/chat.svg';
import UnreadChatIcon from 'assets/icons/unread-chat.svg';

import FlatList from 'components/FlatList';
import Header from 'components/Header';
import Text from 'components/Text';
import CustomRefreshControl from 'components/CustomRefreshControl';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import { ACTIVITY_TYPES } from 'resources/activity/activity.constants';

import ActivityItem from './components/ActivityItem';
import FiltersModal from './components/FiltersModal';

import styles from './styles';

const PER_PAGE_COUNT = 20;

function Activity() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showFailure } = useToast();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const listRef = useRef(null);
  useScrollToTop(listRef);

  const isUnreadActivities = useSelector(activitySelectors.getIsUnreadActivities);
  const userId = useSelector(userSelectors.getUserId);
  const isUnreadMessages = useSelector(messageSelectors.getIsUnreadMessages);

  const isFans4 = userId === 'fans4';

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
  const [isFetchedFirstTime, setIsFetchedFirstTime] = useState(false);

  useEffect(() => {
    const fetchIsUnreadActivities = async () => {
      try {
        const { isUnreadActivities: fetchedIsUnreadActivities } = await activityApi.getIsUnreadActivities();
        dispatch(activityActions.setIsUnreadActivities(fetchedIsUnreadActivities));
      } catch (err) {
        console.error('fetch activities status error:', err);
        showFailure();
      }
    };

    fetchIsUnreadActivities();
  }, [dispatch, showFailure]);

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
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

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

      if (!isFetchedFirstTime) {
        setIsFetchedFirstTime(true);
      }

      if (refresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [activities, page, totalCount, showFailure, t, isFetchedFirstTime]);

  const onRefresh = useCallback(async () => {
    await fetchNewItems({ refresh: true });
  }, [fetchNewItems]);

  const onPressActivivtyFilters = useCallback(() => {
    setIsFiltersOpened(!isFiltersOpened);
  }, [isFiltersOpened]);

  const onCloseFiltersModal = useCallback(() => {
    setIsFiltersOpened(false);
  }, []);

  const onChatsPress = useCallback(() => {
    navigation.navigate('ChatsList');
  }, [navigation]);

  useEffect(() => {
    const readActivities = async () => {
      try {
        await activityApi.readActivities();

        await dispatch(activityActions.setIsUnreadActivities(false));
      } catch (err) {
        showFailure();
      }
    };

    if (isUnreadActivities && isFocused) {
      readActivities();
    }
  }, [dispatch, isUnreadActivities, isFocused, showFailure]);

  useEffect(() => {
    const fetchActivities = async () => {
      await fetchNewItems({ refresh: true });
    };

    fetchActivities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onActivityCreated = useCallback(async (activity) => {
    setActivities({
      today: [activity, ...activities.today],
      yesterday: activities.yesterday,
      thisWeek: activities.thisWeek,
      thisMonth: activities.thisMonth,
    });

    await dispatch(activityActions.setIsUnreadActivities(true));
  }, [activities.today, activities.yesterday,
    activities.thisWeek, activities.thisMonth, dispatch]);

  useEffect(() => {
    websocketsService.on('activity:created', onActivityCreated);

    return () => {
      websocketsService.off('activity:created', onActivityCreated);
    };
  }, [onActivityCreated]);

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    return (
      <ActivityItem
        key={item._id}
        createdOn={item.createdOn}
        type={item.type}
        data={item.data}
        title={item.title}
        showTime={item.showTime}
        isLast={item.isLast}
        isGroupped={item.isGroupped}
      />
    );
  };

  const createActivityKey = useCallback(({ title, postId, type }) => {
    return title === t('Activity.thisMonth')
      ? `${type}_${postId}_this-month`
      : `${type}_${postId}`;
  }, [t]);

  const grouppedActivities = useMemo(() => {
    const grouppedByTypeAndPostActivitiesObj = [
      { title: t('Activity.today') },
      ...activities.today,
      { title: t('Activity.yesterday') },
      ...activities.yesterday,
      { title: t('Activity.thisWeek') },
      ...activities.thisWeek,
      { title: t('Activity.thisMonth') },
      ...activities.thisMonth,
    ].reduce((acc, activity) => {
      if (activity.title) {
        acc.title = activity.title;
        return acc;
      }

      if (activity.type !== ACTIVITY_TYPES.NEW_POST_LIKE) {
        return acc;
      }

      const newPostLikeActivityKey = createActivityKey({
        title: acc.title,
        postId: activity.data.post._id,
        type: activity.type,
      });

      if (acc.grouppedActivities[newPostLikeActivityKey]) {
        acc.grouppedActivities[newPostLikeActivityKey].activities.push(activity);
      } else {
        acc.grouppedActivities[newPostLikeActivityKey] = {
          title: acc.title,
          key: newPostLikeActivityKey,
          activities: [activity],
        };
      }

      return acc;
    }, { title: null, grouppedActivities: {} }).grouppedActivities;

    return Object.keys(grouppedByTypeAndPostActivitiesObj).map((key) => {
      if (grouppedByTypeAndPostActivitiesObj[key].activities.length < 2) {
        return null;
      }

      return {
        ...grouppedByTypeAndPostActivitiesObj[key],
        key,
        isInserted: false,
      };
    }).filter(el => !!el);
  }, [activities.today, activities.yesterday, activities.thisWeek,
    activities.thisMonth, t, createActivityKey]);

  const formatteActivityData = useCallback(({ index, activity, title, activitiesLength }) => {
    const newPostLikeActivityKey = createActivityKey({
      title,
      postId: activity.data.post?._id,
      type: activity.type,
    });

    const formattedActivity = {
      ...activity,
    };

    const grouppedActivityIndex = grouppedActivities.findIndex(a => a.key === newPostLikeActivityKey);

    if (grouppedActivityIndex !== -1) {
      if (grouppedActivities[grouppedActivityIndex].isInserted) {
        return null;
      }

      formattedActivity.isGroupped = true;

      const [newestActivityInGroup] = grouppedActivities[grouppedActivityIndex].activities;
      formattedActivity._id = newestActivityInGroup._id;
      formattedActivity.createdOn = newestActivityInGroup.createdOn;
      formattedActivity.type = newestActivityInGroup.type;
      formattedActivity.data = grouppedActivities[grouppedActivityIndex].activities.map((el => el.data));

      grouppedActivities[grouppedActivityIndex].isInserted = true;
    }

    if (index === 0) {
      formattedActivity.title = title;
    } else if (index === activitiesLength - 1) {
      formattedActivity.isLast = true;
    }

    return formattedActivity;
  }, [grouppedActivities, createActivityKey]);

  const activitiesArray = useMemo(() => {
    const todayActivities = activities.today
      .map((item, index) => {
        item.showTime = true;

        return formatteActivityData({
          index,
          activity: item,
          title: t('Activity.today'),
          activitiesLength: activities.today.length,
        });
      });

    const yesterdayActivities = activities.yesterday
      .map((item, index) => {
        return formatteActivityData({
          index,
          activity: item,
          title: t('Activity.yesterday'),
          activitiesLength: activities.yesterday.length,
        });
      });

    const thisWeekActivities = activities.thisWeek
      .map((item, index) => {
        return formatteActivityData({
          index,
          activity: item,
          title: t('Activity.thisWeek'),
          activitiesLength: activities.thisWeek.length,
        });
      });

    const thisMonthActivities = activities.thisMonth
      .map((item, index) => {
        return formatteActivityData({
          index,
          activity: item,
          title: t('Activity.thisMonth'),
          activitiesLength: activities.thisMonth.length,
        });
      });

    return [
      ...todayActivities,
      ...yesterdayActivities,
      ...thisWeekActivities,
      ...thisMonthActivities,
    ].filter(el => !!el);
  }, [activities.today, activities.yesterday, activities.thisWeek, activities.thisMonth, t, formatteActivityData]);

  const Loader = () => <View><ActivityIndicator size="large" color={colors.primary} /></View>;

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

  const RefreshControl = (
    <CustomRefreshControl
      refreshing={isRefreshing}
      onRefresh={onRefresh}
    />
  );

  const filteredActivitiesArray = useMemo(() => activitiesArray
    .filter(activity => selectedFilters.includes(activity.type)), [activitiesArray, selectedFilters]);

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('Activity.activity')}
        titleIcon={<ArrowDownIcon style={styles.headerIcon} />}
        onTitlePress={onPressActivivtyFilters}
        rightItemType={isFans4 ? null : 'icon'}
        rightItemIcon={isUnreadMessages ? UnreadChatIcon : ChatIcon}
        onRightItemPress={onChatsPress}
      />

      {isFiltersOpened && (
        <FiltersModal
          visible
          onClose={onCloseFiltersModal}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
      )}

      <View style={styles.content}>
        {!isFetchedFirstTime && isRefreshing && <Loader />}

        {!!filteredActivitiesArray.length && (
          <FlatList
            ref={listRef}
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
            refreshControl={RefreshControl}
          />
        )}

        {isFetchedFirstTime && !filteredActivitiesArray.length && (
          <ScrollView
            contentContainerStyle={styles.emptyScroll}
            refreshControl={RefreshControl}
            keyboardShouldPersistTaps="handled"
          >
            <EmptyView />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

export default React.memo(Activity);
