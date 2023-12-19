import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import useRepo from '../hooks/useRepo';
import useRepoName from '../hooks/useRepoName';
import DashboardLayout from '../layout/DashboardLayout';
import { FileText, Folder, RefreshCw } from 'react-feather';
import { Link } from 'react-router-dom';

dayjs.extend(relativeTime);

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { repos } = useRepo(setIsLoading);
  const { reposName } = useRepoName(setIsLoading);

  return (
    <DashboardLayout>
      <p>Dashboard</p>

      <div className='flex gap-2'>
        <div className='card w-96 bg-primary text-primary-content'>
          <div className='card-body'>
            <h2 className='card-title'>Repo</h2>
            <p>List of repository that will be shown in portfolio website</p>
            <div className='card-actions justify-end'>
              <Link
                to='/repo'
                className='btn'
              >
                {isLoading ? (
                  <>
                    <span className='loading loading-spinner'></span>0
                  </>
                ) : (
                  <>
                    <Folder />
                    <p className='text-lg'>{repos.length}</p>
                  </>
                )}
              </Link>
            </div>
          </div>
        </div>

        <div className='card w-96 bg-primary text-primary-content'>
          <div className='card-body'>
            <h2 className='card-title'>Repo Name</h2>
            <p>List of repository name from GitHub user and organization(s)</p>
            <div className='flex items-center gap-x-1'>
              <RefreshCw
                size={12}
                color='white'
              />
              <p className='text-sm text-white italic'>
                Last sync{' '}
                {reposName ? dayjs().to(reposName[0]?.createdAt) : '-'}
              </p>
            </div>
            <div className='card-actions justify-end'>
              <Link
                to='/repo-name'
                className='btn'
              >
                {isLoading ? (
                  <>
                    <span className='loading loading-spinner'></span>0
                  </>
                ) : (
                  <>
                    <FileText />
                    <p className='text-lg'>{reposName.length}</p>
                  </>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
