import { createRoot } from 'react-dom/client';
import { App } from '@reactpwa/core';
import { AuthProvider } from './contexts/AuthContext';
import routes from './routes';
import './resources/styles.scss';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <AuthProvider>
    <App routes={routes} />
  </AuthProvider>
); 