import { combineReducers } from 'redux';

// Example reducer
const userReducer = (state = { username: '', isAuthenticated: false }, action) => {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        return { ...state, username: action.payload.username, isAuthenticated: true };
      case 'LOGOUT':
        return { ...state, username: '', isAuthenticated: false };
      default:
        return state;
    }
  };
  

const rootReducer = combineReducers({
  user: userReducer,
  // other reducers here
});

export default rootReducer;
