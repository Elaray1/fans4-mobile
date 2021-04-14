import React, { useEffect, useState, useMemo } from 'react';
import { SafeAreaView, View, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { useTranslation } from 'react-i18next';

import colors from 'themes/colors';

import Text from 'components/Text';
import SearchInput from 'components/SearchInput';
import QRCode from 'components/QRCode';
import Share from 'components/Share';
import UploadPhotoButton from 'components/UploadPhotoButton';

// import config from 'resources/config';
import * as userActions from 'resources/user/user.actions';

// import { getMaskedDeviceId } from 'helpers/deviceInfo';
import { USERS_TYPES, USER_STATUSES } from 'helpers/constants';
// import { getItem, setItem } from 'helpers/storage';

import styles from './AuthAppLoader.styles';

function AuthAppLoader() {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [fighters, setFighters] = useState([]);
  const [, setPhoto] = useState(null);

  useEffect(() => {
    async function init() {
      // checker for case when email was verified when app had been closed
      // const storedAccessToken = await getItem(STORAGE_KEYS.ACCESS_TOKEN);
      // if (storedAccessToken) {
      //   return;
      // }
      // const accessToken = await userActions.fetchAccessToken({ userType });
      // if (accessToken) {
      //   config.accessToken = accessToken;
      //   await setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      //   dispatch(userActions.setUserAuthenticated());
      // }
      try {
        const fetchedFighters = await dispatch(userActions.getUsers({
          role: USERS_TYPES.FIGHTER,
          status: USER_STATUSES.VERIFIED,
        }));
        setFighters(fetchedFighters);
      } catch (err) {
        console.error(err);
      }
      SplashScreen.hide();
    }

    init();
  }, [dispatch]);

  useEffect(() => {
  }, []);

  const content = useMemo(() => {
    if (inputValue) {
      const activeFighters = fighters.filter(
        fighter => fighter.fullName
          .toLowerCase()
          .includes(inputValue.toLowerCase()),
      );
      if (!activeFighters?.length) {
        return (
          <Text style={styles.noTransactionsText}>
            {t('AuthAppLoader.yourSearchDidNotMatchAnyFighters')}
          </Text>
        );
      }
      return (
        <>
          {activeFighters.map(item => (
            <Text key={item._id}>{item.fullName}</Text>
          ))}
        </>
      );
    }
    return (<Text>{t('enterYourSearch')}</Text>);
  }, [fighters, inputValue]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <View style={styles.content}>
        <Text>Auth App</Text>
        <SearchInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={t('AuthAppLoader.searchByFighterName')}
        />
        {content}
        <QRCode
          link={t('AuthAppLoader.linkToShare')}
          size={300}
        />
        <Share message={t('AuthAppLoader.messageToShare')} style={styles.button}>
          <Text>Share</Text>
        </Share>
        <UploadPhotoButton handleImageUpload={setPhoto} label={t('AuthAppLoader.postMedia')} />
      </View>
    </SafeAreaView>
  );
}

export default AuthAppLoader;
