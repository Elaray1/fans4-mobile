import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import _includes from 'lodash/includes';

import colors from 'themes/colors';

import Header from 'components/Header';
import Input from 'components/Input';
import UploadMediaButton from 'components/UploadMediaButton';

import * as postApi from 'resources/post/post.api';

import styles from './NewPost.styles';

const MAX_TEXT_SIZE = 160;
const TEXT_NUMBER_OF_LINES = 4;

function NewPost() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(null);

  const onChangeText = useCallback(newText => setText(newText), []);
  const handleMediaUpload = useCallback((media) => {
    setUploadingMedia(media);
  }, [setUploadingMedia]);

  const goToAccount = useCallback(() => {
    setUploadingMedia(null);
    setText('');

    navigation.reset({ routes: [{ name: 'AppStack', params: { screen: 'Account' } }] });
  }, [navigation]);

  const submit = useCallback(async () => {
    const params = { text };
    if (uploadingMedia) {
      const [fileType] = uploadingMedia.mime.split('/');
      if (_includes(['video', 'image'], fileType)) {
        params.width = uploadingMedia.width;
        params.height = uploadingMedia.height;
      }
    }

    try {
      await postApi.createPost(params, uploadingMedia && {
        name: 'file',
        type: uploadingMedia.mime,
        uri: uploadingMedia.path,
      });

      goToAccount();
    } catch (error) {
      console.error('Submit post error:', error);
    }
  }, [text, uploadingMedia, goToAccount]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />

      <Header
        title={t('NewPost.title')}
        leftItemType="backArrow"
        rightItemType="text"
        rightItemText="Submit"
        rightItemDisabled={text === '' && !uploadingMedia}
        onLeftItemPress={goToAccount}
        onRightItemPress={submit}
        rightItemStyle={(text === '' && !uploadingMedia) ? styles.disabledSubmitText : null}
      />

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
    </SafeAreaView>
  );
}

export default React.memo(NewPost);
