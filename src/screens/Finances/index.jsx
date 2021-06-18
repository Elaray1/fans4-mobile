import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView, ScrollView, View, TouchableOpacity, ActivityIndicator, Linking,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import * as userSelectors from 'resources/user/user.selectors';

import * as accountApi from 'resources/account/account.api';

import PlusIcon from 'assets/icons/plus.svg';

import Text from 'components/Text';
import Header from 'components/Header';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import styles from './styles';

function Finances() {
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const navigation = useNavigation();

  const isUserAuthenticated = useSelector(userSelectors.getAuthenticated);

  const [account, setAccount] = useState(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const getUserBankAccount = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const { account: fetchedAccount } = await accountApi.getUserAccount();
      setAccount(fetchedAccount);
    } catch (error) {
      showFailure();
    }
    setIsRefreshing(false);
  }, [showFailure]);

  const createUserAccount = useCallback(async () => {
    try {
      const {
        accountLink: fetchedAccountLink,
      } = await accountApi.createUserAccount();
      Linking.openURL(fetchedAccountLink);
    } catch (error) {
      showFailure();
    }
  }, [showFailure]);

  const onGoBack = useCallback(() => {
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
  }, [navigation]);

  useEffect(() => {
    if (isUserAuthenticated) {
      getUserBankAccount();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserAuthenticated]);

  const NoBackAccountEmptyView = () => (
    <View style={styles.emptyView}>
      <View style={styles.emptyViewImage} />
      <Text style={styles.title}>{t('Finances.finances')}</Text>
      <Text style={styles.secondaryText}>
        {t('Finances.incomeWillBePaidToThisBankAccountMonthlyYouCanTrackAllFinanceInformationInThisSection')}
      </Text>
    </View>
  );

  const BankAccount = () => (account
    ? null
    : (
      <TouchableOpacity
        onPress={createUserAccount}
        activeOpacity={0.7}
        style={styles.addBankAccount}
      >
        <PlusIcon style={styles.plus} />
        <Text style={styles.title}>{t('Finances.addBankAccount')}</Text>
      </TouchableOpacity>
    ));

  const Loader = () => <View><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('Finances.finances')}
        leftItemType="backArrow"
        onLeftItemPress={onGoBack}
      />
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {isRefreshing
            ? <Loader />
            : (
              <>
                <BankAccount />
                <NoBackAccountEmptyView />
              </>
            )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default React.memo(Finances);
