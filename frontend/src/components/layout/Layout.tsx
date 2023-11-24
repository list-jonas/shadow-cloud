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
          <Suspense fallback={
            <div style={{position: "absolute", top: 0, left: 0, display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw"}}>
              <ProgressSpinner />
            </div>
          }>
            <Outlet />
          </Suspense>
        </div>
      </AuthWrapper>
    </div>
  );
};

export default Layout;