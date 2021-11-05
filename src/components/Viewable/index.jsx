import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
} from 'react-native';

const VIDEO_VIEWABILITY_CONFIG = { waitForInteraction: true, itemVisiblePercentThreshold: 1 };

function Viewable({ children, onViewableChanged }) {
  const renderItem = useCallback(() => {
    return children;
  }, [children]);

  const keyExtractor = useCallback(item => item, []);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length) {
      onViewableChanged(true);
    } else {
      onViewableChanged(false);
    }
  }, [onViewableChanged]);

  return (
    <FlatList
      data={['viwableItem']}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={VIDEO_VIEWABILITY_CONFIG}
    />
  );
}

Viewable.propTypes = {
  children: PropTypes.element.isRequired,
  onViewableChanged: PropTypes.bool.isRequired,
};

export default Viewable;
