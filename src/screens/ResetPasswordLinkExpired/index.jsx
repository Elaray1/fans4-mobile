import React, { useCallback } from 'react';
import { SafeAreaView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Text from 'components/Text';
import Button from 'components/Button';
import CircledCrossBigIcon from 'assets/illustrations/circled-cross-big.svg';
import { USER_TYPES } from 'resources/user/user.constants';
import * as userSelectors from 'resources/user/user.selectors';

import styles from './styles';

const ResetPasswordLinkExpired = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const isUserAuthenticated = useSelector(userSelectors.getAuthenticated);

  const { userType } = route.params;

  const onBack = useCallback(async () => {
    if (!isUserAuthenticated) {
      navigation.reset({
        index: 1,
        routes: [{
          name: 'AuthStack',
          state: {
            routes: [{
              name: 'SelectUserType',
            }],
          },
        }, {
          name: 'AuthStack',
          state: {
            routes: [{
              name: 'SignIn',
              params: {
                userType,
              },
            }],
          },
        }],
      });

      return;
    }

    navigation.reset({
      index: 0,
      routes: [{
        name: 'AppStack',
        state: {
          routes: [{
            name: 'Account',
          }],
        },
      }],
    });
  }, [navigation, userType, isUserAuthenticated]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.contentContainer}>
        <CircledCrossBigIcon />

        <Text style={styles.title}>
          {t('ResetPasswordLinkExpired.title')}
        </Text>

        <Text style={styles.subtitle}>
          {t('ResetPasswordLinkExpired.subtitle')}
        </Text>
      </View>

      <Button
        type="link"
        title={t(`ResetPasswordLinkExpired.${isUserAuthenticated ? 'backToAccountPage' : 'backToLoginPage'}`)}
        onPress={onBack}
        style={styles.backButton}
      />
    </SafeAreaView>
  );
};

ResetPasswordLinkExpired.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      userType: PropTypes.oneOf(Object.values(USER_TYPES)).isRequired,
    }),
  }).isRequired,
};

export default ResetPasswordLinkExpired;
