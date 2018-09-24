// Import Actions
import * as types from '../constants/actionTypes';

// Initial State
const initialState = {
  load: false,
};

const AdminReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_DIR:
      return {
        ...state,
        load:true,
        dirList: action.dir,
      };
    case types.SAVE_DATA:
      return {
        ...state,
        load:true,
        json: action.json,
      };
    default:
      return state;
  }
};

/* Selectors */

// Export Reducer
export default AdminReducer;
