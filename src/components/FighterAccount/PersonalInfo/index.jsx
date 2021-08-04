import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import ArrowUpIcon from 'assets/icons/arrow-up';
import ArrowDownIcon from 'assets/icons/arrow-down';

import Text from 'components/Text';

import styles from './styles';

const PersonalInfo = ({
  age,
  weight,
  height,
  reach,
}) => {
  const { t } = useTranslation();
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);

  const onPersonalInfoPress = useCallback(() => {
    setIsPersonalInfoOpen(!isPersonalInfoOpen);
  }, [isPersonalInfoOpen]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.biographyBlock}
      onPress={onPersonalInfoPress}
    >
      <View style={[styles.biographyData, !isPersonalInfoOpen && styles.biographyClosedData]}>
        <Text style={styles.blockTitle}>{t('Account.personalInfo')}</Text>
        {isPersonalInfoOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </View>

      {isPersonalInfoOpen && (
        <View style={styles.personalInfoContainer}>
          <View style={styles.personalInfoData}>
            <Text style={styles.profileDataTitle}>{t('Account.age')}</Text>
            <Text style={styles.personalInfoValue}>{age}</Text>
          </View>

          <View style={styles.personalInfoData}>
            <Text style={styles.profileDataTitle}>{t('Account.weight')}</Text>
            <Text style={styles.personalInfoValue}>{weight}</Text>
          </View>

          <View style={styles.personalInfoData}>
            <Text style={styles.profileDataTitle}>{t('Account.height')}</Text>
            <Text style={styles.personalInfoValue}>{height}</Text>
          </View>

          <View style={styles.personalInfoData}>
            <Text style={styles.profileDataTitle}>{t('Account.reach')}</Text>
            <Text style={styles.personalInfoValue}>{reach}</Text>
          </View>
        </View>
      )}

    </TouchableOpacity>
  );
};

PersonalInfo.propTypes = {
  age: PropTypes.number.isRequired,
  weight: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  reach: PropTypes.string.isRequired,
};

PersonalInfo.defaultProps = {
};

export default React.memo(PersonalInfo);
