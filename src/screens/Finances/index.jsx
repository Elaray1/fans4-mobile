import React, {
  useCallback, useEffect, useState, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView, ScrollView, View, TouchableOpacity, ActivityIndicator, Linking, Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import moment from 'moment';

import * as userSelectors from 'resources/user/user.selectors';
import * as accountApi from 'resources/account/account.api';
import * as payoutApi from 'resources/payout/payout.api';

import analyticsService from 'services/analytics.service';

import PlusIcon from 'assets/icons/plus';
import TrashIcon from 'assets/icons/trash';

import Text from 'components/Text';
import Header from 'components/Header';
import Modal from 'components/Modal';

import useToast from 'hooks/useToast';

import IncomeIllustration from 'assets/illustrations/income.svg';

import colors from 'themes/colors';

import styles from './styles';

function Finances({ route }) {
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const navigation = useNavigation();

  const isUserAuthenticated = useSelector(userSelectors.getAuthenticated);

  const stripeAccountId = route?.params?.stripeAccountId;

  const [account, setAccount] = useState(null);
  const [income, setIncome] = useState(null);
  const [webViewUrl, setWebViewUrl] = useState(null);
  const [isConfirmationModal, setIsConfirmationModal] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const userId = useSelector(userSelectors.getUserId);

  useEffect(() => {
    analyticsService.logEvent({
      name: analyticsService.events.FIGHTER_OPENED_FINANCES_SCREEN,
      data: {
        userId,
      },
    });
  }, [userId]);

  const getUserWithdrawalMethod = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const { account: fetchedAccount } = await accountApi.getStripePayoutAccount();
      setAccount(fetchedAccount);
    } catch (err) {
      showFailure();
    }
    setIsRefreshing(false);
  }, [showFailure]);

  const createStripePayoutAccount = useCallback(async () => {
    try {
      const {
        accountLink: fetchedAccountLink,
      } = await accountApi.createStripePayoutAccount();
      if (Platform.OS === 'ios') {
        setWebViewUrl(fetchedAccountLink);
      } else {
        Linking.openURL(fetchedAccountLink);
      }
    } catch (err) {
      console.error('createStripePayoutAccount err', err);
      showFailure();
    }
  }, [showFailure]);

  const deleteWithdrawalMethod = useCallback(() => {
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
    if (!webViewState.url.includes('connect.stripe.com')) {
      const response = await axios({ method: 'get', url: `${webViewState.url}&noRedirect=true` });
      if (response.data?.error) {
        console.error('webViewState adding stripe error:', response.data.error);
        showFailure(response.data.error);
      }
      setWebViewUrl(null);
      getUserWithdrawalMethod();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserWithdrawalMethod]);

  useEffect(() => {
    if (isUserAuthenticated) {
      getUserWithdrawalMethod();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserAuthenticated, stripeAccountId]);

  useEffect(() => {
    getUserIncome();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const WithdrawalMethod = () => (withdrawalMethod
    ? (
      <View style={styles.withdrawalMethod}>
        <View>
          <Text style={styles.title}>{withdrawalMethod.title}</Text>
          <Text style={styles.withdrawalMethodNumber}>
            {withdrawalMethod.text}
          </Text>
        </View>
        <TouchableOpacity
          onPress={deleteWithdrawalMethod}
          activeOpacity={0.7}
        >
          <TrashIcon />
        </TouchableOpacity>
      </View>
    )
    : (
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

  return (
    <>
      {!isRefreshing && isConfirmationModal && (
        <Modal
          title={t('Finances.deleteWithdrawalMethod')}
          text={t('Finances.bankAccountWillBeDeletedButWeWillStoreTheData')}
          closeButtonText={t('Finances.cancel')}
          submitButtonText={t('Finances.delete')}
          onClose={onCloseConfirmationModal}
          onSubmit={onDeleteWithdrawalMethodConfirmation}
        />
      )}

      <SafeAreaView style={styles.screen}>
        {webViewUrl && (
          <WebView
            source={{ uri: webViewUrl }}
            onNavigationStateChange={onWebViewStateChange}
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
              >
                {isRefreshing ? <Loader /> : (
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

Finances.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      stripeAccountId: PropTypes.string,
      error: PropTypes.string,
    }),
  }).isRequired,
};

export default React.memo(Finances);
