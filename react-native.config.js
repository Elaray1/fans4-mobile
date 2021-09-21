module.exports = {
  dependencies: {
    'react-native-iap': {
      platforms: {
        android: null, // Disable autolinking for react-native-iap in android
      },
    },
  },
  project: {
    android: {},
  },
  assets: ['./assets/fonts/'],
};
