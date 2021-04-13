import PropTypes from 'prop-types';
import React from 'react';
import RNQR from 'react-native-qrcode-svg';

function QRCode({ link, size }) {
  return (
    <RNQR
      value={link}
      size={size}
    />
  );
}

QRCode.propTypes = {
  link: PropTypes.string.isRequired,
  size: PropTypes.number,
};

QRCode.defaultProps = {
  size: 100,
};

export default React.memo(QRCode);
