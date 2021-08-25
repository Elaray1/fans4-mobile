import { Dimensions } from 'react-native';

const SMALL_SCREEN_HEIGHT = 640;
const VERY_SMALL_SCREEN_HEIGHT = 568;

const SMALL_SCREEN_CONTENT_STYLES = {
  marginTop: 60,
};

const VERY_SMALL_SCREEN_CONTENT_STYLES = {
  marginTop: 30,
  marginBottom: 30,
};

let logoStyles = null;
const { height } = Dimensions.get('window');

if (height <= VERY_SMALL_SCREEN_HEIGHT) {
  logoStyles = VERY_SMALL_SCREEN_CONTENT_STYLES;
} else if (height <= SMALL_SCREEN_HEIGHT) {
  logoStyles = SMALL_SCREEN_CONTENT_STYLES;
}

export const startScreensStyles = {
  logo: {
    height: 80,
    width: 285,
    marginTop: 100,
    marginBottom: 60,
    alignSelf: 'center',
    ...logoStyles,
  },
};
