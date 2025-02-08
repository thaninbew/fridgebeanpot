import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FridgePage from './pages/FridgePage';
import Inventory from './pages/Inventory';
import './App.css';
import Profile from './pages/Profile/Profile';
import Map from './pages/Explore/Map';
import Recs from './pages/Explore/Recs';

// Protected Route wrapper
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

// Auth Route wrapper (only redirects auth pages when logged in)
function AuthRoute({ children }) {
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
            path="/inventory"
            element={
              <PrivateRoute>
                <Inventory />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <AuthRoute>
                <Signup />
              </AuthRoute>
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

          <Route path="/map" element={<Map />} />
          <Route path="/explore" element={<Recs />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
