import { combineReducers } from "redux";
import authReducer from "./auth";
import { reducer as formReducer } from "redux-form";
import projectsReducer from './projects'
import tasksReducer from './tasks';

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  projectsReducer,
  tasksReducer,
});
