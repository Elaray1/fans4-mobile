import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import * as postApi from 'resources/post/post.api';

import { USER_TYPES } from 'resources/user/user.constants';

import Header from 'components/Header';
import Text from 'components/Text';

import NoFightsIllustration from 'assets/illustrations/no-events.svg';

import colors from 'themes/colors';

import styles from './styles';

const INITIAL_PAGE = 1;
const PER_PAGE = 25;

function LikesList({ route }) {
  const { t } = useTranslation();
  const [fans, setFans] = useState([]);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [isAllFansLoaded, setIsAllFansLoaded] = useState(false);

  const { _id } = route.params;

  const fetchFans = useCallback(async () => {
    if (!isAllFansLoaded) {
      try {
        const { likes: newFans } = await postApi.getLikesPost({ _id, page, perPage: PER_PAGE });

        if (newFans.length < PER_PAGE) {
          setIsAllFansLoaded(true);
        } else {
          setIsAllFansLoaded(false);
        }
        setFans([...fans, ...newFans]);
        setPage(page + 1);
      } catch (error) {
        console.error(error);
      }
    }
  }, [_id, fans, isAllFansLoaded, page]);

  useEffect(() => {
    fetchFans();
  }, [_id, fetchFans]);

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.listItem}>
        <Text style={styles.listItemCity}>{item.role.type === USER_TYPES.FAN
          ? item.role.biography.userName
          : item.fullName}
        </Text>
      </View>
    );
  };

  const renderItemSeparator = () => <View style={styles.line} />;
  const renderFooter = () => {
    if (isAllFansLoaded) {
      return null;
    }
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

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
      {fans.length || page === INITIAL_PAGE
        ? (
          <FlatList
            data={fans}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ItemSeparatorComponent={renderItemSeparator}
            onEndReached={fetchFans}
            onEndReachedThreshold={0.3}
            initialNumToRender={25}
            ListFooterComponent={renderFooter}
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
      _id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default React.memo(LikesList);
