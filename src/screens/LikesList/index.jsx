import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import * as postApi from 'resources/post/post.api';

import Header from 'components/Header';
import Text from 'components/Text';

import NoFightsIllustration from 'assets/illustrations/no-events.svg';

import colors from 'themes/colors';

import styles from './styles';

function LikesList({ route }) {
  const { t } = useTranslation();

  const { likedUsers } = route.params;

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.listItem}>
        <Text style={styles.listItemCity}>{item.name}
        </Text>
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
      {likedUsers?.length
        ? (
          <FlatList
            data={likedUsers}
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

LikesList.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      likedUsers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    }),
  }).isRequired,
};

export default React.memo(LikesList);
