import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { ITEM_TYPES } from 'components/Header/Header.constants';

import Text from 'components/Text';
import Icon from './components/Icon';

const WIDTH_ICON = 32;

export const getHeaderItem = ({ type, props, text }) => {
  let item = null;
  const defaultItem = <View style={{ width: WIDTH_ICON }} />;

  switch (type) {
    case ITEM_TYPES.BACK_ARROW:
    case ITEM_TYPES.MENU:
      item = <Icon {...props} type={type} />;
      break;
    case ITEM_TYPES.TEXT:
      item = (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={props.onPress}
        >
          <Text style={props.style}>{text}</Text>
        </TouchableOpacity>
      );
      break;
    default:
      item = defaultItem;
      break;
  }

  return item;
};
