import * as api from './city.api';

export const getCities = async ({ page, perPage, search }) => {
  const cities = await api.getCities({ page, perPage, search });
  return cities;
};
