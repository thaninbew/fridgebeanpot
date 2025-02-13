import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StorageProvider } from './contexts/StorageContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FridgePage from './pages/FridgePage';
import Inventory from './pages/Inventory';
import ClaimPage from './pages/Claim/ClaimPage';
import './App.css';
import Profile from './pages/Profile/Profile';
import Map from './pages/Explore/Map';
import Recs from './pages/Explore/Recs';
import PrizePage from './pages/PrizePage/PrizePage';
import LoadingPage from './pages/Loading/LoadingPage';

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
        <StorageProvider>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/claim"
              element={
                <PrivateRoute>
                  <ClaimPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/PrizePage"
              element={
                <PrivateRoute>
                  <PrizePage />
                </PrivateRoute>
              }
            />

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
            <Route path="/loading" element={<LoadingPage />} />
          </Routes>
        </StorageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
