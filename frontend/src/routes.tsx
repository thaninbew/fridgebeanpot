import { Routes } from '@reactpwa/core';
import { PageLoader } from './components/page-loader';

const routes: Routes = [
  {
    path: '/',
    element: () => import('./components/shell'),
    children: [
      {
        path: '/',
        element: () => import('./components/hello'),
        skeleton: PageLoader,
      },
    ],
  },
];

export default routes;
