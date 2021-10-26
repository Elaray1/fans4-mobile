import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  SafeAreaView, ScrollView, View, TouchableOpacity, ActivityIndicator, AppState, Platform, RefreshControl,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import * as userSelectors from 'resources/user/user.selectors';
import * as accountApi from 'resources/account/account.api';
import * as payoutApi from 'resources/payout/payout.api';

import analyticsService from 'services/analytics.service';
import * as socketsService from 'services/socket.service';

import PlusIcon from 'assets/icons/plus';
import EditIcon from 'assets/icons/pencil';

import Text from 'components/Text';
import Header from 'components/Header';
import Modal from 'components/Modal';
import StripeAccountStatus from 'components/StripeAccountStatus';
import Button from 'components/Button';
import BankAccountModal from 'screens/Finances/components/BankAccountModal';

import useToast from 'hooks/useToast';

import IncomeIllustration from 'assets/illustrations/income.svg';

import { ACCOUNT_STATUSES } from 'resources/account/account.constants';

import colors from 'themes/colors';

import styles from './styles';

function Finances() {
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const isUserAuthenticated = useSelector(userSelectors.getAuthenticated);

  const [account, setAccount] = useState(null);
  const [income, setIncome] = useState(null);
  const [webViewUrl, setWebViewUrl] = useState(null);
  const [isConfirmationModal, setIsConfirmationModal] = useState(false);
  const [isBankAccountModal, setIsBankAccountModal] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isFetchedFirstTime, setIsFetchedFirstTime] = useState(false);

  const userId = useSelector(userSelectors.getUserId);

  const updateBankAccount = useCallback(async () => {
    setIsBankAccountModal(false);
    const { accountLink } = await accountApi.createStripePayoutAccountUpdatingLink();
    setWebViewUrl(accountLink);
  }, []);

  const getUserWithdrawalMethod = useCallback(async ({ isAddedScreen = false } = {}) => {
    setIsRefreshing(true);

    try {
      const { account: fetchedAccount } = await accountApi.getStripePayoutAccount();
      setAccount(fetchedAccount);
      if (isAddedScreen) {
        navigation.reset({
          index: 0,
          routes: [{
            name: 'AppStack',
            state: {
              routes: [{
                name: 'BankAccountAdded',
              }],
            },
          }],
        });
      }
    } catch (err) {
      showFailure();
    }

    setIsRefreshing(false);

    if (!isFetchedFirstTime) {
      setIsFetchedFirstTime(true);
    }
  }, [showFailure, navigation, isFetchedFirstTime]);

  const onRefresh = useCallback(async () => {
    await getUserWithdrawalMethod();
  }, [getUserWithdrawalMethod]);

  useEffect(() => {
    const updateAccount = (updatedAccount) => {
      setAccount(updatedAccount);
    };

    socketsService.on('account:updated', updateAccount);
    return () => socketsService.removeListener('account:updated', updateAccount);
  }, []);

  useEffect(() => {
    const checkAccountOnFocus = async (appState) => {
      if (isFocused && appState === 'active') {
        getUserWithdrawalMethod();
      }
    };

    AppState.addEventListener('change', checkAccountOnFocus);

    return () => {
      AppState.removeEventListener('change', checkAccountOnFocus);
    };
  }, [isFocused, navigation, getUserWithdrawalMethod]);

  useEffect(() => {
    analyticsService.logEvent({
      name: analyticsService.events.FIGHTER_OPENED_FINANCES_SCREEN,
      data: {
        userId,
      },
    });
  }, [userId]);

  const createStripePayoutAccount = useCallback(async () => {
    try {
      const { accountLink: fetchedAccountLink } = await accountApi.createStripePayoutAccount();
      setWebViewUrl(fetchedAccountLink);
    } catch (err) {
      console.error('createStripePayoutAccount err', err);
      showFailure();
    }
  }, [showFailure]);

  const deleteWithdrawalMethod = useCallback(() => {
    setIsBankAccountModal(false);
    setIsConfirmationModal(true);
  }, []);

  const onCloseConfirmationModal = useCallback(() => {
    setIsConfirmationModal(false);
  }, []);

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

  const onDeleteWithdrawalMethodConfirmation = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await accountApi.deleteStripePayoutAccount();
      setAccount(null);
    } catch (err) {
      showFailure();
    }
    onCloseConfirmationModal(false);
    setIsRefreshing(false);
  }, [showFailure, onCloseConfirmationModal]);

  const getUserIncome = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const payouts = await payoutApi.getUserPayouts();

      const fetchedIncome = payouts.map((payout) => {
        const period = moment(payout.typeMetadata.from).format('MMMM YYYY');

        return {
          _id: payout._id,
          period,
          totalAmount: payout.amount.toFixed(2),
        };
      });

      setIncome(fetchedIncome);
    } catch (err) {
      showFailure();
    }

    setIsRefreshing(false);
  }, [showFailure]);

  const onWebViewStateChange = useCallback(async (webViewState) => {
    if (webViewState.url.includes('saving')) {
      setWebViewUrl(null);

      const parsedUrl = new URL(webViewState.url);
      const token = parsedUrl.searchParams.get('token');
      const stripeAccountId = parsedUrl.searchParams.get('stripeAccountId');

      setIsRefreshing(true);

      try {
        await accountApi.saveStripePayoutAccount({ token, userId, stripeAccountId });
      } catch (err) {
        showFailure(err);
      }

      setIsRefreshing(false);

      setWebViewUrl(null);
      getUserWithdrawalMethod({ isAddedScreen: true });
    }

    if (webViewState.url.includes('updating')) {
      setWebViewUrl(null);
      getUserWithdrawalMethod();
    }
  }, [getUserWithdrawalMethod, showFailure, userId]);

  const onChangeBankAccountModalVisibility = useCallback(() => {
    setIsBankAccountModal(!isBankAccountModal);
  }, [isBankAccountModal]);

  useEffect(() => {
    if (isUserAuthenticated) {
      getUserWithdrawalMethod();
    }
  }, [isUserAuthenticated, getUserWithdrawalMethod]);

  useEffect(() => {
    getUserIncome();
  }, [getUserIncome]);

  const emptyViewText = useMemo(() => {
    return account
      ? {
        title: t('Finances.noIncomeYet'),
        text: t('Finances.checkBack'),
      }
      : {
        title: t('Finances.finances'),
        text: t('Finances.incomeWillBePaid'),
      };
  }, [account, t]);

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <IncomeIllustration style={styles.emptyViewImage} />

      <Text style={styles.title}>{emptyViewText.title}</Text>
      <Text style={styles.secondaryText}>
        {emptyViewText.text}
      </Text>
    </View>
  );

  const withdrawalMethod = useMemo(() => {
    const bankAccount = account?.typeMetadata?.bankAccount;

    if (bankAccount) {
      return {
        title: t('Finances.bankAccount'),
        text: `••••••••• ${account.typeMetadata.bankAccount.last4}`,
      };
    }

    return null;
  }, [account?.typeMetadata?.bankAccount, t]);

  const WithdrawalMethod = () => {
    return (
      !isRefreshing && withdrawalMethod
        ? (
          <View>
            {account.status === ACCOUNT_STATUSES.RESTRICTED && (
              <View style={styles.updateContainer}>
                <Text style={styles.updateTitle}>
                  {t('Finances.updateBankAccount')}
                </Text>
                <Text style={styles.updateText}>
                  {t('Finances.toContinueReceivingIncomeUpdateYourBankAccountWithMoreDetails')}
                </Text>
                <Button
                  title={t('Finances.update')}
                  style={styles.updateButton}
                  onPress={updateBankAccount}
                />
              </View>
            )}

            <View style={styles.withdrawalMethod}>
              <View>
                <View style={styles.bankAccountTitle}>
                  <Text style={[styles.title, styles.withdrawalMethodStatus]}>{withdrawalMethod.title}</Text>
                  <StripeAccountStatus status={account.status} />
                </View>
                <Text style={styles.withdrawalMethodNumber}>
                  {withdrawalMethod.text}
                </Text>
              </View>

              <TouchableOpacity onPress={onChangeBankAccountModalVisibility} activeOpacity={0.7}>
                <EditIcon />
              </TouchableOpacity>
            </View>
          </View>

        ) : (
          <View>
            <TouchableOpacity
              onPress={createStripePayoutAccount}
              activeOpacity={0.7}
              style={styles.addWithdrawalMethod}
            >
              <PlusIcon style={styles.plus} />
              <Text style={styles.title}>{t('Finances.addBankAccount')}</Text>
            </TouchableOpacity>

            {/*  Do not replace "!!: because it will cause a bug: */}
            {/*  Text strings must be rendered within <Text> component */}
            {!!income && !!income.length && (
            <Text style={[styles.secondaryText, styles.incomeText]}>
              {t('Finances.incomeWillBePaidToByThisMethodMonthly')}
            </Text>
            )}
          </View>
        ));
  };

  const Income = () => (
    <View style={styles.incomeContainer}>
      <View style={styles.incomeTitleContainer}>
        <Text style={styles.title}>{t('Finances.income')} </Text>
        <Text style={[styles.secondaryText, styles.perPeriod]}>{t('Finances.perPeriod')}</Text>
      </View>

      <View style={styles.incomeList}>
        {income.map(item => (
          <View style={styles.incomeItem} key={item._id}>
            <View style={styles.incomeInfo}>
              <Text style={styles.period}>{item.period}</Text>
              <View style={styles.totalAmountContainer}>
                <Text style={styles.totalAmount}>{`$${item.totalAmount}`}</Text>
              </View>
            </View>

            <View style={styles.line} />
          </View>
        ))}
      </View>
    </View>
  );

  const Loader = () => <View><ActivityIndicator size="large" color={colors.primary} /></View>;


  const webViewStateChangeProps = useMemo(() => (Platform.OS === 'ios'
    ? { onShouldStartLoadWithRequest: onWebViewStateChange }
    : { onNavigationStateChange: onWebViewStateChange }), [onWebViewStateChange]);

  return (
    <>
      {!isRefreshing && isConfirmationModal && (
        <Modal
          title={t('Finances.deleteBankAccount')}
          text={t('Finances.bankAccountWillBeDeletedButWeWillStoreTheData')}
          closeButtonText={t('Finances.cancel')}
          submitButtonText={t('Finances.delete')}
          onClose={onCloseConfirmationModal}
          onSubmit={onDeleteWithdrawalMethodConfirmation}
        />
      )}

      <BankAccountModal
        visible={isBankAccountModal}
        onClose={onChangeBankAccountModalVisibility}
        onUpdateBankAccount={updateBankAccount}
        onDeleteBankAccount={deleteWithdrawalMethod}
      />

      <SafeAreaView style={styles.screen}>
        {webViewUrl && (
          <WebView
            source={{ uri: webViewUrl }}
            {...webViewStateChangeProps}
            startInLoadingState
          />
        )}

        {!webViewUrl && (
          <>
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
                refreshControl={(
                  <RefreshControl
                    refreshing={isFetchedFirstTime && isRefreshing}
                    onRefresh={onRefresh}
                  />
                )}
              >
                {!isFetchedFirstTime ? <Loader /> : (
                  <>
                    <WithdrawalMethod />
                    {income?.length ? <Income /> : <EmptyView />}
                  </>
                )}
              </ScrollView>
            </View>
          </>
        )}
      </SafeAreaView>
    </>
  );
}

export default React.memo(Finances);
