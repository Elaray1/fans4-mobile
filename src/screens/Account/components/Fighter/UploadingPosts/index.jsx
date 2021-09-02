import React, { useCallback, useMemo, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import Text from 'components/Text';

import * as postSelectors from 'resources/post/post.selectors';

import * as postActions from 'resources/post/post.actions';

import * as postApi from 'resources/post/post.api';

import { UPLOADING_POST_STATUSES } from 'resources/post/post.constants';

import styles from './styles';

function UploadingPosts() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const uploadingPosts = useSelector(postSelectors.getUloadingPosts);

  const [isLoading, setIsLoading] = useState(false);

  const onUploadStarted = useCallback(async () => {
    await dispatch(postActions.removeFailedUploadingPosts());
  }, [dispatch]);

  const onUploadProgress = useCallback(async ({ id, data, file, progress, status }) => {
    await dispatch(postActions.updateUploadingPostsData({ id, data, file, progress, status }));
  }, [dispatch]);

  const onReuploadPost = useCallback(async (item) => {
    setIsLoading(true);
    if (item.length) {
      await Promise.all(item.map(postData => postApi.createPost(postData.data, postData.file,
        { onUploadStarted, onUploadProgress })));
    } else {
      await postApi.createPost(item.data, item.file, { onUploadProgress });
    }
  }, [onUploadProgress, onUploadStarted]);

  const ErrorView = useCallback((uploadingPostData) => {
    return (
      <>
        <View>
          <Text style={styles.loadingPostText}>
            {uploadingPostData.length ? t('Account.postsFailedToUpload') : t('Account.postFailedToUpload')}
          </Text>
          <Text style={[styles.loadingPostText, styles.uploadFailedText]}>{t('Account.pleaseTryAgain')}</Text>
        </View>
        <TouchableOpacity
          style={styles.tryAgain}
          activeOpacity={0.7}
          onPress={() => onReuploadPost(uploadingPostData)}
          disabled={isLoading}
        >
          <Text style={styles.tryAgainText}>{t('Account.tryAgain')}</Text>
        </TouchableOpacity>
      </>
    );
  }, [t, onReuploadPost, isLoading]);

  const UploadingView = useCallback((uploadingPostData) => {
    const progress = uploadingPostData.length
      ? uploadingPostData.reduce((acc, post) => acc + post.progress, 0) / uploadingPostData.length
      : uploadingPostData.progress;

    return (
      <>
        <Text style={styles.loadingPostText}>
          {uploadingPostData.length
            ? `${uploadingPostData.length} ${t('Account.postsAreLoading')}`
            : t('Account.postIsLoading')}
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </>
    );
  }, [t]);

  const viewByStatus = useMemo(() => ({
    [UPLOADING_POST_STATUSES.ERROR]: ErrorView,
    [UPLOADING_POST_STATUSES.UPLOADING]: UploadingView,
  }), [ErrorView, UploadingView]);

  const failedPostsArray = useMemo(() => {
    return uploadingPosts.filter(post => post.status === UPLOADING_POST_STATUSES.ERROR);
  }, [uploadingPosts]);

  const uploadingPostsArray = useMemo(() => {
    return uploadingPosts.filter(post => post.status === UPLOADING_POST_STATUSES.UPLOADING);
  }, [uploadingPosts]);

  const postsArray = useMemo(() => {
    return uploadingPosts.filter((post) => {
      if ((failedPostsArray.length > 1 && post.status === UPLOADING_POST_STATUSES.ERROR)
      || (uploadingPostsArray.length > 1 && post.status === UPLOADING_POST_STATUSES.UPLOADING)) {
        return false;
      }
      return true;
    });
  }, [uploadingPosts, failedPostsArray, uploadingPostsArray]);

  return (
    <>
      {failedPostsArray.length > 1 && (
      <View
        style={[
          styles.loadingPostContainer,
          styles.loadingErrorContainer,
        ]}
      >
        {viewByStatus[UPLOADING_POST_STATUSES.ERROR](failedPostsArray)}
      </View>
      )}
      {uploadingPostsArray.length > 1 && (
      <View
        style={styles.loadingPostContainer}
      >
        {viewByStatus[UPLOADING_POST_STATUSES.UPLOADING](uploadingPostsArray)}
      </View>
      )}
      {postsArray.map((uploadingPostData) => {
        return (
          <View
            style={[
              styles.loadingPostContainer,
              uploadingPostData.status === UPLOADING_POST_STATUSES.ERROR && styles.loadingErrorContainer,
            ]}
            key={uploadingPostData.id}
          >
            {viewByStatus[uploadingPostData.status](uploadingPostData)}
          </View>
        );
      })}
    </>
  );
}

export default React.memo(UploadingPosts);
