import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Home from './components/Home';
import NoMatch from './components/NoMatch';
import { AuthProvider } from './context/AuthContext';

function App() {

  return (
      <AuthProvider>       
        <Routes>

            <Route path='/' 
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            
            <Route path='/login' element={ <Login/> } />

            <Route path='*' element={<NoMatch />} />

        </Routes>
      </AuthProvider>

  )
}

export default App;
