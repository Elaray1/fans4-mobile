import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Text from 'components/Text';

import * as userSelectors from 'resources/user/user.selectors';

import { toFixLength } from 'helpers/modifyText';

import styles from './styles';

const FanAccount = () => {
  const { t } = useTranslation();

  const fighters = [{
    _id: '60ca02d365b0f60021011cd8',
    email: 'a.rudko+2ns@paralect.com',
    role: {
      type: 'fighter',
      biography: {
        nickname: 'Emkl',
        gender: 'female',
        birthdate: '01/03/2004',
        hometown: {
          _id: '60b63f2b1bbf560022fa844e',
          cityName: 'Washington',
          stateName: 'District of Columbia',
          stateCode: 'DC',
          countryName: 'United States of America',
          countryCode: 'US',
          timezone: 'America/New_York',
        },
      },
    },
    avatarUrl: 'https://paralect-fans-4-public.s3.eu-central-1.amazonaws.com/development/avatars/60ca02d365b0f60021011cd8_1623853326765_1623853326766.jpeg%7D',
    fullName: 'Aaaaaaa',
  },
  ];
  const fullName = useSelector(userSelectors.getUserFullName);
  const email = useSelector(userSelectors.getUserEmail);
  const userName = useSelector(userSelectors.getUserName);
  // TODO replace mocked fighters with subscribedFighters in story 213
  // const fighters = useSelector(userSelectors.getSubscribedFighters);

  return (
    <ScrollView style={styles.content}>
      <View style={styles.account}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.caption}>({t('AccountFan.username')})</Text>
        </View>
        <Text style={styles.grayText}>{fullName} • {email}</Text>
      </View>
      <View style={styles.subscriptions}>
        <Text style={styles.title}>{t('AccountFan.YourSubscriptions')}</Text>
        {fighters.map((item, i) => {
          const { nickname } = item.role.biography;
          const { cityName, stateCode } = item.role.biography.hometown;
          return (
            <View style={[styles.fighter, i !== (fighters.length - 1) && styles.line]} key={item._id}>
              <Image
                style={styles.fighterImage}
                source={{ uri: item.avatarUrl }}
              />
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
      <View style={styles.textContainer}>
        <Text style={styles.grayText}>{t('AccountFan.YouCantSubscribe')}
        </Text>
        <Text style={[styles.grayText, styles.bottomText]}>{t('AccountFan.PleaseGoToFans4')}</Text>
      </View>
    </ScrollView>
  );
};

export default React.memo(FanAccount);
