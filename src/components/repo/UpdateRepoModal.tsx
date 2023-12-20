import { useRef, useState } from 'react';
import { Repo, RepoStack } from '../../types/repo';
import { allowedStacks } from '../../utils/constants';
import { createErrorToast, createSuccessToast } from '../../utils/toast';

type UpdateRepoModalProps = {
  repo: Repo;
};

const UpdateRepoModal = ({ repo }: UpdateRepoModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const stacksRef = useRef<HTMLInputElement | null>(null);

  let { stacks } = repo;

  if (typeof stacks === 'string') {
    stacks = stacks.split(', ') as RepoStack[];
  }

  const handleThumbnailPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.currentTarget;
    const parent = fileInput?.parentElement?.parentElement as HTMLDivElement;
    const file = fileInput.files ? fileInput.files[0] : null;
    setThumbnail(file);

    if (file) {
      const filePath = URL.createObjectURL(file);

      const template = parent.lastChild as SVGElement;
      parent.removeChild(template);

      const newImage = document.createElement('img');
      newImage.src = filePath;
      newImage.alt = 'display-tmp';
      newImage.style.width = '256px';
      newImage.style.height = '256px';
      parent.appendChild(newImage);
    }
  };

  const handleAddStacks = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      if (!allowedStacks.includes(e.currentTarget.value as RepoStack)) {
        return createErrorToast('Please choose from the available stack!');
      }

      if (stacksRef.current) {
        for (const stack of stacksRef.current.children) {
          if (e.currentTarget.value === stack.textContent?.replace(/^✕/, '')) {
            return createErrorToast('Stack already added!');
          }
        }
      }

      const badge = document.createElement('div');
      badge.classList.add(
        'badge',
        'badge-outline',
        'text-sm',
        'p-4',
        'flex',
        'items-center',
        'gap-x-1'
      );
      const removeButton = document.createElement('p');
      removeButton.classList.add('text-error', 'cursor-pointer');
      removeButton.textContent = '✕';
      removeButton.addEventListener('click', () => {
        if (stacksRef.current) {
          stacksRef.current.removeChild(badge);
        }
      });
      badge.appendChild(removeButton);
      const stack = document.createElement('p');
      stack.textContent = e.currentTarget.value;
      badge.appendChild(stack);
      if (stacksRef.current) {
        stacksRef.current.appendChild(badge);
      }
      e.currentTarget.value = '';
    }
  };

  const handleUpdateRepo = async () => {
    setIsLoading(true);

    const stacks = [];
    if (stacksRef.current) {
      for (const stackEl of stacksRef.current.children) {
        stacks.push(stackEl.lastChild ? stackEl.lastChild.textContent : '');
      }
    }

    const formData = new FormData();
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }
    formData.append('stacks', stacks.join(','));

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/repo/${repo.ghId}`,
      {
        method: 'PATCH',
        body: formData
      }
    );

    const { success, message } = await response.json();

    setIsLoading(false);
    (
      document.getElementById(
        `update_repo_modal_${repo.ghId}`
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
      id={`update_repo_modal_${repo.ghId}`}
      className='modal'
    >
      <div className='modal-box'>
        <h3 className='font-bold text-lg'>
          Update #{repo.ghId} - {repo.owner}/{repo.name}
        </h3>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
            ✕
          </button>

          <div className='flex flex-col md:flex-row gap-x-1'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>GitHub Id</span>
              </div>
              <input
                type='text'
                placeholder='GitHub Id'
                disabled
                defaultValue={repo.ghId}
                className='input input-bordered w-full max-w-xs'
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Type</span>
              </div>
              <select
                className='select select-bordered'
                disabled
              >
                <option selected={repo.type === 'User'}>User</option>
                <option selected={repo.type === 'Organization'}>
                  Organization
                </option>
              </select>
            </label>
          </div>

          <div className='flex flex-col md:flex-row gap-x-1'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Owner</span>
              </div>
              <input
                type='text'
                placeholder='Owner'
                disabled
                defaultValue={repo.owner}
                className='input input-bordered w-full max-w-xs'
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Repo Name</span>
              </div>
              <input
                type='text'
                placeholder='Repo Name'
                disabled
                defaultValue={repo.name}
                className='input input-bordered w-full max-w-xs'
              />
            </label>
          </div>

          <div className='flex flex-col md:flex-row gap-x-1'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Homepage</span>
              </div>
              <input
                type='text'
                placeholder='Homepage'
                disabled
                defaultValue={repo.homepage}
                className='input input-bordered w-full max-w-xs'
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>HTML Url</span>
              </div>
              <input
                type='text'
                placeholder='HTML Url'
                disabled
                defaultValue={repo.htmlUrl}
                className='input input-bordered w-full max-w-xs'
              />
            </label>
          </div>

          <div className='flex flex-col md:flex-row gap-x-1'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>License</span>
              </div>
              <input
                type='text'
                placeholder='License'
                disabled
                defaultValue={repo.licenseName}
                className='input input-bordered w-full max-w-xs'
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>License Url</span>
              </div>
              <input
                type='text'
                placeholder='License Url'
                disabled
                defaultValue={repo.licenseUrl}
                className='input input-bordered w-full max-w-xs'
              />
            </label>
          </div>

          <label className='form-control'>
            <div className='label'>
              <span className='label-text'>Description</span>
            </div>
            <textarea
              className='textarea textarea-bordered h-24 resize-none'
              placeholder='Description'
              disabled
              defaultValue={repo.description}
            ></textarea>
          </label>

          <label className='form-control w-full max-w-xs'>
            <div className='label'>
              <span className='label-text'>Created At</span>
            </div>
            <input
              type='datetime-local'
              placeholder='Created At'
              disabled
              defaultValue={repo.created_at.replace(/Z$/, '')}
              className='input input-bordered w-full max-w-xs'
            />
          </label>

          <div className='flex flex-col gap-y-2'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Thumbnail</span>
              </div>
              <input
                type='file'
                accept='.jpg, .jpeg, .png'
                className='file-input file-input-bordered w-full max-w-xs'
                onChange={e => handleThumbnailPreview(e)}
              />
            </label>

            <img
              src={repo.thumbnail}
              alt={repo.name}
              width='256px'
              height='256px'
            />
          </div>

          <label className='form-control w-full relative'>
            <div className='label'>
              <span className='label-text'>
                Stacks (Press Tab to add Stack)
              </span>
            </div>
            <input
              type='text'
              list='stacks'
              placeholder='Stacks'
              className='input input-bordered w-full max-w-xs'
              onKeyDown={e => handleAddStacks(e)}
            />

            <datalist id='stacks'>
              {allowedStacks.map(stack => (
                <option
                  key={stack}
                  value={stack}
                ></option>
              ))}
            </datalist>

            <kbd className='kbd absolute right-1 md:right-[8.5rem] top-11'>Tab</kbd>

            <div
              ref={stacksRef}
              className='grid grid-cols-3 place-items-center gap-2 mt-2'
            >
              {stacks.map(stack => (
                <div
                  className='badge badge-outline text-sm p-4 flex items-center gap-x-1'
                  key={stack}
                >
                  <p
                    className='text-error cursor-pointer'
                    onClick={e => {
                      const badge = e.currentTarget
                        .parentElement as HTMLDivElement;
                      const parent = badge?.parentElement as HTMLDivElement;
                      parent.removeChild(badge);
                    }}
                  >
                    ✕
                  </p>
                  <p>{stack}</p>
                </div>
              ))}
            </div>
          </label>

          <div className='flex gap-x-2 mt-4'>
            <div
              className={`${isLoading ? 'btn-disabled' : ''} btn btn-warning`}
              onClick={handleUpdateRepo}
            >
              {isLoading ? (
                <>
                  <span className='loading loading-spinner'></span>
                  <p>Loading...</p>
                </>
              ) : (
                <p>Update</p>
              )}
            </div>

            <button className='btn btn-outline'>Cancel</button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UpdateRepoModal;
