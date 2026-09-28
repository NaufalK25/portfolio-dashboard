export const UNAUTHORIZED_EVENT = 'auth:unauthorized';

const authFetch = async (url: string, init: RequestInit = {}) => {
  const headers = new Headers(init.headers);
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(url, { ...init, headers });

  if (response.status === 401) {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }

  return response;
};

export default authFetch;
