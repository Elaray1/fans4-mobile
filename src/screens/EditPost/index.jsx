import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  SafeAreaView, ScrollView, View, ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';

import Header from 'components/Header';
import Input from 'components/Input';
import Video from 'components/Video';
import Text from 'components/Text';
import Modal from 'components/Modal';

import * as postApi from 'resources/post/post.api';

import { MEDIA_TYPES } from 'resources/post/post.constants';

import config from 'resources/config';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import styles from './styles';

function EditPost({ route }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { showSuccess, showFailure } = useToast();

  const [initialPostText, setInitialPostText] = useState('');
  const [postText, setPostText] = useState('');
  const [media, setMedia] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDiscardConfirmationModal, setIsDiscardConfirmationModal] = useState(false);

  const {
    postId,
  } = route?.params;

  const isSaveButtonDisabled = isLoading
  || (!postText)
  || (postText === initialPostText);

  const saveButtonProps = isSaveButtonDisabled
    ? { rightItemStyle: styles.disabledText }
    : {};

  const posterSource = useMemo(() => {
    if (media && media.type === MEDIA_TYPES.VIDEO && media.posterStorageUrl) {
      return {
        uri: `${config.apiUrl}/posts/${postId}/video-poster`,
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          'X-Application-ID': config.applicationId,
        },
      };
    }
    return null;
  }, [postId, media]);

  const source = useMemo(() => {
    if (media) {
      return {
        uri: `${config.apiUrl}/posts/${postId}/media`,
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          'X-Application-ID': config.applicationId,
        },
      };
    }
    return null;
  }, [postId, media]);

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);

      try {
        const fetchedPost = await postApi.getPost(postId);

        setInitialPostText(fetchedPost.text);
        setPostText(fetchedPost.text);
        setMedia(fetchedPost.media);
      } catch (error) {
        console.error(error);
        showFailure();
      }

      setIsLoading(false);
    };

    getPost();
  }, [showFailure, postId]);

  const onPressSave = useCallback(async () => {
    setIsDiscardConfirmationModal(false);
    setIsLoading(true);

    try {
      await postApi.editPost({
        postId,
        text: postText,
      });

      showSuccess(t('ChangePost.updated'));

      navigation.goBack();
    } catch (error) {
      console.error(error);
      showFailure();
    }

    setIsLoading(false);
  }, [postText, navigation, showSuccess, showFailure, postId, t]);

  const onShowDiscardModal = useCallback(() => {
    if (postText !== initialPostText) {
      setIsDiscardConfirmationModal(true);
    } else {
      navigation.goBack();
    }
  }, [postText, initialPostText, navigation]);

  const onDiscardChanges = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const postMediaView = () => {
    if (media?.type === MEDIA_TYPES.IMAGE) {
      return (
        <View style={styles.mediaContainer}>
          <Text style={styles.mediaText}>{t('ChangePost.postMedia')}</Text>
          <FastImage
            style={[styles.postImage, media?.width && { aspectRatio: media?.width / media?.height }]}
            source={source}
          />
        </View>
      );
    }

    if (media?.type === MEDIA_TYPES.VIDEO) {
      return (
        <View style={styles.mediaContainer}>
          <Text style={styles.mediaText}>{t('ChangePost.postMedia')}</Text>
          <Video
            posterSource={posterSource}
            source={source}
            width={media?.width}
            height={media?.height}
            duration={media?.duration}
          />
        </View>
      );
    }

    return (
      <View style={styles.mediaContainer}>
        <Text style={styles.grayText}>{t('ChangePost.noMediaWasAdded')}</Text>
      </View>
    );
  };

  return (
    <>
      {isDiscardConfirmationModal && (
        <Modal
          title={t('ChangePost.unsavedChanges')}
          text={t('ChangePost.youHaveUnsavedChanges')}
          closeButtonText={t('ChangePost.saveChanges')}
          submitButtonText={t('ChangePost.discard')}
          onClose={onPressSave}
          onSubmit={onDiscardChanges}
        />
      )}
      <SafeAreaView style={styles.screen}>
        <Header
          title={t('ChangePost.editPost')}
          leftItemType="backArrow"
          rightItemType="text"
          rightItemText={t('ChangePost.save')}
          onLeftItemPress={onShowDiscardModal}
          onRightItemPress={onPressSave}
          rightItemDisabled={isSaveButtonDisabled}
          {...saveButtonProps}
        />
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <Input
            label={t('ChangePost.postTextMax160Characters')}
            value={postText}
            onChange={setPostText}
            maxLength={160}
            style={styles.input}
            multiline
            numberOfLines={20}
          />
          {postMediaView()}
        </ScrollView>
        {isLoading && (
          <>
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
            <View style={styles.loaderOverlay} />
          </>
        )}
      </SafeAreaView>
    </>
  );
}

EditPost.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      postId: PropTypes.string,
    }),
  }).isRequired,
};

export default React.memo(EditPost);
