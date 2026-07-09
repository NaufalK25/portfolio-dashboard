import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from './useAuthContext';

const useAuth = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuthContext();

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken, navigate]);
};

export default useAuth;
