// Set up your root reducer here...
 import { combineReducers } from 'redux';
 import AdminReducer from './AdminReducer';

 const rootReducer = combineReducers({
    AdminReducer,
  });
  
  export default rootReducer;