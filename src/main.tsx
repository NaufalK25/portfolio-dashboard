import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import LoginPage from './pages/LoginPage.js';
import RepoNamePage from './pages/RepoNamePage.jsx';
import RepoPage from './pages/RepoPage.jsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.min.css';

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
