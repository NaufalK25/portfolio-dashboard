import { useState } from 'react';
import { FileText, Folder, Menu } from 'react-feather';
import { Link, NavLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleCloseSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
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
        <nav>
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
        </nav>
      </aside>

      <div className='lg:ml-64 p-4'>
        <header className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-semibold'>Dashboard</h1>
          <button
            className='lg:hidden px-2 py-1 text-white bg-black'
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
