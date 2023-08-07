import { Outlet } from 'react-router-dom';

import Navbar from './navbar/Navbar';
import AuthWrapper from '../../pages/auth/AuthWrapper';
import { Suspense } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const Layout = () => {
  return (
    <div className='layout-wrapper'>
      <AuthWrapper>
        <Navbar />
        <div className='layout-content'>
          <Suspense fallback={<ProgressSpinner />}>
            <Outlet />
          </Suspense>
        </div>
      </AuthWrapper>
    </div>
  );
};

export default Layout;