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

import * as userSelectors from 'resources/user/user.selectors';

import * as accountApi from 'resources/account/account.api';

import PlusIcon from 'assets/icons/plus';
import TrashIcon from 'assets/icons/trash';

import Text from 'components/Text';
import Header from 'components/Header';
import Modal from 'components/Modal';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import styles from './styles';

function Finances({ route }) {
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const navigation = useNavigation();

  const isUserAuthenticated = useSelector(userSelectors.getAuthenticated);

  const stripeAccountId = route?.params?.stripeAccountId;
  const fetchedError = route?.params?.error;

  const [account, setAccount] = useState(null);
  const [webViewUrl, setWebViewUrl] = useState(null);
  const [isConfirmationModal, setIsConfirmationModal] = useState(false);
  const [error, setError] = useState(fetchedError);

  const [isRefreshing, setIsRefreshing] = useState(false);

  if (error !== fetchedError) {
    setError(fetchedError);
  }

  const getUserWithdrawalMethod = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const { account: fetchedAccount } = await accountApi.getUserAccount();
      setAccount(fetchedAccount);
    } catch (err) {
      showFailure();
    }
    setIsRefreshing(false);
  }, [showFailure]);

  const createUserAccount = useCallback(async () => {
    try {
      const {
        accountLink: fetchedAccountLink,
      } = await accountApi.createUserAccount();
      if (Platform.OS === 'ios') {
        setWebViewUrl(fetchedAccountLink);
      } else {
        Linking.openURL(fetchedAccountLink);
      }
    } catch (err) {
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
      await accountApi.deleteUserAccount();
      setAccount(null);
    } catch (err) {
      showFailure();
    }
    onCloseConfirmationModal(false);
    setIsRefreshing(false);
  }, [showFailure, onCloseConfirmationModal]);

  const onWebViewStateChange = useCallback(async (webViewState) => {
    if (!webViewState.url.includes('connect.stripe.com')) {
      await axios({ method: 'get', url: webViewState.url });
      setWebViewUrl(null);
      getUserWithdrawalMethod();
    }
  }, [getUserWithdrawalMethod]);

  useEffect(() => {
    if (isUserAuthenticated) {
      getUserWithdrawalMethod();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserAuthenticated, stripeAccountId]);

  useEffect(() => {
    if (error) {
      showFailure(error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const emptyViewText = useMemo(() => {
    return account
      ? {
        title: t('Finances.noIncomeYet'),
        text: t('Finances.onceYouEarnIncomeYouWillSeeItHere'),
      }
      : {
        title: t('Finances.finances'),
        text: t('Finances.incomeWillBePaidByThisMethodMonthlyYouCanTrackAllFinanceInformationInThisSection'),
      };
  }, [account, t]);

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <View style={styles.emptyViewImage} />
      <Text style={styles.title}>{emptyViewText.title}</Text>
      <Text style={styles.secondaryText}>
        {emptyViewText.text}
      </Text>
    </View>
  );

  const withdrawalMethod = useMemo(() => {
    const bankAccount = account?.typeMetadata?.bankAccount;
    const card = account?.typeMetadata?.card;

    if (bankAccount) {
      return {
        title: t('Finances.bankAccount'),
        text: `••••••••• ${account.typeMetadata.bankAccount.last4}`,
      };
    }

    if (card) {
      return {
        title: t('Finances.card'),
        text: `•••• •••• •••• ${account.typeMetadata.card.last4}`,
      };
    }

    return null;
  }, [account?.typeMetadata?.bankAccount, account?.typeMetadata?.card, t]);

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
      <TouchableOpacity
        onPress={createUserAccount}
        activeOpacity={0.7}
        style={styles.addWithdrawalMethod}
      >
        <PlusIcon style={styles.plus} />
        <Text style={styles.title}>{t('Finances.addWithdrawalMethod')}</Text>
      </TouchableOpacity>
    ));

  const Loader = () => <View><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <>
      {!isRefreshing && isConfirmationModal && (
      <Modal
        title={t('Finances.deleteWithdrawalMethod')}
        text={t('Finances.withdrawalMethodWillBeDeletedButWeWillStoreTheData')}
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
                {isRefreshing
                  ? <Loader />
                  : (
                    <>
                      <WithdrawalMethod />
                      <EmptyView />
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
      stripeAccountId: PropTypes.string.isRequired,
      error: PropTypes.string,
    }),
  }).isRequired,
};

export default React.memo(Finances);
