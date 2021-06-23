import React from 'react';
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
    width: '100%',
  },
};

export default () => {
  const { t } = useTranslation();
  const toast = useToast();

  return {
    showSuccess: (text) => {
      toast.show(<SuccessToast text={text} />, defaultOptions);
    },
    showFailure: (text) => {
      toast.show(<FailureToast text={text || t('Toast.somethingWentWrongPleaseTryAgain')} />, defaultOptions);
    },
  };
};
