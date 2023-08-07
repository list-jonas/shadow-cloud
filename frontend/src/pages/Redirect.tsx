import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface RedirectOptions {
  url: string
}

const Redirect: React.FC<RedirectOptions> = (options) => {
  const { url } = options;
  const navigate = useNavigate();

  useEffect(() => {
    navigate(url)
  }, [])

  return (
    <div className='card flex justify-content-center'>
      <ProgressSpinner />
    </div>
  );
};

export default Redirect;