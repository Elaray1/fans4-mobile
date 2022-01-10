import { useState, useCallback } from 'react';

const useViewableItems = () => {
  const [viewableItemsState, setViewableItemsState] = useState({});

  const updateViewableItems = useCallback(({ viewableItems }) => {
    setViewableItemsState(viewableItems.reduce((memo, item) => {
      memo[item.key] = true;
      return memo;
    }, {}));
  }, []);

  return { viewableItemsState, updateViewableItems };
};

export default useViewableItems;
