import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { CollectionPage } from './components/Page/CollectionPage';
import { Taskmanage } from './pages/task/Taskmanage';
import { JustBonito } from './pages/JustBonito/JustBonito';
import PrivateRoute from './components/privateroute';

function App() {
  const { username } = useSelector((state) => ({
    username: state.user.username,
    // isAuthenticated: state.user.isAuthenticated,
  }));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Use PrivateRoute to protect the following routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              element={<Dashboard />}
              // isAuthenticated={isAuthenticated}
              username={username}
              restrictedPages={['/bonito', '/bonito/:collectionName']}
            />
          }
        />
        <Route
          path="/collection/:collectionName"
          element={
            <PrivateRoute
              element={<CollectionPage />}
              // isAuthenticated={isAuthenticated}
              username={username}
              restrictedPages={['/bonito', '/bonito/:collectionName']}
            />
          }
        />
        <Route
          path="/task-management"
          element={
            <PrivateRoute
              element={<Taskmanage />}
              // isAuthenticated={isAuthenticated}
              username={username}
              restrictedPages={['/bonito', '/bonito/:collectionName']}
            />
          }
        />
        <Route
          path="/bonito"
          element={
            <PrivateRoute
              element={<JustBonito />}
              // isAuthenticated={isAuthenticated}
              username={username}
              restrictedPages={[]}
            />
          }
        />
        <Route
          path="/bonito/:collectionName"
          element={
            <PrivateRoute
              element={<JustBonito />}
              // isAuthenticated={isAuthenticated}
              username={username}
              restrictedPages={[]}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
