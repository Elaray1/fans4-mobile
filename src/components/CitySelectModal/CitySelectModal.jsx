import PropTypes from 'prop-types';
import React from 'react';
import {
  View, Modal, Pressable,
} from 'react-native';

import Text from 'components/Text';

// import colors from 'themes/colors';

import styles from './CitySelectModal.styles';

function CitySelectModal({
  city, onClose, onSubmit, visible,
}) {
  // const [internalCity, setInternalCity] = useState(city);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.background} onPress={onClose} />
      <View style={styles.modal}>
        <Text>City</Text>
      </View>
    </Modal>
  );
}

CitySelectModal.propTypes = {
  city: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

CitySelectModal.defaultProps = {
  city: '',
};

export default React.memo(CitySelectModal);
