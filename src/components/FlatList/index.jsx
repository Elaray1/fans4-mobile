import React from 'react';
import { FlatList as ReactNativeFlatList } from 'react-native';

const FlatList = React.forwardRef((props, ref) => {
  return <ReactNativeFlatList ref={ref} {...props} removeClippedSubviews={false} />;
});

export default React.memo(FlatList);
