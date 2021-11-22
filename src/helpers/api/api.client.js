import axios from 'axios';
import { Platform } from 'react-native';

// react-native-background-upload with version (github:cristianoccazinspd) not working for android
import backgroundUploaderIOS from 'react-native-background-upload';
import backgroundUploaderAndroid from 'react-native-background-upload-android';

import config from 'resources/config';
import i18n from 'services/i18n.service';

import { MEDIA_UPLOADING_STATUSES } from 'helpers/constants';

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
      'X-OS': Platform.OS,
    },
    url: `${config.apiUrl}${urlWithSlash}`,
  };

  if (method === 'postWithFile') {
    options.headers['Content-Type'] = 'multipart/form-data';

    if (data) {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key] = `[${data[key].toString()}]`;
        }

        formData.append(key, data[key]);
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

const postWithFileInBackgroundRequest = async (url, data, file, { onUploadProgress }) => {
  const backgroundUploader = Platform.OS === 'ios' ? backgroundUploaderIOS : backgroundUploaderAndroid;
  let urlWithSlash = url;

  if (urlWithSlash[0] !== '/') {
    urlWithSlash = `/${urlWithSlash}`;
  }

  const options = {
    type: 'multipart',
    url: `${config.apiUrl}${urlWithSlash}`,
    path: file.uri,
    method: 'POST',
    maxRetries: 0,
    field: file.name,
    parameters: data,
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      'X-Application-ID': config.applicationId,
      'X-Language': i18n.language,
    },
  };

  const handlerUploadError = (event) => {
    if (onUploadProgress) {
      onUploadProgress({ id: event.id, data, file, status: MEDIA_UPLOADING_STATUSES.ERROR });
    }

    console.error(`Error: ${event.error}`);
  };

  return backgroundUploader.startUpload(options).then((uploadId) => {
    backgroundUploader.addListener('progress', uploadId, (event) => {
      if (onUploadProgress) {
        onUploadProgress({
          id: event.id,
          data,
          file,
          progress: event.progress,
          status: MEDIA_UPLOADING_STATUSES.UPLOADING,
        });
      }
    });

    backgroundUploader.addListener('error', uploadId, (event) => {
      handlerUploadError(event);
    });

    backgroundUploader.addListener('cancelled', uploadId, (event) => {
      handlerUploadError(event);
    });


    backgroundUploader.addListener('completed', uploadId, (event) => {
      if (event.responseCode !== 200) {
        handlerUploadError(event);
        return;
      }

      if (onUploadProgress) {
        onUploadProgress({ id: event.id, data, file, status: MEDIA_UPLOADING_STATUSES.COMPLETED });
      }
    });
  }).catch((err) => {
    console.log('Upload error!', err);
  });
};

const apiClient = {
  get: getRequest,
  post: postRequest,
  postWithFile: postWithFileRequest,
  postWithFileInBackground: postWithFileInBackgroundRequest,
  put: putRequest,
  delete: deleteRequest,
};

export default apiClient;
