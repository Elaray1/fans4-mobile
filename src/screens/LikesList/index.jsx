import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import FlatList from 'components/FlatList';
import Header from 'components/Header';
import Text from 'components/Text';
import CustomRefreshControl from 'components/CustomRefreshControl';

import * as postApi from 'resources/post/post.api';
import * as commentApi from 'resources/comment/comment.api';

import useToast from 'hooks/useToast';

import NoFightsIllustration from 'assets/illustrations/no-events.svg';

import colors from 'themes/colors';

import styles from './styles';

function LikesList({ route }) {
  const { t } = useTranslation();
  const { showFailure } = useToast();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [likedUsers, setLikedUsers] = useState(route?.params?.likedUsers || []);
  const { postId, commentId } = route.params;

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      let fetchedData;
      if (postId) {
        fetchedData = await postApi.getPost(postId);
      } else {
        fetchedData = await commentApi.getCommentsById(commentId);
      }
      setLikedUsers(fetchedData.likedUsers);
    } catch {
      showFailure(t('Fights.couldntRefreshTheFeedPullToRefresh'));
    }
    setIsRefreshing(false);
  }, [commentId, postId, showFailure, t]);

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

  const RefreshControl = (
    <CustomRefreshControl
      refreshing={isRefreshing}
      onRefresh={onRefresh}
    />
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
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            refreshControl={RefreshControl}
          />
        )
        : (
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={RefreshControl}
            keyboardShouldPersistTaps="handled"
          >
            <EmptyView />
          </ScrollView>
        )
      }
    </SafeAreaView>
  );
}

LikesList.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      likedUsers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
      postId: PropTypes.string,
      commentId: PropTypes.string,
    }),
  }).isRequired,
};

export default React.memo(LikesList);
