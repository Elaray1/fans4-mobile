import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import React, { useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import i18n from 'i18n';
import { validate, getServerErrors } from 'helpers/validate';
import useForm from 'hooks/useForm';
import images from 'themes/images';

import * as userActions from 'resources/user/user.actions';

import Input from 'components/input';
import Text from 'components/text';
import BackButton from 'components/backButton';
import MainButton from 'components/mainButton';

import styles from './signUpAsFollowerScreen.styles';

function SignUpScreen({ navigation }) {
  const dispatch = useDispatch();

  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  const submit = useCallback(async (values) => {
    try {
      const userData = {
        fullName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        type: 'follower',
      };

      await dispatch(userActions.signUp(userData));
    } catch ({ data }) {
      const { errors } = data;
      const error = {
        email: getServerErrors(errors, 'email'),
        password: getServerErrors(errors, 'password'),
      };
      throw error;
    }
  }, [dispatch]);

  const validateForm = useCallback((values) => {
    const validationErrors = {
      firstName: validate(values.firstName, 'firstName'),
      lastName: validate(values.lastName, 'lastName'),
      email: validate(values.email, 'email'),
      password: validate(values.password, 'password'),
    };
    return validationErrors;
  }, []);

  const [form, onChange, onSubmit, setFocus] = useForm({}, submit, validateForm);

  const goToSignIn = useCallback(() => {
    navigation.navigate('SignIn');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={images.logo}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.titleContainer}>
        <View style={styles.backButtonContainer}>
          <BackButton onPress={() => {}} />
        </View>
        <Text style={styles.title}>{i18n.t('signUpAsFollowerScreen.title')}</Text>
      </View>

      <Input
        value={form.values.fullName}
        type="givenName"
        placeholder="Full Name"
        onChange={onChange('fullName')}
        error={form.errors.fullName && form.errors.fullName[0]}
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={setFocus(emailInput)}
      />

      <Input
        getRef={emailInput}
        placeholder="E-mail"
        value={form.values.email}
        type="emailAddress"
        onChange={onChange('email')}
        error={form.errors.email && form.errors.email[0]}
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={setFocus(passwordInput)}
      />

      <Input
        getRef={passwordInput}
        placeholder="Password"
        type="password"
        value={form.values.password}
        onChange={onChange('password')}
        error={form.errors.password && form.errors.password[0]}
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={onSubmit}
      />

      <View style={styles.mainButtonContainer}>
        <MainButton
          title="Sign Up"
          onPress={onSubmit}
        />

        <View style={styles.signinTextContainer}>
          <Text style={styles.signinText}>
            {i18n.t('signUpAsFollowerScreen.haveAccount')}
            &nbsp;
          </Text>
          <Text
            onPress={goToSignIn}
            style={styles.link}
          >
            {i18n.t('signUpAsFollowerScreen.signIn')}
          </Text>
        </View>
      </View>
    </View>
  );
}

SignUpScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default SignUpScreen;
