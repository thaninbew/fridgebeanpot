import { Outlet } from '@reactpwa/core';
import { FC } from 'react';

const Shell: FC = () => (
  <div>
    <h1>Welcome to ReactPWA</h1>
    <Outlet />
  </div>
);

export default Shell;
