import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Image, ScrollView, ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import * as userSelectors from 'resources/user/user.selectors';
import * as userActions from 'resources/user/user.actions';

import useToast from 'hooks/useToast';

import Text from 'components/Text';
import GrayscaledImage from 'components/GrayscaledImage';

import { toFixLength } from 'helpers/modifyText';

import { USER_STATUSES } from 'resources/user/user.constants';

import colors from 'themes/colors';

import styles from './styles';

const FanAccount = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { showFailure } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        await dispatch(userActions.getSubscriptions());
      } catch (err) {
        showFailure();
      }
      setIsLoading(false);
    };

    init();
  }, [dispatch, showFailure]);

  const fullName = useSelector(userSelectors.getUserFullName);
  const email = useSelector(userSelectors.getUserEmail);
  const userName = useSelector(userSelectors.getUserName);
  const fighters = useSelector(userSelectors.getSubscribedFighters);

  // Check if fighter list contains not only _id and fullName
  const isFightersFetched = useMemo(() => Boolean(fighters[0]?.role?.biography), [fighters]);

  return (
    <ScrollView style={styles.content}>
      <View style={styles.account}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.caption}>({t('AccountFan.username')})</Text>
        </View>
        <Text style={styles.grayText}>{fullName} • {email}</Text>
      </View>
      {isLoading
        ? <Loader />
        : isFightersFetched && (
        <View style={styles.subscriptions}>
          <Text style={styles.title}>
            {t('AccountFan.YourSubscriptions')}
          </Text>

          {fighters.map((item, i) => {
            const { nickname } = item.role.biography;
            const { cityName, stateCode } = item.role.biography.hometown;
            return (
              <View style={[styles.fighter, i !== (fighters.length - 1) && styles.line]} key={item._id}>
                {item.status === USER_STATUSES.BLOCKED
                  ? (
                    <GrayscaledImage
                      style={styles.fighterImage}
                      source={{ uri: item.avatarUrl }}
                    />
                  )
                  : (
                    <Image
                      style={styles.fighterImage}
                      source={{ uri: item.avatarUrl }}
                    />
                  )}
                <View>
                  <Text style={styles.fullName}>{item.fullName}</Text>
                  {nickname && (
                  <Text style={styles.nickname}>
                    “
                    {toFixLength({ text: nickname, length: 30 })}
                    ”
                  </Text>
                  )}
                  <Text style={styles.city}>
                    {toFixLength({ text: cityName, length: 30 })}
                    ,
                    {' '}
                    {toFixLength({ text: stateCode, length: 30 })}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        )}
      <View style={styles.textContainer}>
        <Text style={styles.grayText}>{t('AccountFan.YouCantSubscribe')}
        </Text>
        <Text style={[styles.grayText, styles.bottomText]}>{t('AccountFan.PleaseGoToFans4')}</Text>
      </View>
    </ScrollView>
  );
};

export default React.memo(FanAccount);
