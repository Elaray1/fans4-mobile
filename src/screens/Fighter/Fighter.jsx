import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView, View, StatusBar, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import colors from 'themes/colors';

import Header from 'components/Header';
import Text from 'components/Text';
import Button from 'components/Button';
import Profile from 'components/FighterAccount/Profile';
import Statistic from 'components/FighterAccount/Statistic';
import Biography from 'components/FighterAccount/Biography';

import * as userApi from 'resources/user/user.api';

import ArrowUpIcon from 'assets/icons/arrow-up';
import ArrowDownIcon from 'assets/icons/arrow-down';

import styles from './Fighter.styles';

function Fighter({ route }) {
  const { t } = useTranslation();

  const {
    _id,
  } = route?.params;

  const [fighter, setFighter] = useState(null);
  const [postsCount, setPostsCount] = useState(null);
  const [fansCount, setFansCount] = useState(null);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const {
          fighter: fetchedFighter,
          postsCount: fetchedPostsCount,
          fansCount: fetchedFansCount,
        } = await userApi.getOtherFighter({ _id });

        setFighter(fetchedFighter);
        setPostsCount(fetchedPostsCount);
        setFansCount(fetchedFansCount);
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [_id]);

  const onPersonalInfoPress = useCallback(() => {
    setIsPersonalInfoOpen(!isPersonalInfoOpen);
  }, [isPersonalInfoOpen]);

  return (
    <>
      {fighter ? (
        <SafeAreaView style={styles.screen}>
          <StatusBar barStyle="light-content" backgroundColor={colors.main} />
          <Header
            title={t('Fighter.fightersProfile')}
            leftItemType="backArrow"
          />
          <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
            <View style={styles.flatListHeader}>
              <Profile
                avatarUrl={fighter.avatarUrl}
                fullName={fighter.fullName}
                nickname={fighter.role.biography.nickname}
                location={`${fighter.role.biography.hometown.cityName}, ${fighter.role.biography.hometown.stateCode}`}
                fightingStatus={fighter.role.fightingStatus}
              />

              <View style={[styles.line, styles.lineIndent]} />

              <View style={styles.postsAndFansBlock}>
                <Button
                  title={t('Fighter.applyForAFight')}
                  style={styles.applyButton}
                />
                <Statistic
                  postsCount={postsCount}
                  fansCount={fansCount}
                />
              </View>

              <View style={styles.line} />

              <Biography
                biography={fighter.role.biography.about}
              />


              <View style={styles.line} />

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.biographyBlock}
                onPress={onPersonalInfoPress}
              >
                <View style={[
                  styles.biographyData,
                  !isPersonalInfoOpen && styles.biographyClosedData,
                ]}
                >
                  <Text style={styles.blockTitle}>{t('Fighter.personalInfo')}</Text>
                  {isPersonalInfoOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </View>

                {isPersonalInfoOpen
            && (
            <View style={styles.personalInfoContainer}>
              <View style={styles.personalInfoData}>
                <Text style={styles.profileDataTitle}>{t('Fighter.age')}</Text>
                <Text style={styles.personalInfoValue}>{dayjs().diff(fighter.role.biography.birthdate, 'year')}</Text>
              </View>

              <View style={styles.personalInfoData}>
                <Text style={styles.profileDataTitle}>{t('Fighter.weight')}</Text>
                <Text style={styles.personalInfoValue}>{fighter.role.profile.weight}</Text>
              </View>

              <View style={styles.personalInfoData}>
                <Text style={styles.profileDataTitle}>{t('Fighter.height')}</Text>
                <Text style={styles.personalInfoValue}>{fighter.role.profile.height}</Text>
              </View>

              <View style={styles.personalInfoData}>
                <Text style={styles.profileDataTitle}>{t('Fighter.reach')}</Text>
                <Text style={styles.personalInfoValue}>{fighter.role.profile.reach}</Text>
              </View>
            </View>
            )}
              </TouchableOpacity>
              <View style={styles.line} />
            </View>
          </ScrollView>
        </SafeAreaView>
      ) : <View style={styles.loaderWrapper}><ActivityIndicator color={colors.primary} size="large" /></View>}
    </>
  );
}

Fighter.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default React.memo(Fighter);
