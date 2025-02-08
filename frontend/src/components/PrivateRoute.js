import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// private route leads to the dashboard if the user is logged in
export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
} 