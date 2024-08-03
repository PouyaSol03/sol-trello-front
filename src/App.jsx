import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard/Dashboard';
// import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import {CollectionPage} from './components/Page/CollectionPage';
import { PrivateRoute } from './components/privateroute';
import { Taskmanage } from './pages/task/Taskmanage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Default route */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<PrivateRoute element={<Dashboard />} />} />
          <Route path='/collection/:collectionName' element={<PrivateRoute element={<CollectionPage />} />} />
          <Route path='/task-management' element={<Taskmanage />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
