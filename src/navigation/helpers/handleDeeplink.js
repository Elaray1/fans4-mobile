import * as rootNavigation from 'helpers/rootNavigation';

export default ({ url, showFailure, userId: currentUserId, t }) => {
  if (url.includes('change-password')) {
    const parsedUrl = new URL(url);

    const userId = parsedUrl.searchParams.get('userId');
    const expirationDate = parsedUrl.searchParams.get('expirationDate');
    const token = parsedUrl.searchParams.get('token');
    const userType = parsedUrl.searchParams.get('userType');

    if (currentUserId && currentUserId !== userId) {
      return false;
    }

    rootNavigation.navigate('ChangePassword', {
      userId,
      expirationDate,
      token,
      userType,
    });

    return true;
  }
};
