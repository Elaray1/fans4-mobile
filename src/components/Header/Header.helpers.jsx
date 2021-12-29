import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

import { ITEM_TYPES } from 'components/Header/Header.constants';

import PlusIcon from 'assets/icons/big-plus';

import Text from 'components/Text';
import Icon from './components/Icon';

import styles from './Header.styles';

const WIDTH_ICON = 32;

export const GetHeaderItem = ({ type, props, text, icon }) => {
  let item = null;
  const defaultItem = <View style={{ width: WIDTH_ICON }} />;

  const imageSource = useMemo(() => ({ uri: props.imageUrl }), [props.imageUrl]);

  switch (type) {
    case ITEM_TYPES.BACK_ARROW:
    case ITEM_TYPES.MENU:
    case ITEM_TYPES.ICON:
    case ITEM_TYPES.DOTS:
    case ITEM_TYPES.CLOSE:
      item = <Icon {...props} type={type} icon={icon} />;
      break;
    case ITEM_TYPES.TEXT:
      item = (
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={!props.onPress}
          onPress={props.onPress}
        >
          <Text style={[styles.text, props.style]}>{text}</Text>
        </TouchableOpacity>
      );
      break;
    case ITEM_TYPES.PLUS_AND_TEXT:
      item = (
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={!props.onPress}
          onPress={props.onPress}
          style={styles.plusButton}
        >
          <PlusIcon />
          <Text style={[styles.plusText, props.style]}>{text}</Text>
        </TouchableOpacity>
      );
      break;
    case ITEM_TYPES.IMAGE:
      item = (
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={!props.onPress}
          onPress={props.onPress}
        >
          <FastImage
            style={styles.image}
            source={imageSource}
          />
        </TouchableOpacity>
      );
      break;
    default:
      item = defaultItem;
      break;
  }

  return item;
};
