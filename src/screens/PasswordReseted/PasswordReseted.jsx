import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import IllustrationScreen from 'components/IllustrationScreen';
import PlaceholderIllustration from 'assets/illustrations/placeholder';
import * as rootNavigation from 'helpers/rootNavigation';
import { USER_TYPES } from 'resources/user/user.constants';

function PasswordReseted({ route }) {
  const { t } = useTranslation();
  const { userType } = route.params;

  const onLinkPress = useCallback(() => {
    // two routes(SelectUserType, SignIn) are inserted here
    // for correct handling back action in SignIn screen
    rootNavigation.reset({
      index: 0,
      routes: [
        {
          name: 'AuthStack',
          state: {
            index: 1,
            routes: [
              {
                name: 'SelectUserType',
              },
              {
                name: 'SignIn',
                params: {
                  userType,
                },
              },
            ],
          },
        },
      ],
    });
  }, [userType]);

  return (
    <IllustrationScreen
      linkText={t('PasswordReseted.linkText')}
      onLinkPress={onLinkPress}
      description={t('PasswordReseted.description')}
      title={t('PasswordReseted.title')}
      illustration={<PlaceholderIllustration />}
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
