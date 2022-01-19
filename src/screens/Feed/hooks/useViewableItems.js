import { useState, useCallback, useEffect, useRef } from 'react';

const useViewableItems = ({ setLiveStreamEvent, isAndroidStreamModalVisible }) => {
  const [viewableItemsState, setViewableItemsState] = useState({});
  const isAndroidStreamModalVisibleAsRef = useRef(isAndroidStreamModalVisible);

  // updateViewableItems is callback for FlatList onViewableItemsChanged prop
  // This prop doesn't support dynamically changeable functions like created with useCallback
  // so we duplicate isAndroidStreamModalVisible state variable as ref in order to create static function
  // eslint-disable-next-line max-len
  // https://stackoverflow.com/questions/48045696/flatlist-scrollview-error-on-any-state-change-invariant-violation-changing-on/64573345
  useEffect(() => {
    isAndroidStreamModalVisibleAsRef.current = isAndroidStreamModalVisible;
  }, [isAndroidStreamModalVisible]);

  const updateViewableItems = useCallback(({ viewableItems }) => {
    setViewableItemsState(viewableItems.reduce((memo, item) => {
      memo[item.key] = true;
      return memo;
    }, {}));

    if (isAndroidStreamModalVisibleAsRef.current) {
      return;
    }

    const firstViewableEvent = viewableItems.find(({ item }) => {
      const isEvent = !!item.liveStream;
      return isEvent;
    });

    if (firstViewableEvent) {
      setLiveStreamEvent(firstViewableEvent.item);
    }
  }, [setLiveStreamEvent]);

  return { viewableItemsState, updateViewableItems };
};

export default useViewableItems;
