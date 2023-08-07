import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import authRoutes from '../../routes/authRoutes';

type Props = {
  children: React.ReactNode;
};

const AuthWrapper: React.FC<Props> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(authRoutes.checkSession, { withCredentials: true })
      .then(res => {
        if (res.status === 200) {
          setIsLoading(false);
        }
      })
      .catch(() => {
        navigate('/auth/login');
      });
  }, [navigate]);

  if (isLoading) {
    return <ProgressSpinner />;
  }

  return <>{children}</>;
};

export default AuthWrapper;