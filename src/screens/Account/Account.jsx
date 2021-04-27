import React, { useCallback, useState, useEffect } from 'react';
import {
  SafeAreaView, View, ScrollView, StatusBar, Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import colors from 'themes/colors';

import SettingsModal from 'components/SettingsModal';
import Header from 'components/Header';
import Text from 'components/Text';
import FighterStatus from 'components/FighterStatus';

import * as postActions from 'resources/post/post.actions';
import * as userSelectors from 'resources/user/user.selectors';

import styles from './Account.styles';

function Account() {
  const { t } = useTranslation();

  const fullName = useSelector(userSelectors.getUserFullName);
  const nickname = useSelector(userSelectors.getUserNickname);
  const hometown = useSelector(userSelectors.getHometown);
  const avatarUrl = useSelector(userSelectors.getAvatarUrl);

  const [postsCount, setPostsCount] = useState(0);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  useEffect(() => {
    const init = async () => {
      const count = await postActions.getPostsCount();
      setPostsCount(count);
    };

    init();
  }, []);

  const onBurgerPress = useCallback(() => {
    setIsSettingsVisible(true);
  }, []);

  const onSettingsClose = useCallback(() => {
    setIsSettingsVisible(false);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <SettingsModal
        visible={isSettingsVisible}
        onClose={onSettingsClose}
      />
      <Header
        title={t('Account.account')}
        rightItemType="menu"
        onRightItemPress={onBurgerPress}
      />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileBlock}>
          <Image
            style={styles.photoImage}
            source={{ uri: avatarUrl }}
          />
          <View>
            <Text style={styles.fullName}>{fullName}</Text>
            {nickname && (
            <Text style={styles.nickname}>
              “
              {nickname}
              ”
            </Text>
            )}
            <Text style={styles.location}>{hometown}</Text>
            <FighterStatus status="active" />
          </View>
        </View>

        <View style={[styles.line, { marginBottom: 20 }]} />

        <View style={[styles.profileBlock, { alignItems: 'center' }]}>
          <View style={[styles.profileData, { marginRight: 10 }]}>
            <Text style={styles.profileDataTitle}>{t('Account.posts')}</Text>
            <Text style={styles.profileDataText}>{postsCount}</Text>
          </View>
          <View style={[styles.profileData, { marginLeft: 10 }]}>
            <Text style={styles.profileDataTitle}>{t('Account.followers')}</Text>
            <Text style={styles.profileDataText}>57</Text>
          </View>
        </View>

        <View style={[styles.line, { marginBottom: 18 }]} />

      </ScrollView>
    </SafeAreaView>
  );
}

export default React.memo(Account);
