import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import { Grayscale } from 'react-native-color-matrix-image-filters';

function GrayscaledImage({
  style,
  source,
}) {
  return (
    <Grayscale>
      <Image style={style} source={source} />
    </Grayscale>
  );
}

GrayscaledImage.propTypes = {
  style: PropTypes.shape(),
  source: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]).isRequired,
};

GrayscaledImage.defaultProps = {
  style: {},
};


export default React.memo(GrayscaledImage);
