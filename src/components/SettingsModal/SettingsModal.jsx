import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import {
  View, TouchableOpacity, Modal, Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import Text from 'components/Text';

import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';
import { USER_TYPES } from 'resources/user/user.constants';

import CrossIcon from 'assets/icons/cross';
import AccountIcon from 'assets/icons/account';
import SecurityIcon from 'assets/icons/security';
import FinancesIcon from 'assets/icons/finances';
import SupportIcon from 'assets/icons/support';
import InviteIcon from 'assets/icons/invite';

import styles from './SettingsModal.styles';

const WIDTH_ICON = 24;

function SettingsModal({
  onClose, visible,
}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isFan = useSelector(userSelectors.getUserType) === USER_TYPES.FAN;

  const userType = useSelector(userSelectors.getUserType);

  const onAccountInfoPress = useCallback(() => {
    onClose();
    navigation.navigate('AccountInformation');
  }, [navigation, onClose]);

  const onSecurityPress = useCallback(() => {
    onClose();
    navigation.navigate('Security');
  }, [navigation, onClose]);

  const onFinancesPress = useCallback(() => {
    console.log('onFinancesPress');
  }, []);

  const onSupportPress = useCallback(() => {
    onClose();
    navigation.navigate('Support');
  }, [navigation, onClose]);

  const onInvitePress = useCallback(() => {
    onClose();
    navigation.navigate('InviteAFan');
  }, [navigation, onClose]);

  const onLogOutPress = useCallback(async () => {
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

    await dispatch(userActions.logout());
  }, [dispatch, navigation, userType]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.background} onPress={onClose} />
      <View style={styles.modal}>
        <View style={styles.header}>
          <View style={{ width: WIDTH_ICON }} />
          <Text style={styles.title}>{t('SettingsModal.settings')}</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={onClose}>
            <CrossIcon />
          </TouchableOpacity>
        </View>
        <View>
          <View>
            <TouchableOpacity
              style={styles.settingsOption}
              onPress={onAccountInfoPress}
              activeOpacity={0.7}
            >
              <AccountIcon style={styles.settingIcon} />
              <View>
                <Text style={styles.settingTitle}>
                  {t('SettingsModal.accountInformation')}
                </Text>
                <Text style={styles.settingText}>
                  {t('SettingsModal.updateYourEmailBiography')}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.line} />
          </View>

          <View>
            <TouchableOpacity
              style={styles.settingsOption}
              onPress={onSecurityPress}
              activeOpacity={0.7}
            >
              <SecurityIcon style={styles.settingIcon} />
              <View>
                <Text style={styles.settingTitle}>
                  {t('SettingsModal.security')}
                </Text>
                <Text style={styles.settingText}>
                  {t('SettingsModal.changePassword')}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.line} />
          </View>

          {!isFan && (
          <View>
            <TouchableOpacity
              style={styles.settingsOption}
              onPress={onFinancesPress}
              activeOpacity={0.7}
            >
              <FinancesIcon style={styles.settingIcon} />
              <View>
                <Text style={styles.settingTitle}>
                  {t('SettingsModal.finances')}
                </Text>
                <Text style={styles.settingText}>
                  {t('SettingsModal.manageBankAccount')}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.line} />
          </View>
          )}

          <View>
            <TouchableOpacity
              style={styles.settingsOption}
              onPress={onSupportPress}
              activeOpacity={0.7}
            >
              <SupportIcon style={styles.settingIcon} />
              <View>
                <Text style={styles.settingTitle}>
                  {t('SettingsModal.support')}
                </Text>
                <Text style={styles.settingText}>
                  {t('SettingsModal.contactAdminFAQ')}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.line} />
          </View>

          {!isFan && (
          <View>
            <TouchableOpacity
              style={styles.settingsOption}
              onPress={onInvitePress}
              activeOpacity={0.7}
            >
              <InviteIcon style={styles.settingIcon} />
              <View>
                <Text style={styles.settingTitle}>
                  {t('SettingsModal.inviteFan')}
                </Text>
                <Text style={styles.settingText}>
                  {t('SettingsModal.scanQRCode')}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.line} />
          </View>
          )}

          <TouchableOpacity style={styles.logOutButton} onPress={onLogOutPress}>
            <Text style={styles.logOutText}>
              {t('SettingsModal.logOut')}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

SettingsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default React.memo(SettingsModal);
