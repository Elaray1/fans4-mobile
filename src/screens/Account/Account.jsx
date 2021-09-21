import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView, StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import colors from 'themes/colors';

import SettingsModal from 'components/SettingsModal';
import Header from 'components/Header';


import * as userSelectors from 'resources/user/user.selectors';
import { USER_TYPES } from 'resources/user/user.constants';

import FanAccount from './components/Fan';
import FighterAccount from './components/Fighter';

import styles from './Account.styles';

function Account({ route }) {
  const { t } = useTranslation();

  const postId = route?.params?.postId;

  const isFan = useSelector(userSelectors.getUserType) === USER_TYPES.FAN;

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

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

      {isFan ? <FanAccount /> : <FighterAccount {...(postId && { postId })} />}

    </SafeAreaView>
  );
}

Account.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      postId: PropTypes.string,
    }),
  }).isRequired,
};

export default React.memo(Account);
