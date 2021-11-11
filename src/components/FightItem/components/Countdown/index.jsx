import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import Text from 'components/Text';

import { formatTime } from 'components/Post/Post.helpers';

import styles from './styles';

const Countdown = ({ date }) => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(moment(date).diff(moment(), 's'));

  const intervalId = useRef();

  useEffect(() => {
    intervalId.current = setInterval(() => {
      setCountdown(cd => Math.max(0, cd - 1));
    }, 1000);

    return () => clearInterval(intervalId.current);
  }, []);

  const isVotingClosed = useMemo(() => (
    moment(date).isBefore(moment())
  ), [date]);

  const hoursBeforeFight = useMemo(() => (
    moment(date).diff(moment(), 'h')
  ), [date]);

  return (
    <View style={styles.time}>
      {isVotingClosed
        ? <Text style={styles.timeText}>{t('Fight.votingClosedCounter')}</Text>
        : (
          <>
            {hoursBeforeFight < 24
              ? <Text style={styles.timeText}>{moment.utc(countdown * 1000).format('HH:mm:ss')}</Text>
              : <Text style={styles.timeText}>{formatTime(date)}</Text>}
          </>
        )}
    </View>
  );
};

Countdown.propTypes = {
  date: PropTypes.string.isRequired,
};

export default React.memo(Countdown);
