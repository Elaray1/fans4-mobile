import React, { useState, useCallback, useMemo } from 'react';
import {
  SafeAreaView, View, KeyboardAvoidingView, ScrollView, Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import * as commentApi from 'resources/comment/comment.api';

import Header from 'components/Header';
import Button from 'components/Button';
import RadioButton from 'components/RadioButton';
import Text from 'components/Text';
import Input from 'components/Input';

import useToast from 'hooks/useToast';
import { REPORT_REASONS } from 'resources/comment/comment.constants';

import styles from './styles';

const keyboardAvoidingViewBehavior = Platform.OS === 'ios' ? 'position' : 'height';
const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 16;

const REPORT_MAX_LENGTH = 160;
function ReportComment({ route }) {
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const navigation = useNavigation();

  const [selectedItem, setSelectedItem] = useState(null);
  const [reasonValue, setReasonValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    commentId,
    postId,
  } = route?.params;

  const items = useMemo(() => [
    {
      _id: REPORT_REASONS.UNWANTED_COMMERCIAL_CONTENT,
      title: t('ReportComment.unwantedCommercialContent'),
    },
    {
      _id: REPORT_REASONS.INAPPROPRIATE_CONTENT,
      title: t('ReportComment.inappropriateContent'),
    },
    {
      _id: REPORT_REASONS.HATE_SPEECH_OR_SYMBOLS,
      title: t('ReportComment.hateSpeechOrSymbols'),
    },
    {
      _id: REPORT_REASONS.FALSE_INFORMATION,
      title: t('ReportComment.falseInformation'),
    },
    {
      _id: REPORT_REASONS.OTHER,
      title: t('ReportComment.other'),
    },
  ], [t]);

  const onReport = useCallback(async () => {
    setIsLoading(true);
    try {
      await commentApi.reportComment({
        _id: commentId,
        message: selectedItem?._id === REPORT_REASONS.OTHER ? reasonValue : null,
        reason: selectedItem?._id,
      });
      navigation.navigate('ThanksForReporting', { postId });
    } catch (error) {
      showFailure();
    }
    setIsLoading(false);
  }, [commentId, reasonValue, selectedItem?._id, showFailure, navigation, postId]);

  const onRadioButtonPress = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={keyboardAvoidingViewBehavior}
        style={styles.keyboardAvoiding}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <View style={styles.keyboardAvoidingChildContainer}>
          <Header leftItemType="backArrow" title={t('ReportComment.reportComment')} />
          <ScrollView style={styles.content}>
            <View>
              <Text style={styles.text}>{t('ReportComment.whyDoYouWantToReportThisComment')}</Text>
              <View style={styles.selectList}>
                {items.map(item => (
                  <RadioButton
                    key={item._id}
                    isSelected={selectedItem?._id === item._id}
                    title={item.title}
                    onPress={() => onRadioButtonPress(item)}
                    style={styles.radioButton}
                  />
                ))}
              </View>
              {selectedItem?._id === REPORT_REASONS.OTHER && (
              <Input
                label={t('ReportComment.writeHereTheReasonMax160Characters')}
                value={reasonValue}
                onChange={setReasonValue}
                maxLength={REPORT_MAX_LENGTH}
                style={styles.input}
                multiline
              />
              )}
            </View>
            <Button
              title={t('ReportComment.report')}
              disabled={!selectedItem
            || (selectedItem?._id === REPORT_REASONS.OTHER && !reasonValue)}
              onPress={onReport}
              isLoading={isLoading}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

ReportComment.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      commentId: PropTypes.string.isRequired,
      postId: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default React.memo(ReportComment);
