export const getAuthenticated = ({ user }) => user !== null;

export const getUserData = ({ user }) => user;

export const getUserEmail = ({ user }) => user?.email;
export const getUserType = ({ user }) => user?.role?.type;
export const getUserFullName = ({ user }) => user?.fullName;

/* Fighters selectors: start */

export const getUserBiographyAbout = ({ user }) => user?.role?.biography?.about;

/* Fighters selectors: end */
