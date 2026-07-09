import { useEffect, useRef, useState } from 'react';
import { LogIn } from 'react-feather';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import useAuthContext from '../hooks/useAuthContext';
import { createErrorToast, createSuccessToast } from '../utils/toast';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const captchaRef = useRef<ReCAPTCHA>(null);

  const navigate = useNavigate();
  const { accessToken, login } = useAuthContext();

  useEffect(() => {
    if (accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  const verifyUser = async () => {
    const token = captchaRef.current?.getValue();

    captchaRef.current?.reset();

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/auth/verify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      }
    );
    const { data } = await response.json();
    const { success }: { success: boolean } = data;

    return success;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const isVerified = await verifyUser();

    if (!isVerified) {
      setIsLoading(false);
      return createErrorToast('Please check the captcha for verification!');
    }

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

    login(access_token);
    setIsLoading(false);
    navigate('/');
    setTimeout(() => {
      createSuccessToast(message);
    }, 1);
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
            <fieldset className='fieldset w-full max-w-xs'>
              <legend className='fieldset-legend'>Email</legend>
              <input
                type='email'
                placeholder='example@gmail.com'
                ref={emailRef}
                autoFocus
                required
                className='input w-full max-w-xs'
              />
            </fieldset>
            <fieldset className='fieldset w-full max-w-xs'>
              <legend className='fieldset-legend'>Password</legend>
              <input
                type='password'
                placeholder='******'
                ref={passwordRef}
                required
                autoComplete='false'
                className='input w-full max-w-xs'
              />
            </fieldset>

            <ReCAPTCHA
              ref={captchaRef}
              sitekey={import.meta.env.VITE_GOOGLE_SITE_KEY}
              size='normal'
              theme='dark'
            />

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
