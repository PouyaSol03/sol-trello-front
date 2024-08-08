/* eslint-disable react/prop-types */
// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ element }) => {
//   const authData = localStorage.getItem('authData');
//   return authData ? element : <Navigate to="/login" />;
// };

// export { PrivateRoute };



import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element, restrictedPages }) => {
  const { username } = useSelector((state) => ({
    // isAuthenticated: state.user.isAuthenticated,
    username: state.user.username,
  }));

  // Check if the user is trying to access a restricted page
  const isRestricted = restrictedPages.includes(window.location.pathname);

  // Handle redirection based on authentication and page restriction
  // if (!isAuthenticated) {
  //   return <Navigate to="/" />;
  // }

  if (username === 'bonito' && isRestricted) {
    return <Navigate to="/bonito" />;
  }

  return element;
};

export default PrivateRoute;
