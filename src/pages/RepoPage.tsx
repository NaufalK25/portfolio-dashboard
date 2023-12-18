import { useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import {
  Edit,
  ExternalLink,
  FolderPlus,
  GitHub,
  Image,
  RotateCw,
  Trash2,
  User,
  Users
} from 'react-feather';
import { Link } from 'react-router-dom';
import CreateRepoModal from '../components/CreateRepoModal';
import DashboardDataTable from '../components/DashboardDataTable';
import DeleteRepoModal from '../components/DeleteRepoModal';
import PreviewRepoModal from '../components/PreviewRepoModal';
import UpdateRepoModal from '../components/UpdateRepoModal';
import useRepo from '../hooks/useRepo';
import DashboardLayout from '../layout/DashboardLayout';
import { Repo, RepoStack } from '../types/repo';

const columns: TableColumn<Repo>[] = [
  {
    name: 'GitHub Id',
    selector: row => row.ghId,
    sortable: true
  },
  {
    name: 'Thumbnail',
    cell(row) {
      return (
        <img
          src={row.thumbnail}
          alt={row.name}
        />
      );
    }
  },
  {
    name: 'Name',
    cell(row) {
      return (
        <div className='flex items-center gap-x-1'>
          {row.type === 'User' ? <User /> : <Users />}
          {row.owner}/{row.name}
        </div>
      );
    },
    selector: row => `${row.owner}/${row.name}`,
    sortable: true
  },
  {
    name: 'Website',
    cell(row) {
      return row.homepage ? (
        <Link
          to={row.homepage}
          className='link link-hover'
          target='_blank'
          rel='noopener noreferrer'
        >
          <div className='flex items-center gap-x-1'>
            <ExternalLink size={20} />
            <p className='font-bold'>Homepage</p>
          </div>
        </Link>
      ) : null;
    }
  },
  {
    name: 'GitHub',
    cell(row) {
      return (
        <Link
          to={row.htmlUrl}
          className='link link-hover'
          target='_blank'
          rel='noopener noreferrer'
        >
          <div className='flex items-center gap-x-1'>
            <GitHub size={20} />
            <p className='font-bold'>Repository</p>
          </div>
        </Link>
      );
    }
  },
  {
    name: 'Action',
    cell(row) {
      return (
        <>
          <PreviewRepoModal repo={row} />
          <UpdateRepoModal repo={row} />
          <DeleteRepoModal repo={row} />

          <div className='flex gap-x-2'>
            <div
              className='tooltip tooltip-info cursor-pointer'
              data-tip='Preview'
              onClick={() => {
                (
                  document.getElementById(
                    `preview_repo_modal_${row.ghId}`
                  ) as HTMLDialogElement
                ).showModal();
              }}
            >
              <Image
                size={20}
                className='text-info'
              />
            </div>
            <div
              className='tooltip tooltip-warning cursor-pointer'
              data-tip='Update'
              onClick={() => {
                (
                  document.getElementById(
                    `update_repo_modal_${row.ghId}`
                  ) as HTMLDialogElement
                ).showModal();
              }}
            >
              <Edit
                size={20}
                className='text-warning'
              />
            </div>
            <div
              className='tooltip tooltip-error cursor-pointer'
              data-tip='Delete'
              onClick={() => {
                (
                  document.getElementById(
                    `delete_repo_modal_${row.ghId}`
                  ) as HTMLDialogElement
                ).showModal();
              }}
            >
              <Trash2
                size={20}
                className='text-error'
              />
            </div>
          </div>
        </>
      );
    }
  }
];

const RepoPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { repos, updateRepos } = useRepo(setIsLoading);

  return (
    <>
      <CreateRepoModal />

      <DashboardLayout>
        <div className='flex gap-x-2 items-center'>
          <p className='text-lg'>Repo</p>

          <div
            className='tooltip tooltip-success cursor-pointer'
            data-tip='Create'
            onClick={() =>
              (
                document.getElementById(
                  'create_repo_modal'
                ) as HTMLDialogElement
              ).showModal()
            }
          >
            <FolderPlus
              size={20}
              className='text-success'
            />
          </div>
          <div
            className='tooltip cursor-pointer'
            data-tip='Refresh'
            onClick={async () => await updateRepos()}
          >
            <RotateCw size={20} />
          </div>

          {isLoading ? (
            <>
              <span className='loading loading-spinner'></span>
              <p className='text-lg'>Loading...</p>
            </>
          ) : null}
        </div>

        <DashboardDataTable<Repo>
          columns={columns}
          data={repos.map(repo => {
            return {
              ...repo,
              stacks: Array.isArray(repo.stacks)
                ? (repo.stacks.join(', ') as RepoStack)
                : repo.stacks
            } satisfies Repo;
          })}
          pending={isLoading}
        />
      </DashboardLayout>
    </>
  );
};

export default RepoPage;
