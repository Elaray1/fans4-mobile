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

const httpRequest = method => async (url, data, file) => {
  let urlWithSlash = url;

  if (urlWithSlash[0] !== '/') {
    urlWithSlash = `/${urlWithSlash}`;
  }

  const options = {
    method: method === 'postWithFile' ? 'post' : method,
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      'X-Application-ID': config.applicationId,
      'X-Language': i18n.language,
    },
    url: `${config.apiUrl}${urlWithSlash}`,
  };

  if (method === 'postWithFile') {
    options.headers['Content-Type'] = 'multipart/form-data';

    if (data) {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        formData.append(key, typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
      });

      // It's important to append file field after all other fields because
      // server parse request in appending order.
      // Thereby server can quickly parse simple fields and then
      // pass partially received file to third-party service(e.g. s3) as a stream
      formData.append('file', file);
      data = formData;
    }
  }

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
};

export const getRequest = httpRequest('get');
export const postRequest = httpRequest('post');
export const postWithFileRequest = httpRequest('postWithFile');
export const putRequest = httpRequest('put');
export const deleteRequest = httpRequest('delete');

const apiClient = {
  get: getRequest,
  post: postRequest,
  postWithFile: postWithFileRequest,
  put: putRequest,
  delete: deleteRequest,
};

export default apiClient;
