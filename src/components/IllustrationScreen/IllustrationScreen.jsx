import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, View, StatusBar, ViewPropTypes, TouchableOpacity } from 'react-native';

import colors from 'themes/colors';

import Text from 'components/Text';
import Button from 'components/Button';
import Header from 'components/Header';

import BackArrowIcon from 'assets/icons/back-arrow';

import styles from './IllustrationScreen.styles';

function IllustrationScreen({
  buttonText, linkText, title, description, illustration, onButtonPress, onLinkPress, headerText,
  contentStyles, illustrationContainerStyles, titleStyles, onBackButtonPress,
}) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />

      {onBackButtonPress && (
      <TouchableOpacity style={styles.backArrow} onPress={onBackButtonPress}>
        <BackArrowIcon />
      </TouchableOpacity>
      )}

      {headerText && (
        <Header
          title={headerText}
        />
      )}

      <View style={[styles.content, headerText && styles.header, contentStyles]}>
        <View style={[styles.illustrationContainer, illustrationContainerStyles]}>
          {illustration}
        </View>

        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={[styles.title, titleStyles]}>{title}</Text>
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

IllustrationScreen.propTypes = {
  buttonText: PropTypes.string,
  linkText: PropTypes.string,
  headerText: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  illustration: PropTypes.node.isRequired,
  onButtonPress: PropTypes.func,
  onLinkPress: PropTypes.func,
  onBackButtonPress: PropTypes.func,
  contentStyles: ViewPropTypes.style,
  illustrationContainerStyles: ViewPropTypes.style,
  titleStyles: PropTypes.shape(),
};

IllustrationScreen.defaultProps = {
  buttonText: null,
  linkText: null,
  headerText: null,
  onButtonPress: () => null,
  onLinkPress: () => null,
  contentStyles: null,
  illustrationContainerStyles: null,
  titleStyles: null,
  onBackButtonPress: null,
};

export default React.memo(IllustrationScreen);
