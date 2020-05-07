import { combineReducers } from "redux";
import declarationReducer from "./declarationReducer";
import folderReducer from "./folderReducer";
import employerReducer from "./employerReducer";
import authReducer from "./authReducer";

const rootReducer = combineReducers({
  declarationReducer,
  folderReducer,
  employerReducer,
  authReducer,
});

export default rootReducer;
