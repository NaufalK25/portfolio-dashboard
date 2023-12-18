import { useState } from 'react';
import { Repo } from '../types/repo';
import { createErrorToast, createSuccessToast } from '../utils/toast';

type DeleteRepoModalProps = {
  repo: Repo;
};

const DeleteRepoModal = ({ repo }: DeleteRepoModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteRepo = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/repo/${repo.ghId}`,
      {
        method: 'DELETE'
      }
    );

    const { success, message } = await response.json();

    setIsLoading(false);
    (
      document.getElementById(
        `delete_repo_modal_${repo.ghId}`
      ) as HTMLDialogElement
    ).close();

    if (success) {
      createSuccessToast(message);
    } else {
      createErrorToast(Array.isArray(message) ? message[0] : message);
    }
  };

  return (
    <dialog
      id={`delete_repo_modal_${repo.ghId}`}
      className='modal'
    >
      <div className='modal-box'>
        <h3 className='font-bold text-lg'>
          Delete #{repo.ghId} - {repo.owner}/{repo.name}
        </h3>
        <p className='py-4'>Are you sure you want to delete this repo!</p>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
            ✕
          </button>

          <div className='flex gap-x-2 mt-4'>
            <div
              className={`${isLoading ? 'btn-disabled' : ''} btn btn-error`}
              onClick={handleDeleteRepo}
            >
              {isLoading ? (
                <>
                  <span className='loading loading-spinner'></span>
                  <p>Loading...</p>
                </>
              ) : (
                <p>Delete</p>
              )}
            </div>

            <button className='btn btn-outline'>Cancel</button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default DeleteRepoModal;
