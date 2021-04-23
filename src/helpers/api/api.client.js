import axios from 'axios';

import config from 'resources/config';
import i18n from 'services/i18n.service';

import ApiError from './api.error';

// Do not throw errors on 'bad' server response codes
axios.interceptors.response.use(
  axiosConfig => axiosConfig,
  error => error.response || {},
);

export const generalError = {
  _global: [i18n.t('helpers.api.unexpectedErrorOccurred')],
};

export const throwApiError = ({ data = {}, status = 500 }) => {
  throw new ApiError(data, status);
};

const httpRequest = method => async (url, data) => {
  let urlWithSlash = url;

  if (urlWithSlash[0] !== '/') {
    urlWithSlash = `/${urlWithSlash}`;
  }
  const options = {
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      'X-Application-ID': config.applicationId,
      'X-Language': i18n.language,
    },
    method,
    url: `${config.apiUrl}${urlWithSlash}`,
  };

  if (data) {
    if (data.blob) {
      options.responseType = 'blob';
    }

    if (method === 'get') {
      options.params = data;
    } else {
      options.data = data;
    }
  }

  const response = await axios(options);
  if (!response) {
    throwApiError({
      data: { errors: generalError },
      status: 500,
    });
    return null;
  }

  response.data = response.data || {};
  response.status = response.status || 500;

  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  if (response.status === 400) {
    throwApiError(response);
  }

  response.data.errors = response.data.errors || generalError;
  throwApiError(response);
  return null;
};

export const getRequest = httpRequest('get');
export const postRequest = httpRequest('post');
export const putRequest = httpRequest('put');
export const deleteRequest = httpRequest('delete');

const apiClient = {
  get: getRequest,
  post: postRequest,
  put: putRequest,
  delete: deleteRequest,
};

export default apiClient;
