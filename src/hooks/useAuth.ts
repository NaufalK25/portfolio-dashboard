import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = window.localStorage.getItem('access_token');

    if (!accessToken) {
      navigate('/login');
    }
  }, [navigate]);
};

export default useAuth;
