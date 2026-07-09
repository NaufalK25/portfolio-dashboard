/* eslint-disable react-refresh/only-export-components -- router config, not a component module */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.js'));
const RepoNamePage = lazy(() => import('./pages/RepoNamePage.jsx'));
const RepoPage = lazy(() => import('./pages/RepoPage.jsx'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/repo',
    element: <RepoPage />
  },
  {
    path: '/repo-name',
    element: <RepoNamePage />
  }
]);

export default router;
