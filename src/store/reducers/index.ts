import { combineReducers } from 'redux';
import declarationReducer from './declarationReducer';
import folderReducer from './folderReducer';
import employerReducer from './employerReducer';

const rootReducer = combineReducers({
    declarationReducer,
    folderReducer,
    employerReducer
  });
  
  export default rootReducer;