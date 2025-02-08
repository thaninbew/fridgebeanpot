import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FridgePage from './pages/FridgePage';
import Inventory from './pages/Inventory';
import './App.css';
import Map from './pages/Explore/Map';

// Protected Route wrapper
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

// Public Route wrapper (redirects to fridge if already authenticated)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return !user ? children : <Navigate to="/fridge" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/Inventory"
            element={
              <PublicRoute>
                <Inventory />
              </PublicRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/fridge"
            element={
              <PrivateRoute>
                <FridgePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/map"
            element={
              <PublicRoute>
                <Map />
              </PublicRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
