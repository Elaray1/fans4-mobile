import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import Text from 'components/Text';
import Profile from 'components/FighterAccount/Profile';
import Statistic from 'components/FighterAccount/Statistic';
import Biography from 'components/FighterAccount/Biography';
import PersonalInfo from 'components/FighterAccount/PersonalInfo';

import * as userSelectors from 'resources/user/user.selectors';

import styles from './styles';

function FighterHeader({ postsCount, fansCount, onAddBiographyPress }) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const fullName = useSelector(userSelectors.getUserFullName);
  const nickname = useSelector(userSelectors.getUserNickname);
  const hometown = useSelector(userSelectors.getHometown);
  const fightingStatus = useSelector(userSelectors.getFightingStatus);
  const avatarUrl = useSelector(userSelectors.getAvatarUrl);
  const biography = useSelector(userSelectors.getUserBiographyAbout);
  const age = useSelector(userSelectors.getUserAge);
  const profileInfo = useSelector(userSelectors.getUserProfileInfo);

  const onFansPress = useCallback(() => {
    navigation.navigate('Fans');
  }, [navigation]);

  return (
    <View style={styles.flatListHeader}>

      <Profile
        avatarUrl={avatarUrl}
        fullName={fullName}
        nickname={nickname}
        location={hometown}
        fightingStatus={fightingStatus}
      />

      <View style={styles.line} />

      <Statistic
        postsCount={postsCount}
        fansCount={fansCount}
        onFansPress={onFansPress}
        recordCount={profileInfo?.record}
      />

      <View style={styles.line} />

      <Biography
        biography={biography}
        onAddBiographyPress={onAddBiographyPress}
      />

      <View style={styles.line} />

      <PersonalInfo
        age={age}
        weight={profileInfo?.weight}
        height={profileInfo?.height}
        reach={profileInfo?.reach}
      />

      <View style={styles.line} />

      <Text style={[styles.blockTitle, styles.postsTitle]}>{t('Account.Posts')}</Text>

    </View>
  );
}

FighterHeader.propTypes = {
  postsCount: PropTypes.number,
  fansCount: PropTypes.number,
  onAddBiographyPress: PropTypes.func.isRequired,
};

FighterHeader.defaultProps = {
  postsCount: null,
  fansCount: null,
};

export default React.memo(FighterHeader);
