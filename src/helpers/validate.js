const firstNameValidator = (value) => {
  const errors = [];
  if (!value || value.trim() === '') {
    errors.push('First name field is empty');
  }
  return errors;
};

const lastNameValidator = (value) => {
  const errors = [];
  if (!value || value.trim() === '') {
    errors.push('Last name field is empty');
  }
  return errors;
};

const emailValidator = (value) => {
  const errors = [];
  if (!value || value.trim() === '') {
    errors.push('Email field is empty');
  }
  return errors;
};

const passwordValidator = (value) => {
  const errors = [];
  if (!value || value.trim() === '') {
    errors.push('Password field is empty');
  }
  return errors;
};

const confirmPasswordValidator = ({ confirmPassword, password }) => {
  const errors = [];
  if (!confirmPassword || confirmPassword.trim() === '') {
    errors.push('Confirm password field is empty');
  }
  if (confirmPassword !== password) {
    errors.push('Confirm password and password do not match');
  }
  return errors;
};

export const validate = (value, key) => {
  switch (key) {
    case 'firstName':
      return firstNameValidator(value);
    case 'lastName':
      return lastNameValidator(value);
    case 'email':
      return emailValidator(value);
    case 'password':
      return passwordValidator(value);
    case 'confirmPassword':
      return confirmPasswordValidator(value);
    default:
      return [];
  }
};

export const getServerErrors = (commonErrors, key) => {
  return commonErrors
    .filter(error => Object.keys(error)[0] === key)
    .map(error => error[key]);
};

export const containErrors = (errors) => {
  return Boolean(Object.keys(errors)
    .filter(key => errors[key].length).length);
};
