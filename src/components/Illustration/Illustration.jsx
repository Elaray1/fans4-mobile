import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, View, StatusBar } from 'react-native';

import colors from 'themes/colors';

import Text from 'components/Text';
import Button from 'components/Button';

import styles from './Illustration.styles';

function Illustration({
  buttonText, linkText, title, description, illustration, onButtonPress, onLinkPress,
}) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <View style={styles.content}>
        {illustration ? { illustration } : <View style={styles.imagePlaceholder} />}
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>
              {description}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            {buttonText && <Button title={buttonText} onPress={onButtonPress} />}
            {linkText && <Button title={linkText} type="link" onPress={onLinkPress} />}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

Illustration.propTypes = {
  buttonText: PropTypes.string,
  linkText: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  illustration: PropTypes.node,
  onButtonPress: PropTypes.func,
  onLinkPress: PropTypes.func,
};

Illustration.defaultProps = {
  buttonText: null,
  linkText: null,
  illustration: null,
  onButtonPress: () => null,
  onLinkPress: () => null,
};

export default Illustration;
