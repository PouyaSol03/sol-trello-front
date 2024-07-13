import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { PrivateRoute } from './components/privateroute';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/dashboard' element={<PrivateRoute element={<Dashboard />} />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
