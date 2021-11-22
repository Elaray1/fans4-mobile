module.exports = {
  dependencies: {
    'react-native-iap': {
      platforms: {
        android: null, // Disable autolinking for react-native-iap in android
      },
    },
    'react-native-video': {
      platforms: {
        android: {
          sourceDir:
            '../node_modules/react-native-video/android-exoplayer',
        },
      },
    },
  },
  project: {
    android: {},
  },
  assets: ['./assets/fonts/'],
};
