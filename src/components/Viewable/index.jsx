import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
} from 'react-native';

const VIDEO_VIEWABILITY_CONFIG = { waitForInteraction: true, itemVisiblePercentThreshold: 1 };

function Viewable({ children }) {
  const [isViewable, setIsViewable] = useState(true);

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { viewable: isViewable });
    }
    return child;
  });

  const renderItem = useCallback(() => {
    return childrenWithProps;
  }, [childrenWithProps]);

  const keyExtractor = useCallback(item => item, []);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length) {
      setIsViewable(true);
    } else {
      setIsViewable(false);
    }
  }, []);

  const flatList = (
    <FlatList
      data={['viwableItem']}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={VIDEO_VIEWABILITY_CONFIG}
    />
  );

  return flatList;
}

Viewable.propTypes = {
  children: PropTypes.element.isRequired,
  onViewableChanged: PropTypes.bool.isRequired,
};

export default Viewable;
