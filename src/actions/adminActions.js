import * as types from '../constants/actionTypes';
import callApi, { API_URL } from '../reducers/apiCaller';


export function getDir(dir) {
    return {
      type: types.GET_DIR,
      dir
    };
  }
  
export function onLoadDir() {
  return (dispatch) => {
    const url = API_URL + '/dir';
    
    return callApi(url).then((res, err) => {
      dispatch(getDir(res));
    });
  };
}

export function savedData(json) {
  return {
    type: types.SAVE_DATA,
    json
  };
}

export function onGetData() {
  return (dispatch) => {
    const url = API_URL + '/get';
    return callApi(url).then((res, err) => {
      dispatch(savedData(res));
      return res;
    });
  };
}

export function onSaveData(data) {
  return (dispatch) => {
    const url = API_URL + '/save';
    return callApi(url, 'post', data).then((res, err) => {
      dispatch(savedData(res));
      return res;
    });
  };
}

export function saveData(data) {
  const url = API_URL + '/save';
  return callApi(url, 'post', data).then((res, err) => {
    return res;
  });
}

export function getAll() {
  const json_url = API_URL + '/get';
  var jsonPromise = callApi(json_url);

  const dir_url = API_URL + '/dir';
    
  var dirPromise = callApi(dir_url);

  return Promise.all([jsonPromise, dirPromise]).then(
    response => response
  );
}

