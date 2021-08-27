import React, { useCallback } from 'react';
import { useToast } from 'react-native-fast-toast';
import { useTranslation } from 'react-i18next';

import SuccessToast from 'components/SuccessToast';
import FailureToast from 'components/FailureToast';

const defaultOptions = {
  placement: 'top',
  duration: 5 * 1000,
  style: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: '112%',
  },
};

export default () => {
  const { t } = useTranslation();
  const toast = useToast();

  const showSuccess = useCallback((text) => {
    toast.show(<SuccessToast text={text} />, defaultOptions);
  }, [toast]);

  const showFailure = useCallback((text = t('Toast.somethingWentWrongPleaseTryAgain')) => {
    toast.show(<FailureToast text={text} />, defaultOptions);
  }, [t, toast]);

  return {
    showSuccess,
    showFailure,
  };
};
