import React from 'react';
import { FlatList as ReactNativeFlatList } from 'react-native';

const FlatList = (props) => {
  return <ReactNativeFlatList {...props} removeClippedSubviews={false} />;
};

export default React.memo(FlatList);
