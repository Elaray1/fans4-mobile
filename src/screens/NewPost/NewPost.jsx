import React, { useCallback, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';


import colors from 'themes/colors';

import Header from 'components/Header';
import Input from 'components/Input';
import UploadMediaButton from 'components/UploadMediaButton';

import * as postApi from 'resources/post/post.api';
import * as userSelectors from 'resources/user/user.selectors';

import * as rootNavigation from 'helpers/rootNavigation';

import analyticsService from 'services/analytics.service';

import styles from './NewPost.styles';

const MAX_TEXT_SIZE = 160;
const TEXT_NUMBER_OF_LINES = 4;

function NewPost() {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(null);
  const [loading, setLoading] = useState(null);
  const isSubmitDisabled = loading || (text === '' && !uploadingMedia);

  const onChangeText = useCallback(newText => setText(newText), []);
  const handleMediaUpload = useCallback(media => setUploadingMedia(media), [setUploadingMedia]);

  const userId = useSelector(userSelectors.getUserId);

  useEffect(() => {
    analyticsService.logEvent({
      name: analyticsService.events.FIGHTER_NEW_POST_ADDING_STARTED,
      data: {
        userId,
      },
    });
  }, [userId]);

  const goToAccount = useCallback(() => {
    setUploadingMedia(null);
    setText('');

    rootNavigation.resetToScreen('AppStack', 'Account');
  }, []);

  const submit = useCallback(async () => {
    const params = { text };
    if (uploadingMedia) {
      params.width = uploadingMedia.width;
      params.height = uploadingMedia.height;
    }

    setLoading(true);

    try {
      await postApi.createPost(params, uploadingMedia && {
        name: 'file',
        type: uploadingMedia.mime,
        uri: uploadingMedia.path,
      });

      setLoading(false);
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
  }, [text, uploadingMedia, goToAccount, userId]);

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
            style={styles.UploadMediaButton}
            handleMediaUpload={handleMediaUpload}
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
