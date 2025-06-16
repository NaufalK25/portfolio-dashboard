import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import { FileText, Folder, RefreshCw } from 'react-feather';
import { Link } from 'react-router-dom';
import StackUsedCountCharts from '../components/dashboard/StackUsedCountCharts';
import RepoTypeCharts from '../components/dashboard/RepoTypeCharts';
import useRepo from '../hooks/useRepo';
import useRepoName from '../hooks/useRepoName';
import DashboardLayout from '../layout/DashboardLayout';

dayjs.extend(relativeTime);

type Tab = 'Stack Used Count' | 'Repo Type';

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('Stack Used Count');

  const { repos } = useRepo(setIsLoading);
  const { reposName } = useRepoName(setIsLoading);

  return (
    <DashboardLayout>
      <p>Dashboard</p>

      <div className='flex flex-col md:flex-row justify-center gap-x-10 gap-y-4'>
        <div className='card w-full md:w-96 bg-primary text-primary-content'>
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

        <div className='card w-full md:w-96 bg-primary text-primary-content'>
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

      <div
        role='tablist'
        className='tabs tabs-bordered'
      >
        <a
          role='tab'
          className={`${
            activeTab === 'Stack Used Count' ? 'tab-active' : ''
          } tab`}
          onClick={() => setActiveTab('Stack Used Count')}
        >
          Stack Used Count
        </a>
        <a
          role='tab'
          className={`${activeTab === 'Repo Type' ? 'tab-active' : ''} tab`}
          onClick={() => setActiveTab('Repo Type')}
        >
          Repo Type
        </a>
      </div>

      {activeTab === 'Stack Used Count' ? <StackUsedCountCharts /> : null}
      {activeTab === 'Repo Type' ? <RepoTypeCharts /> : null}
    </DashboardLayout>
  );
};

export default DashboardPage;
