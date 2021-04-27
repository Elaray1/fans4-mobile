import React, { useCallback, useState, useEffect } from 'react';
import {
  SafeAreaView, View, ScrollView, StatusBar, Image, TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import colors from 'themes/colors';

import SettingsModal from 'components/SettingsModal';
import Header from 'components/Header';
import Text from 'components/Text';
import FighterStatus from 'components/FighterStatus';

import * as postActions from 'resources/post/post.actions';
import * as userSelectors from 'resources/user/user.selectors';

import ArrowUpIcon from 'assets/icons/arrow-up';
import ArrowDownIcon from 'assets/icons/arrow-down';

import styles from './Account.styles';

function Account() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const fullName = useSelector(userSelectors.getUserFullName);
  const nickname = useSelector(userSelectors.getUserNickname);
  const hometown = useSelector(userSelectors.getHometown);
  const avatarUrl = useSelector(userSelectors.getAvatarUrl);
  const biography = useSelector(userSelectors.getUserBiographyAbout);

  const [postsCount, setPostsCount] = useState(0);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isBiographyOpen, setIsBiographyOpen] = useState(!biography);

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

  const onBiographyPress = useCallback(() => {
    setIsBiographyOpen(!isBiographyOpen);
  }, [isBiographyOpen]);

  const onAddBiographyPress = useCallback(() => {
    navigation.navigate('ChangeBiography');
  }, [navigation]);

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
        <View style={[styles.profileBlock, { marginBottom: 20 }]}>
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

        <View style={[styles.profileBlock, { marginBottom: 20 }]}>
          <View style={[styles.profileData, { marginRight: 10 }]}>
            <Text style={styles.profileDataTitle}>{t('Account.posts')}</Text>
            <Text style={styles.profileDataText}>{postsCount}</Text>
          </View>
          <View style={[styles.profileData, { marginLeft: 10 }]}>
            <Text style={styles.profileDataTitle}>{t('Account.followers')}</Text>
            <Text style={styles.profileDataText}>57</Text>
          </View>
        </View>

        <View style={styles.line} />

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.biographyBlock}
          onPress={onBiographyPress}
        >
          <View style={[styles.biographyData, !isBiographyOpen && { paddingBottom: 18 }]}>
            <Text style={styles.blockTitle}>Biography</Text>
            {isBiographyOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </View>

          {isBiographyOpen && Boolean(biography)
          && <Text style={styles.biographyText}>{biography}</Text>}

          {isBiographyOpen && !biography
            && (
            <TouchableOpacity
              style={styles.addBiographyContainter}
              activeOpacity={0.7}
              onPress={onAddBiographyPress}
            >
              <Text style={styles.addBiographyText}>Add biography</Text>
            </TouchableOpacity>
            )
          }
        </TouchableOpacity>

        <View style={[styles.line, { marginBottom: 18 }]} />

      </ScrollView>
    </SafeAreaView>
  );
}

export default React.memo(Account);
