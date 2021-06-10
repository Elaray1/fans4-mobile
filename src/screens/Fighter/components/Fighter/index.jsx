import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView, View, StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import colors from 'themes/colors';

import Header from 'components/Header';
import Button from 'components/Button';
import Profile from 'components/FighterAccount/Profile';
import Statistic from 'components/FighterAccount/Statistic';
import Biography from 'components/FighterAccount/Biography';
import PersonalInfo from 'components/FighterAccount/PersonalInfo';

import * as userApi from 'resources/user/user.api';

import styles from './styles';

function Fighter({ fighterId }) {
  const { t } = useTranslation();

  const [fighter, setFighter] = useState(null);
  const [postsCount, setPostsCount] = useState(null);
  const [fansCount, setFansCount] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const {
          fighter: fetchedFighter,
          postsCount: fetchedPostsCount,
          fansCount: fetchedFansCount,
        } = await userApi.getOtherFighter({ _id: fighterId });

        setFighter(fetchedFighter);
        setPostsCount(fetchedPostsCount);
        setFansCount(fetchedFansCount);
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [fighterId]);

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

              <PersonalInfo
                age={dayjs().diff(fighter.role.biography.birthdate, 'year')}
                weight={fighter.role.profile.weight}
                height={fighter.role.profile.height}
                reach={fighter.role.profile.reach}
              />

              <View style={styles.line} />
            </View>
          </ScrollView>
        </SafeAreaView>
      ) : <View style={styles.loaderWrapper}><ActivityIndicator color={colors.primary} size="large" /></View>}
    </>
  );
}

Fighter.propTypes = {
  fighterId: PropTypes.string.isRequired,
};

export default React.memo(Fighter);
