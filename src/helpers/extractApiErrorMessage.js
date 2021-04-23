import _get from 'lodash/get';

export default function extractApiErrorMessage(error) {
  const errors = _get(error, 'data.errors', {});
  return Object.values(errors).join('\n') || 'An error occurred';
}
