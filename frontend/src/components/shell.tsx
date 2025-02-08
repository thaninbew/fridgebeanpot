import { Outlet, Link } from '@reactpwa/core';
import { FC } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Shell: FC = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        {user ? (
          <button 
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              color: '#0066cc',
              cursor: 'pointer',
              padding: 0,
              font: 'inherit'
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </nav>
      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Shell;
