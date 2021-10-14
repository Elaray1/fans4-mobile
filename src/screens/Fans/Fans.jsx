import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import * as userApi from 'resources/user/user.api';

import Header from 'components/Header';
import Text from 'components/Text';

import NoFightsIllustration from 'assets/illustrations/no-events.svg';

import colors from 'themes/colors';

import styles from './Fans.styles';

function Fans() {
  const { t } = useTranslation();
  const [fans, setFans] = useState([]);

  useEffect(() => {
    const initialLoad = async () => {
      const { fans: fetchedFans } = await userApi.getMyFans();
      console.log(fetchedFans);
      setFans(fetchedFans);
    };
    initialLoad();
  }, []);

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.listItem}>
        <Text style={styles.listItemCity}>{item.role.biography.userName}</Text>
      </View>
    );
  };

  const renderItemSeparator = () => <View style={styles.line} />;

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <NoFightsIllustration style={styles.illustration} />
      <Text style={styles.titleText}>{t('Fans.noFans')}</Text>
      <Text style={styles.text}>{t('Fans.nothingYet')}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <Header
        title={t('Fans.fans')}
        leftItemType="backArrow"
      />
      {fans.length
        ? (
          <FlatList
            data={fans}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ItemSeparatorComponent={renderItemSeparator}
            onEndReachedThreshold={0.3}
            initialNumToRender={1000}
          />
        )
        : <EmptyView />
      }
    </SafeAreaView>
  );
}

export default React.memo(Fans);
