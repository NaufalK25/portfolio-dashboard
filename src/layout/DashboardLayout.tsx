import { useState } from 'react';
import { FileText, Folder, LogOut, Menu } from 'react-feather';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import { createSuccessToast } from '../utils/toast';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleCloseSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('access_token');
    navigate('/login');
    setTimeout(() => {
      createSuccessToast('Logged out successfully!');
    }, 1);
  };

  return (
    <>
      <ToastContainer />

      <aside
        className={`${
          isSidebarOpen ? 'flex' : 'hidden'
        } md:flex flex-col bg-gray-800 text-white w-64 h-screen fixed top-0 left-0 overflow-y-auto z-10`}
      >
        <div className='p-4'>
          <Link
            to='/'
            onClick={handleCloseSidebar}
            className='text-2xl font-semibold'
          >
            Dashboard
          </Link>
        </div>
        <nav className='flex flex-col justify-between h-screen'>
          <ul className='p-4'>
            <li className='p-4 link link-hover w-fit'>
              <NavLink
                to='/repo'
                className='flex items-center gap-x-1'
                onClick={handleCloseSidebar}
              >
                <Folder size={20} /> Repo
              </NavLink>
            </li>
            <li className='p-4 link link-hover w-fit'>
              <NavLink
                to='/repo-name'
                className='flex items-center gap-x-1'
                onClick={handleCloseSidebar}
              >
                <FileText size={20} /> Repo Name
              </NavLink>
            </li>
          </ul>
          <ul className='p-4'>
            <li className='p-4 btn btn-ghost w-full'>
              <button
                className='flex items-center gap-x-1 uppercase'
                onClick={handleLogout}
              >
                <LogOut size={20} /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className='lg:ml-64 p-4'>
        <header className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-semibold'>Dashboard</h1>
          <button
            className='lg:hidden px-2 py-1 text-white bg-black fixed z-20 right-2'
            onClick={handleToggleSidebar}
          >
            <Menu />
          </button>
        </header>

        <div className='flex flex-col gap-2'>{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
