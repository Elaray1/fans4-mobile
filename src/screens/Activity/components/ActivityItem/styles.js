import { StyleSheet, Dimensions } from 'react-native';
import { variables } from 'themes/commonStyles';
import colors from 'themes/colors';
import fonts from 'themes/fonts';

const { width: windowWidth } = Dimensions.get('window');


export default StyleSheet.create({
  title: {
    marginTop: 16,
    marginBottom: 8,
    color: colors.textSecondary,
    fontSize: fonts.size.small,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  titleMargin: {
    marginBottom: 16,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  textBold: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.small,
  },
  text: {
    color: colors.textSecondary,
    fontSize: fonts.size.caption,
  },
  whiteText: {
    color: colors.white,
    fontSize: fonts.size.small,
  },
  newReplyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dash: {
    borderLeftWidth: 2,
    borderColor: colors.textSecondary,
    paddingLeft: 8,
    marginTop: 8,
  },
  postText: {
    maxWidth: 270,
  },
  actionText: {
    marginBottom: -2,
  },
  sayHi: {
    color: colors.link,
    fontSize: fonts.size.small,
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
  },
  activityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  time: {
    color: colors.textSecondary,
    fontSize: fonts.size.caption,
  },
  timeMargin: {
    marginTop: 5,
  },
  line: {
    backgroundColor: colors.line,
    height: 1,
    marginTop: 16,
  },
  postImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  textPostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: windowWidth - variables.paddingHorizontal * 2,
    marginTop: 8,
    padding: 8,
    backgroundColor: colors.primaryButtonText,
    borderRadius: 5,
  },
  commentText: {
    marginTop: 5,
    maxWidth: 270,
  },
  textMaxWidth: {
    maxWidth: 270,
  },
});
