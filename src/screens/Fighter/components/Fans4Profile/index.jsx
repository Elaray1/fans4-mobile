import React from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

import Text from 'components/Text';

import styles from './styles';

function Fans4Profile({ fighter }) {
  const { t } = useTranslation();

  return (
    <View>
      <View style={styles.fans4Container}>
        <Image style={styles.fans4Image} source={{ uri: fighter.avatarUrl }} />
        <View>
          <Text style={styles.fans4FullName}>{fighter.fullName}</Text>
          <Text style={styles.fans4Text}>{t('Fighter.checkAllTheLatestNewsFromUs')}</Text>
        </View>
      </View>
      <View style={styles.fans4AboutContainer}>
        <Text style={styles.fans4AboutTitle}>{t('Fighter.aboutUs')}</Text>
        <Text style={styles.fans4Text}>{fighter.role.biography.about}</Text>
      </View>

      <View style={styles.line} />

      <Text style={[styles.blockTitle, styles.postsTitle]}>{t('Account.Posts')}</Text>

    </View>
  );
}

Fans4Profile.propTypes = {
  fighter: PropTypes.shape().isRequired,
};

export default React.memo(Fans4Profile);
