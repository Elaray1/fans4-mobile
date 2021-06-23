import React, { useState, useCallback, useMemo } from 'react';
import {
  SafeAreaView, View, StatusBar, Linking,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import colors from 'themes/colors';

import Header from 'components/Header';
import Button from 'components/Button';
import RadioButton from 'components/RadioButton';

import { USER_TYPES } from 'resources/user/user.constants';
import * as userSelectors from 'resources/user/user.selectors';

import styles from './ContactAdmin.styles';

function ContactAdmin() {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState(null);
  const userName = useSelector(userSelectors.getUserFullName);
  const userType = useSelector(userSelectors.getUserType);

  const items = useMemo(() => (userType === USER_TYPES.FIGHTER ? [
    {
      _id: '1',
      title: t('ContactAdmin.updateMyPersonalInfo'),
    },
    {
      _id: '2',
      title: t('ContactAdmin.changeMyStatus'),
    },
    {
      _id: '3',
      title: t('ContactAdmin.updateMyStatus'),
    },
    {
      _id: '4',
      title: t('ContactAdmin.whyMyContentWasBlocked'),
    },
    {
      _id: '5',
      title: t('ContactAdmin.incomeIssues'),
    },
    {
      _id: '6',
      title: t('ContactAdmin.other'),
    },
  ] : [
    {
      _id: '1',
      title: t('ContactAdmin.updateMyPersonalInfo'),
    },
    {
      _id: '2',
      title: t('ContactAdmin.whyMyContentWasBlocked'),
    },
    {
      _id: '3',
      title: t('ContactAdmin.other'),
    },
  ]), [t, userType]);

  const onButtonPress = useCallback(() => {
    Linking.openURL(`mailto:admin@fans4.com?subject=${items[selectedItem - 1].title} ${userName}`);
  }, [items, selectedItem, userName]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <Header leftItemType="backArrow" title={t('ContactAdmin.contactAdmin')} />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.selectList}>
          {items.map(
            (item, index) => (
              <RadioButton
                key={item._id}
                isSelected={selectedItem === (index + 1)}
                title={item.title}
                onPress={() => { setSelectedItem(index + 1); }}
              />
            ),
          )}
        </View>
        <Button title={t('ContactAdmin.sendEmail')} disabled={!selectedItem} onPress={onButtonPress} />
      </ScrollView>

    </SafeAreaView>
  );
}

export default React.memo(ContactAdmin);
