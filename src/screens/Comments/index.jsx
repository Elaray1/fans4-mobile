import React, {
  useState, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView, View, FlatList, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation, CommonActions } from '@react-navigation/native';

import * as userSelectors from 'resources/user/user.selectors';
import * as commentApi from 'resources/comment/comment.api';

import analyticsService from 'services/analytics.service';

import Header from 'components/Header';
import Comment from 'components/Comment';
import Text from 'components/Text';
import Input from 'components/Input';
import CustomRefreshControl from 'components/CustomRefreshControl';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import { USER_TYPES } from 'resources/user/user.constants';
import { CREATED_BY, SORT_OPTIONS } from 'resources/comment/comment.constants';

import NoCommentsIllustration from 'assets/illustrations/no-events.svg';

import styles from './styles';

const PER_PAGE_COUNT = 25;
const COMMENT_MAX_LEGHT = 160;

const keyboardAvoidingViewBehavior = Platform.OS === 'ios' ? 'padding' : 'height';
const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 16;

function Comments({ route }) {
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const navigation = useNavigation();

  const userType = useSelector(userSelectors.getUserType);

  const {
    postId,
    onUpdateCommentsCount,
  } = route?.params;

  const [comments, setComments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [commentValue, setCommentValue] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchedFirstTime, setIsFetchedFirstTime] = useState(false);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(true);

  useEffect(() => {
    analyticsService.logEvent({
      name: analyticsService.events.FAN_OPENED_POST_COMMENTS,
      data: {
        postId,
      },
    });
  }, [postId]);

  const fetchNewItems = useCallback(async ({ refresh } = {}) => {
    let fetchingPage = 1;
    let currentComments = [];

    if (!refresh) {
      fetchingPage = page;
      currentComments = comments;
    }

    if (fetchingPage === 1 || currentComments.length < totalCount) {
      try {
        if (refresh) {
          setIsRefreshing(true);
          const [
            {
              comments: fetchedMyComments,
            },
            {
              comments: fetchedOtherComments,
              totalCount: fetchedTotalCount,
            },
          ] = await Promise.all([
            commentApi.getPostComments({
              postId,
              createdBy: CREATED_BY.ME,
              sortOption: SORT_OPTIONS.CREATED_ON_DESC,
            }),
            commentApi.getPostComments({
              page: fetchingPage,
              perPage: PER_PAGE_COUNT,
              postId,
              createdBy: CREATED_BY.OTHERS,
              sortOption: SORT_OPTIONS.CREATED_ON_ASC,
            }),
          ]);
          setTotalCount(fetchedTotalCount);
          setComments([...fetchedMyComments, ...fetchedOtherComments]);
        } else {
          setIsLoading(true);

          const {
            comments: fetchedComments,
            totalCount: fetchedTotalCount,
          } = await commentApi.getPostComments({
            page: fetchingPage,
            perPage: PER_PAGE_COUNT,
            postId,
            createdBy: CREATED_BY.OTHERS,
            sortOption: SORT_OPTIONS.CREATED_ON_ASC,
          });
          setTotalCount(fetchedTotalCount);
          setComments([...currentComments, ...fetchedComments]);
        }
        setPage(fetchingPage + 1);
      } catch (error) {
        showFailure(t('Comments.couldntRefreshTheFeedPullToRefresh'));
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
  }, [comments, page, totalCount, showFailure, t, postId, isFetchedFirstTime]);

  const onRefresh = useCallback(async () => {
    await fetchNewItems({ refresh: true });
  }, [fetchNewItems]);

  const onCreateComment = useCallback(async () => {
    setIsButtonDisabled(true);
    try {
      const comment = await commentApi.createComment({
        text: commentValue,
        postId,
      });

      setCommentValue('');
      setComments([comment, ...comments]);

      if (onUpdateCommentsCount) {
        onUpdateCommentsCount(postId);
      }

      if (userType === USER_TYPES.FAN) {
        analyticsService.logEvent({
          name: analyticsService.events.FAN_SENT_POST_COMMENT,
          data: {
            postId,
          },
        });
      }
    } catch (error) {
      showFailure();
    }
    setIsButtonDisabled(false);
  }, [showFailure, postId, commentValue, comments, onUpdateCommentsCount, userType]);

  useEffect(() => {
    const fetchComments = async () => {
      await fetchNewItems({ refresh: true });
    };

    fetchComments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeleteComment = useCallback((deletedComment) => {
    setComments(comments.filter(comment => comment._id !== deletedComment._id));
  }, [comments]);

  const onInputFocus = useCallback(() => {
    setIsInputFocused(true);
  }, []);

  const onInputBlur = useCallback(() => {
    setIsInputFocused(false);
  }, []);

  const onGoBack = useCallback(async () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Account',
        params: {
          postId: null,
        },
      }),
    );
  }, [navigation]);

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <NoCommentsIllustration style={styles.illustration} />
      <Text style={styles.titleText}>{t('Comments.noCommentsYet')}</Text>
      <Text style={styles.text}>
        {userType === USER_TYPES.FAN
          ? t('Comments.beTheFirstFanToCommentOnThisPost')
          : t('Comments.nothingYet')}
      </Text>
    </View>
  );

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    return (
      <Comment data={item} onDelete={onDeleteComment} />
    );
  };

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }
    return <Loader />;
  };

  const RefreshControl = (
    <CustomRefreshControl
      refreshing={isRefreshing}
      onRefresh={onRefresh}
    />
  );

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={keyboardAvoidingViewBehavior}
        style={styles.keyboardAvoiding}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <View style={styles.keyboardAvoidingChildContainer}>
          <Header
            title={t('Comments.comments')}
            leftItemType="backArrow"
            onLeftItemPress={onGoBack}
          />
          <View style={styles.content}>
            {!isFetchedFirstTime && isRefreshing && <Loader />}

            {!!comments.length && (
              <FlatList
                data={comments}
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

            {isFetchedFirstTime && !comments.length && (
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={RefreshControl}
                keyboardShouldPersistTaps="handled"
              >
                <EmptyView />
              </ScrollView>
            )}


            {isFetchedFirstTime && (
              <View style={styles.commentContainer}>
                <View style={styles.line} />
                <Text style={styles.secondaryText}>
                  {`${t('Comments.addComment')} ${commentValue.length ? `(${t('Comments.max160Characters')})` : ''}`}
                </Text>
                <Input
                  value={commentValue}
                  onChange={setCommentValue}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                  maxLength={COMMENT_MAX_LEGHT}
                  multiline
                  multilineSmall
                  autogrowHeight
                  style={styles.input}
                  multilineStyle={styles.multiline}
                  buttonTitle={t('Comments.post')}
                  onButtonPress={onCreateComment}
                  disabled={isButtonDisabled}
                  autoFocus={isInputFocused}
                />
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

Comments.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      postId: PropTypes.string.isRequired,
      onUpdateCommentsCount: PropTypes.func,
    }),
  }).isRequired,
};

export default React.memo(Comments);
