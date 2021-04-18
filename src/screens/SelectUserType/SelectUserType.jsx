import React, { useCallback } from 'react';
import {
  SafeAreaView, View, StatusBar, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import colors from 'themes/colors';

import Logo from 'assets/icons/logo';

import Text from 'components/Text';
import Button from 'components/Button';

import { USER_TYPES } from 'resources/user/user.constants';

import styles from './SelectUserType.styles';

function SelectUserType() {
  const { t } = useTranslation();
  const navigation = useNavigation();


  const onChooseUserType = useCallback(async (userType) => {
    navigation.navigate('SignUp', {
      userType,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>

        <Logo style={styles.logo} />
        <Text style={styles.title}>{t('SelectRole.selectYourRole')}</Text>
        <View>
          <Button
            title={t('SelectRole.ImFighter')}
            onPress={() => onChooseUserType(USER_TYPES.FIGHTER)}
            style={styles.fighterButton}
          />
          <Button
            title={t('SelectRole.ImFollower')}
            onPress={() => onChooseUserType(USER_TYPES.FOLLOWER)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SelectUserType;
