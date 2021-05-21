import { StyleSheet, Dimensions } from 'react-native';
import { variables } from 'themes/commonStyles';

const windowWidth = Dimensions.get('window').width;
const videoWidth = windowWidth - (variables.paddingHorizontal * 2);

export default StyleSheet.create({
  container: {
    width: '100%',
  },
  video: {
    width: videoWidth,
    height: videoWidth / 4 * 5,
  },
  pauseControlContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
