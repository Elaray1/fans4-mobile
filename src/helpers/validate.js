export const containErrors = (errors) => {
  return Boolean(Object.keys(errors)
    .filter(key => errors[key].length).length);
};

export const validateEmail = (email) => {
  // eslint-disable-next-line max-len
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  const re = /^[^\s]{6,}$/;
  return re.test(String(password).toLowerCase());
};
