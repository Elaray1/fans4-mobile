import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import IllustrationScreen from 'components/IllustrationScreen';
import UpdatedIllustration from 'assets/illustrations/verification-successful';
import { USER_TYPES } from 'resources/user/user.constants';
import * as userSelectors from 'resources/user/user.selectors';

function PasswordReseted({ route }) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { userType } = route.params;
  const isUserAuthenticated = useSelector(userSelectors.getAuthenticated);

  const onLinkPress = useCallback(() => {
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
  }, [userType, isUserAuthenticated, navigation]);

  return (
    <IllustrationScreen
      linkText={isUserAuthenticated ? t('PasswordReseted.loggedLink') : t('PasswordReseted.unloggedLink')}
      onLinkPress={onLinkPress}
      description={t('PasswordReseted.description')}
      title={t('PasswordReseted.title')}
      illustration={<UpdatedIllustration />}
    />
  );
}

PasswordReseted.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      userType: PropTypes.oneOf(Object.values(USER_TYPES)).isRequired,
    }),
  }).isRequired,
};

export default React.memo(PasswordReseted);
