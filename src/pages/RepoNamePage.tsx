import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { RefreshCw } from 'react-feather';
import DashboardDataTable from '../components/DashboardDataTable';
import useRepoName from '../hooks/useRepoName';
import DashboardLayout from '../layout/DashboardLayout';
import { RepoName } from '../types/repo';
import { createErrorToast, createSuccessToast } from '../utils/toast';

dayjs.extend(relativeTime);

const columns: TableColumn<RepoName>[] = [
  {
    name: 'GitHub Id',
    selector: row => row.ghId,
    sortable: true
  },
  {
    name: 'Name',
    selector: row => row.name,
    sortable: true
  },
  {
    name: 'Owner',
    selector: row => row.owner,
    sortable: true
  },
  {
    name: 'Type',
    selector: row => row.type,
    sortable: true
  }
];

const RepoNamePage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { reposName, syncReposName } = useRepoName(setIsLoading);

  const handleSyncReposName = async () => {
    setIsLoading(true);

    try {
      await syncReposName();
      createSuccessToast('Repos name sync successfully!');
    } catch (err) {
      createErrorToast('Repos name failed to sync!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className='flex gap-x-2 items-center'>
        <p className='text-lg'>Repo Name</p>

        <div
          className='tooltip tooltip-accent cursor-pointer'
          data-tip='Sync'
          onClick={handleSyncReposName}
        >
          <RefreshCw
            size={20}
            className='text-accent'
          />
        </div>

        {isLoading ? (
          <>
            <span className='loading loading-spinner'></span>
            <p className='text-lg'>Loading...</p>
          </>
        ) : (
          <p>
            Last sync {reposName ? dayjs().to(reposName[0]?.createdAt) : '-'}
          </p>
        )}
      </div>

      <DashboardDataTable<RepoName>
        columns={columns}
        data={reposName}
        pending={isLoading}
      />
    </DashboardLayout>
  );
};

export default RepoNamePage;
