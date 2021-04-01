import React, { useCallback } from 'react';
import { View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import i18n from 'i18n';

import MainButton from 'components/mainButton';
import images from 'themes/images';

import styles from './roleSelectionScreen.styles';

function RoleSelectionScreen({ navigation }) {
  const handleFollowerRoleSelection = useCallback(() => {
    navigation.navigate('SignUpAsFollower');
  }, [navigation]);

  const handleFighterRoleSelection = useCallback(() => {
    // TO DO
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={images.logo}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>{i18n.t('roleSelectionScreen.title')}</Text>
      <MainButton title={i18n.t('roleSelectionScreen.followerRole')} onPress={handleFollowerRoleSelection} />
      <MainButton title={i18n.t('roleSelectionScreen.figtherRole')} onPress={handleFighterRoleSelection} />
    </View>
  );
}

RoleSelectionScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default RoleSelectionScreen;
