import fetch from 'isomorphic-fetch';

// export const API_URL = (typeof window === 'undefined' || process.env.NODE_ENV === 'test') ?
//   process.env.BASE_URL || (`http://localhost:8000/api`) :
//   '/api';

export const API_URL = 'http://localhost:8000/api';

export default function callApi(endpoint, method = 'get', body) {
  return fetch(`${endpoint}`, {
    headers: { 'content-type': 'application/json' },
    method,
    body: JSON.stringify(body),
  })
  .then(response => response.json().then(json => ({ json, response })))
  .then(({ json, response }) => {
    if (!response.ok) {
      return Promise.reject(json);
    }

    return json;
  })
  .then(
    response => response,
    error => error
  );
}
