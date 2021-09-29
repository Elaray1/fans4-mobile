import React, { useCallback, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, ActivityIndicator, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';


import colors from 'themes/colors';

import Header from 'components/Header';
import Input from 'components/Input';
import UploadMediaButton from 'components/UploadMediaButton';

import * as postApi from 'resources/post/post.api';
import * as postActions from 'resources/post/post.actions';

import * as userSelectors from 'resources/user/user.selectors';

import * as rootNavigation from 'helpers/rootNavigation';

import analyticsService from 'services/analytics.service';

import styles from './NewPost.styles';

const MAX_TEXT_SIZE = 160;
const TEXT_NUMBER_OF_LINES = 4;

function NewPost() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const userId = useSelector(userSelectors.getUserId);

  const [text, setText] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(null);
  const [uploadingPoster, setUploadingPoster] = useState(null);
  const [loading, setLoading] = useState(null);
  const isSubmitDisabled = loading || (text === '' && !uploadingMedia);

  const onChangeText = useCallback(newText => setText(newText), []);
  const handleMediaUpload = useCallback((media, poster) => {
    setUploadingMedia(media);

    if (setUploadingPoster) {
      setUploadingPoster(poster);
    }
  }, [setUploadingMedia]);

  const onDelete = useCallback(() => {
    setUploadingMedia(null);
    if (setUploadingPoster) {
      setUploadingPoster(null);
    }
  }, []);

  useEffect(() => {
    analyticsService.logEvent({
      name: analyticsService.events.FIGHTER_NEW_POST_ADDING_STARTED,
      data: {
        userId,
      },
    });
  }, [userId]);

  const goToAccount = useCallback(() => {
    setLoading(false);
    setUploadingMedia(null);
    setText('');

    rootNavigation.resetToScreen('AppStack', 'Account');
  }, []);

  const onUploadProgress = useCallback(async ({ id, data, file, progress, status }) => {
    await dispatch(postActions.updateUploadingPostsData({ id, data, file, progress, status }));
  }, [dispatch]);

  const submit = useCallback(async () => {
    setLoading(true);

    try {
      const params = {
        text,
      };

      if (uploadingPoster) {
        const { postId, storageUrl } = await postApi.createVideoPoster({}, {
          name: 'file',
          type: uploadingPoster.mime,
          uri: uploadingPoster.path,
        });

        params.postId = postId;
        params.posterStorageUrl = storageUrl;
      }

      let file = null;

      if (uploadingMedia) {
        params.width = uploadingMedia.width.toString();
        params.height = uploadingMedia.height.toString();

        if (uploadingMedia.mime.includes('video')) {
          params.duration = uploadingMedia.duration.toString();
        }

        file = {
          name: 'file',
          type: uploadingMedia.mime,
          uri: Platform.OS === 'ios' ? uploadingMedia.path : uploadingMedia.path.replace('file://', ''),
        };
      }

      await postApi.createPost(params, file, { onUploadProgress });

      goToAccount();

      analyticsService.logEvent({
        name: analyticsService.events.FIGHTER_ADDED_POST,
        data: {
          userId,
        },
      });
    } catch (error) {
      console.error('Submit post error:', error);
    } finally {
      setLoading(false);
    }
  }, [text, uploadingMedia, goToAccount, userId, uploadingPoster, onUploadProgress]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />

      <Header
        title={t('NewPost.title')}
        leftItemType="backArrow"
        rightItemType="text"
        rightItemText="Submit"
        rightItemDisabled={isSubmitDisabled}
        onLeftItemPress={goToAccount}
        onRightItemPress={submit}
        rightItemStyle={isSubmitDisabled ? styles.disabledSubmitText : null}
      />

      <View style={styles.contentContainer}>
        <ScrollView style={styles.content}>
          <Input
            multiline
            label={t('NewPost.textInputLabel')}
            style={styles.textInput}
            value={text}
            onChange={onChangeText}
            numberOfLines={TEXT_NUMBER_OF_LINES}
            maxLength={MAX_TEXT_SIZE}
          />

          <UploadMediaButton
            label={t('NewPost.uploadMediaButtonLabel')}
            handleMediaUpload={handleMediaUpload}
            onDelete={onDelete}
            mediaType="any"
          />
        </ScrollView>

        {loading && (
          <>
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
            <View style={styles.loaderOverlay} />
          </>
        )}
      </View>

    </SafeAreaView>
  );
}

export default React.memo(NewPost);
