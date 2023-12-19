import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { createErrorToast, createSuccessToast } from '../utils/toast';
import { LogIn } from 'react-feather';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = window.localStorage.getItem('access_token');

    if (accessToken) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailRef.current?.value || '',
          password: passwordRef.current?.value || ''
        })
      }
    );
    const { success, message, data } = await response.json();

    if (!success) {
      const errorMessage = Array.isArray(message) ? message[0] : message;
      if (emailRef.current) {
        emailRef.current.value = '';
      }
      if (passwordRef.current) {
        passwordRef.current.value = '';
      }
      setIsLoading(false);
      return createErrorToast(errorMessage);
    }

    const { access_token } = data;

    window.localStorage.setItem('access_token', access_token);
    setIsLoading(false);
    navigate('/');
    setTimeout(() => {
      createSuccessToast(message);
    }, 1)
  };

  return (
    <>
      <ToastContainer />

      <div className='flex flex-col p-4 white items-center justify-center min-h-screen'>
        <div className='border border-white rounded-lg p-4 w-full md:w-96'>
          <p className='text-center text-2xl font-bold uppercase'>Login</p>
          <form
            method='POST'
            className='flex flex-col gap-4 items-center'
            onSubmit={e => handleLogin(e)}
          >
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Email</span>
              </div>
              <input
                type='email'
                placeholder='example@gmail.com'
                ref={emailRef}
                autoFocus
                required
                className='input input-bordered w-full max-w-xs'
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Password</span>
              </div>
              <input
                type='password'
                placeholder='******'
                ref={passwordRef}
                required
                className='input input-bordered w-full max-w-xs'
              />
            </label>
            <button
              className={`${
                isLoading ? 'btn-disabled' : ''
              } btn btn-primary w-full max-w-xs`}
              type='submit'
            >
              {isLoading ? (
                <>
                  <span className='loading loading-spinner'></span>
                  <p>Loading...</p>
                </>
              ) : (
                <>
                  <LogIn /> Login
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
