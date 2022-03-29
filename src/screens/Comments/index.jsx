import React, {
  useState, useCallback, useEffect, useRef, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView, View, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import * as userSelectors from 'resources/user/user.selectors';
import * as commentApi from 'resources/comment/comment.api';
import * as postApi from 'resources/post/post.api';

import analyticsService from 'services/analytics.service';
import { emitter, EMITTER_EVENTS } from 'services/emitter.service';

import FlatList from 'components/FlatList';
import Header from 'components/Header';
import Post from 'components/Post';
import Text from 'components/Text';
import Input from 'components/Input';
import CustomRefreshControl from 'components/CustomRefreshControl';
import Comment from 'components/Comment';

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

const sleep = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

function Comments({ route }) {
  const inputRef = useRef();
  const commentsListRef = useRef(null);
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const navigation = useNavigation();

  const userType = useSelector(userSelectors.getUserType);

  const {
    postId,
    commentId,
    onUpdateCommentsCount,
    onGoBack,
  } = route?.params;

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [commentValue, setCommentValue] = useState('');
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [replyCommentName, setReplyCommentName] = useState(null);
  const [isPostButtonDisabled, setIsPostButtonDisabled] = useState(false);
  const [targetCommentId, setTargetCommentId] = useState(commentId);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchedFirstTime, setIsFetchedFirstTime] = useState(false);

  const [isInputFocused, setIsInputFocused] = useState(true);
  const [height, setHeight] = useState(null);

  const commentsToRender = useMemo(() => {
    return comments.flatMap((comment) => {
      if (comment.replies?.length > 0) {
        return comment.areRepliesShown
          ? [comment, ...comment.replies]
          : [comment, comment.replies[0]];
      }

      return [comment];
    }, []);
  }, [comments]);

  useEffect(() => {
    analyticsService.logEvent({
      name: analyticsService.events.FAN_OPENED_POST_COMMENTS,
      data: {
        postId,
      },
    });
  }, [postId]);

  const refresh = useCallback(async () => {
    try {
      setIsRefreshing(true);

      const [
        fetchedPost,
        {
          comments: fetchedMyComments,
        },
        {
          comments: fetchedOtherComments,
          totalCount: fetchedTotalCount,
        },
      ] = await Promise.all([
        postApi.getPost(postId),
        commentApi.getPostComments({
          postId,
          createdBy: CREATED_BY.ME,
          sortOption: SORT_OPTIONS.CREATED_ON_DESC,
        }),
        commentApi.getPostComments({
          page: 1,
          perPage: PER_PAGE_COUNT,
          postId,
          createdBy: CREATED_BY.OTHERS,
          sortOption: SORT_OPTIONS.CREATED_ON_ASC,
        }),
        postApi.getPost(postId),
      ]);
      setPost(fetchedPost);
      setComments([...fetchedMyComments, ...fetchedOtherComments]);
      setTotalCount(fetchedTotalCount);

      setIsFetchedFirstTime(true);
      setPage(p => p + 1);
    } catch (error) {
      showFailure(t('Comments.couldntRefreshTheFeedPullToRefresh'));
    } finally {
      setIsRefreshing(false);
    }
  }, [postId, showFailure, t]);

  const loadMoreComments = useCallback(async () => {
    if (comments.length < totalCount) {
      try {
        setIsLoading(true);

        const {
          comments: fetchedComments,
          totalCount: fetchedTotalCount,
        } = await commentApi.getPostComments({
          page,
          perPage: PER_PAGE_COUNT,
          postId,
          createdBy: CREATED_BY.OTHERS,
          sortOption: SORT_OPTIONS.CREATED_ON_ASC,
        });
        setTotalCount(fetchedTotalCount);
        setComments(oldComments => [...oldComments, ...fetchedComments]);
        setPage(p => p + 1);
      } catch (error) {
        showFailure(t('Comments.couldntRefreshTheFeedPullToRefresh'));
      } finally {
        setIsLoading(false);
      }
    }
  }, [totalCount, page, comments, postId, showFailure, t]);

  const showReplies = useCallback((id) => {
    setComments(cs => cs.map(c => (c._id === id ? { ...c, areRepliesShown: true } : c)));
  }, []);

  const focusTargetComment = useCallback(async () => {
    if (!targetCommentId) {
      return;
    }

    const targetIndex = commentsToRender.findIndex(c => c._id === targetCommentId);
    if (targetIndex !== -1) {
      commentsListRef.current.scrollToIndex({
        index: targetIndex,
        viewPosition: 0.5,
        viewOffset: -(height + 30),
      });

      emitter.emit(EMITTER_EVENTS.HIGHLIGHT_COMMENT, { commentId: targetCommentId });

      setTargetCommentId(null);
      return;
    }

    const originalComment = comments.find(c => c.replies?.some(r => r._id === targetCommentId));
    if (originalComment) {
      showReplies(originalComment._id);
      return;
    }

    await loadMoreComments();
  }, [comments, commentsToRender, height, loadMoreComments, showReplies, targetCommentId]);

  const wait = useRef(Promise.resolve());
  useEffect(() => {
    async function init() {
      if (!isFetchedFirstTime) {
        await refresh();
      }
      if (targetCommentId) {
        await focusTargetComment();
      }
    }

    wait.current = wait.current.then(init);
  }, [isFetchedFirstTime, refresh, targetCommentId, focusTargetComment]);

  const onCreateComment = useCallback(async () => {
    setIsPostButtonDisabled(true);
    try {
      const comment = await commentApi.createComment({
        text: commentValue,
        postId,
        targetCommentId: replyCommentId,
      });

      setCommentValue('');
      setReplyCommentId(null);
      setReplyCommentName(null);
      if (comment.originalComment) {
        setComments(oldComments => oldComments.map((c) => {
          return c._id === comment.originalComment._id
            ? { ...c, replies: [...(c.replies || []), comment] }
            : c;
        }));
      } else {
        setComments(oldComments => [comment, ...oldComments]);
      }

      setPost(oldPost => ({
        ...oldPost,
        commentsCount: oldPost.commentsCount + 1,
      }));

      if (onUpdateCommentsCount) {
        onUpdateCommentsCount(postId);
      }

      setTargetCommentId(comment._id);

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
    setIsPostButtonDisabled(false);
  }, [commentValue, postId, replyCommentId, onUpdateCommentsCount, userType, showFailure]);

  const onDeleteComment = useCallback((deletedComment) => {
    setComments(oldComments => oldComments
      .filter(c => c._id !== deletedComment._id)
      .map(c => (
        c._id === deletedComment.originalComment?._id
          ? { ...c, replies: c.replies.filter(r => r._id !== deletedComment._id) }
          : c
      )));
    setPost(oldPost => ({
      ...oldPost,
      commentsCount: oldPost.commentsCount - 1,
    }));
  }, []);

  const onReplyComment = useCallback((comment) => {
    setReplyCommentId(comment._id);
    setReplyCommentName(comment.author.fullName);
    inputRef.current?.focus();
  }, []);

  const onInputFocus = useCallback(() => {
    setIsInputFocused(true);
  }, []);

  const onInputBlur = useCallback(() => {
    setReplyCommentId(null);
    setReplyCommentName(null);
    setIsInputFocused(false);
  }, []);

  const onGoBackPress = useCallback(async () => {
    if (onGoBack) {
      onGoBack();
      return;
    }

    navigation.goBack();
  }, [navigation, onGoBack]);

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

  const commentsMap = useMemo(() => {
    return comments.reduce((map, comment) => {
      map[comment._id] = comment;
      return map;
    }, {});
  }, [comments]);


  const renderItem = ({ item }) => {
    return (
      <Comment
        comment={item}
        originalComment={commentsMap[item.originalComment?._id]}
        onDelete={onDeleteComment}
        onReply={onReplyComment}
        onShowMoreReplies={showReplies}
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

  const RefreshControl = (
    <CustomRefreshControl
      refreshing={isRefreshing}
      onRefresh={refresh}
    />
  );

  const renderHeader = (
    <View
      style={styles.postContainer}
      onLayout={(event) => {
        const { height: x } = event.nativeEvent.layout;
        setHeight(x);
      }}
    >
      {!!post && (
        <Post
          _id={post._id}
          media={post.media}
          text={post.text}
          status={post.status}
          checkedOn={post.checkedOn}
          author={post.author}
          likedUsers={post.likedUsers}
          commentsCount={post.commentsCount}
          createdOn={post.createdOn}
          editedOn={post.editedOn}
          onUpdateCommentsCount={onUpdateCommentsCount}
          onCommentButtonPress={() => inputRef.current?.focus()}
        />
      )}
    </View>
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
            onLeftItemPress={onGoBackPress}
          />

          <View style={styles.content}>

            {!isFetchedFirstTime && isRefreshing && <Loader />}

            {!!comments.length && (
              <FlatList
                ref={commentsListRef}
                data={commentsToRender}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                onEndReachedThreshold={0.3}
                onEndReached={loadMoreComments}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={renderFooter}
                ListHeaderComponent={renderHeader}
                onRefresh={refresh}
                refreshing={isRefreshing}
                refreshControl={RefreshControl}
                onScrollToIndexFailed={(info) => {
                  sleep().then(() => {
                    commentsListRef.current?.scrollToIndex({ index: info.index, viewPosition: 0.5 });
                    const comment = commentsToRender[info.index];
                    if (comment) {
                      emitter.emit(EMITTER_EVENTS.HIGHLIGHT_COMMENT, { commentId: comment._id });
                    }
                  });
                }}
              />
            )}

            {isFetchedFirstTime && !comments.length && (
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={RefreshControl}
                keyboardShouldPersistTaps="handled"
              >
                {renderHeader}
                <EmptyView />
              </ScrollView>
            )}


            {isFetchedFirstTime && (
              <View style={styles.commentContainer}>
                <View style={styles.line} />
                <Text style={styles.secondaryText}>
                  {isInputFocused && (replyCommentName ? `Reply to ${replyCommentName}` : t('Comments.addComment'))}
                  {isInputFocused && commentValue.length > 160 && ` (${t('Comments.max160Characters')})`}
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
                  autoFocus={isInputFocused}
                  ref={inputRef}
                  placeholder={t('Comments.addCommentPlaceholder')}
                  disabled={isPostButtonDisabled}
                  hidePlaceholder={isInputFocused}
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
      onGoBack: PropTypes.func,
      commentId: PropTypes.string,
    }),
  }).isRequired,
};

export default React.memo(Comments);
