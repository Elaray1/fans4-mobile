export default (user) => {
  if (!user) {
    return {
      stack: 'AuthStack',
      screen: 'SelectUserType',
    };
  }

  if (user.role.type === 'fighter' && user.status === 'pending') {
    if (user.appState.isEmailVerified) {
      return {
        stack: 'AppStack',
        screen: 'BiographicalData',
      };
    }

    return {
      stack: 'AppStack',
      screen: 'EmailConfirmation',
    };
  }

  return {
    stack: 'AppStack',
    screen: 'Home',
  };
};
