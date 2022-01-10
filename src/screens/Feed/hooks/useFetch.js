import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useToast from 'hooks/useToast';


import * as postApi from 'resources/post/post.api';

const PER_PAGE_COUNT = 20;

const useFetch = () => {
  const { t } = useTranslation();
  const { showFailure } = useToast();

  const [posts, setPosts] = useState([]);

  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isFetchedFirstTime, setIsFetchedFirstTime] = useState(false);

  const fetchNewItems = useCallback(async ({ refresh } = {}) => {
    if (isLoading) {
      return;
    }

    const fetchingPage = refresh ? 1 : page + 1;
    const currentPosts = refresh ? [] : posts;

    if (refresh || currentPosts.length < totalCount || !isFetchedFirstTime) {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const {
          posts: fetchedPosts,
          totalCount: fetchedTotalCount,
        } = await postApi.getMyFeedPosts({
          page: fetchingPage,
          perPage: PER_PAGE_COUNT,
        });

        setPage(page + 1);
        setTotalCount(fetchedTotalCount);
        setPosts([...currentPosts, ...fetchedPosts]);
      } catch (error) {
        showFailure(t('Feed.couldntRefreshTheFeedPullToRefresh'));
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
  }, [posts, page, totalCount, showFailure, t, isFetchedFirstTime, isLoading]);

  const onRefresh = useCallback(async () => {
    await fetchNewItems({ refresh: true });
  }, [fetchNewItems]);

  return {
    onRefresh,
    isRefreshing,
    isLoading,
    isFetchedFirstTime,
    fetchNewItems,
    setPosts,
    posts,
  };
};


export default useFetch;
