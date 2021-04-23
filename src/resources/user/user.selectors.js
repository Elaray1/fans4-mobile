export const getAuthenticated = ({ user }) => user !== null;

export const getUserData = ({ user }) => user;

export const getUserEmail = ({ user }) => user?.email;
export const getUserType = ({ user }) => user?.role?.type;
