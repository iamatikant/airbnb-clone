import { createStore, combineReducers } from "redux";
import userReducer from "./reducers/userReducer";
import { bookingReducer } from "./reducers/bookingReducer";

const reducers = combineReducers({
  user: userReducer,
  booking: bookingReducer,
});

const store = createStore(reducers);

export default store;

/***
 *
 *
 * create store
 * create reducer
 * wrap provider on top of the app and pass store as value
 * create action to call the reducer
 * call reducer from the actions
 * update states from reducer
 */
