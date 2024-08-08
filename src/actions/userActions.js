export const loginSuccess = (username) => ({
    type: 'LOGIN_SUCCESS',
    payload: { username }
  });
  
  export const logout = () => ({
    type: 'LOGOUT'
  });
  