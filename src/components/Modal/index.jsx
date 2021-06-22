import React, { useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity, Modal as RNModal, Animated, View, ActivityIndicator,
} from 'react-native';

import Text from 'components/Text';

import useAnimatedModal from 'helpers/useAnimatedModal';

import colors from 'themes/colors';

import styles from './styles';

function Modal({
  title,
  text,
  closeButtonText,
  submitButtonText,
  additionalButtonText,
  visible,
  onClose,
  onSubmit,
  onPressAdditionalButton,
  isSubmitButtonDisabled,
  isSubmitButtonLoading,
}) {
  const [animatedValue, showModal, hideModal] = useAnimatedModal();

  useEffect(() => {
    showModal();
  }, [showModal]);

  const onCloseModal = useCallback(() => {
    hideModal(onClose);
  }, [hideModal, onClose]);

  const buttons = useMemo(() => {
    if (additionalButtonText) {
      return (
        <View style={[styles.buttonsWrapper, styles.addButtonStyles]}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={onClose}
          >
            <Text style={[styles.buttonsText, styles.cancelText]}>{closeButtonText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={onPressAdditionalButton}
          >
            <Text style={[styles.buttonsText, styles.cancelText]}>{additionalButtonText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={onSubmit}
            disabled={isSubmitButtonDisabled}
          >
            <Text style={styles.buttonsText}>{submitButtonText}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (submitButtonText) {
      return (
        <View style={styles.buttonsWrapper}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={[styles.buttonsText, styles.cancelText]}>{closeButtonText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={onSubmit}
            disabled={isSubmitButtonDisabled}
          >
            {isSubmitButtonLoading
              ? <ActivityIndicator size="large" color={colors.primary} />
              : <Text style={styles.buttonsText}>{submitButtonText}</Text>}
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <TouchableOpacity
        style={styles.nextWrapper}
        onPress={onCloseModal}
      >
        <Text style={styles.next}>{closeButtonText}</Text>
      </TouchableOpacity>
    );
  }, [additionalButtonText,
    submitButtonText,
    onCloseModal,
    closeButtonText,
    onClose,
    onPressAdditionalButton,
    onSubmit,
    isSubmitButtonDisabled,
    isSubmitButtonLoading]);

  return (
    <RNModal
      animationType="none"
      transparent
      visible={visible}
    >
      <TouchableOpacity style={styles.background} onPress={onCloseModal}>
        <Animated.View
          style={[styles.modal, {
            transform: [{ translateY: animatedValue }],
          }]}
        >
          <View style={styles.modalContent}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>{text}</Text>
            {buttons}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </RNModal>
  );
}

Modal.propTypes = {
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  closeButtonText: PropTypes.string,
  submitButtonText: PropTypes.string,
  additionalButtonText: PropTypes.string,
  visible: PropTypes.bool,
  isSubmitButtonDisabled: PropTypes.bool,
  isSubmitButtonLoading: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  onPressAdditionalButton: PropTypes.func,
};

Modal.defaultProps = {
  closeButtonText: 'Next',
  submitButtonText: '',
  additionalButtonText: '',
  visible: true,
  isSubmitButtonDisabled: false,
  isSubmitButtonLoading: false,
  onClose: () => null,
  onSubmit: () => null,
  onPressAdditionalButton: () => null,
};

export default Modal;
