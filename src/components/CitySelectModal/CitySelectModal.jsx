import PropTypes from 'prop-types';
import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import {
  View,
  Modal,
  Pressable,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import debounce from 'lodash.debounce';
import { useTranslation } from 'react-i18next';

import Text from 'components/Text';
import SearchInput from 'components/SearchInput';

import TickIcon from 'assets/icons/tick.svg';

import * as cityActions from 'resources/city/city.actions';

import colors from 'themes/colors';

import styles from './CitySelectModal.styles';

const INITIAL_PAGE = 1;
const PER_PAGE = 25;

function CitySelectModal({
  cityId, onClose, onSubmit, visible,
}) {
  const { t } = useTranslation();

  const [selectedCityId, setSelectedCityId] = useState(cityId);
  const [cities, setCities] = useState([]);

  const [page, setPage] = useState(INITIAL_PAGE);
  const [isAllCitiesLoaded, setIsAllCitiesLoaded] = useState(false);

  const [search, setSearch] = useState('');

  const debounced = useRef(debounce(async (searchValue) => {
    const searchCities = await cityActions.getCities({
      page: INITIAL_PAGE,
      perPage: PER_PAGE,
      search: searchValue,
    });
    if (searchCities.length < PER_PAGE) {
      setIsAllCitiesLoaded(true);
    } else {
      setIsAllCitiesLoaded(false);
    }
    setCities(searchCities);
    setPage(INITIAL_PAGE + 1);
  }, 500, { leading: false, trailing: true }));

  useEffect(() => {
    const initialSearch = async () => {
      debounced.current(search);
    };
    initialSearch();
  }, [search]);

  const renderItem = ({ item }) => {
    const isSelected = item._id === selectedCityId;
    const selectItem = () => {
      setSelectedCityId(item._id);
      onSubmit({
        cityNameWithState: `${item.cityName}, ${item.stateCode}`,
        cityId: item._id,
      });
    };
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={selectItem}
      >
        <View style={styles.listItem}>
          <Text style={styles.listItemCity}>{`${item.cityName}, ${item.stateCode}`}</Text>
          {isSelected && <TickIcon />}
        </View>
      </TouchableOpacity>
    );
  };

  const renderItemSeparator = () => <View style={styles.line} />;

  const keyExtractor = useCallback(item => item._id, []);

  const renderFooter = () => {
    if (isAllCitiesLoaded) {
      return null;
    }
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  const clearSearchInput = useCallback(() => {
    setSearch('');
  }, []);

  const renderEmptyComponent = () => {
    return (
      <View style={styles.emptyWrapper}>
        <Text style={styles.emptyText}>{t('CitySelectModal.noSearchResults')}</Text>
        <TouchableOpacity onPress={clearSearchInput} activeOpacity={0.7}>
          <Text style={styles.headerCancel}>{t('CitySelectModal.showFullList')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const fetchMoreCities = useCallback(async () => {
    if (page !== INITIAL_PAGE) {
      const newCities = await cityActions.getCities({ page, perPage: PER_PAGE, search });
      if (newCities.length < PER_PAGE) {
        setIsAllCitiesLoaded(true);
      } else {
        setIsAllCitiesLoaded(false);
      }
      setCities([...cities, ...newCities]);
    }
  }, [cities, page, search]);

  const handleLoadMore = useCallback(async () => {
    setPage(page + 1);
    await fetchMoreCities();
  }, [fetchMoreCities, page]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.background} onPress={onClose} />
      <View style={styles.modal}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.headerCancel}>{t('CitySelectModal.cancel')}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('CitySelectModal.selectHometown')}</Text>
          <View style={styles.headerEmptyBlock} />
        </View>
        <View style={styles.searchWrapper}>
          <SearchInput
            value={search}
            onChangeText={setSearch}
            placeholder={t('CitySelectModal.search')}
          />
        </View>
        <FlatList
          data={cities}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={renderItemSeparator}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          initialNumToRender={25}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyComponent}
        />
      </View>
    </Modal>
  );
}

CitySelectModal.propTypes = {
  cityId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

CitySelectModal.defaultProps = {
  cityId: null,
};

export default React.memo(CitySelectModal);
