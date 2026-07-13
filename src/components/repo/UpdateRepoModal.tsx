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
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
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
            <fieldset className='fieldset w-full max-w-xs'>
              <legend className='fieldset-legend'>GitHub Id</legend>
              <input
                type='text'
                placeholder='GitHub Id'
                disabled
                defaultValue={repo.ghId}
                className='input w-full max-w-xs'
              />
            </fieldset>
            <fieldset className='fieldset w-full max-w-xs'>
              <legend className='fieldset-legend'>Type</legend>
              <select
                className='select'
                defaultValue={repo.type}
                disabled
              >
                <option value='User'>User</option>
                <option value='Organization'>Organization</option>
              </select>
            </fieldset>
          </div>

          <div className='flex flex-col md:flex-row gap-x-1'>
            <fieldset className='fieldset w-full max-w-xs'>
              <legend className='fieldset-legend'>Owner</legend>
              <input
                type='text'
                placeholder='Owner'
                disabled
                defaultValue={repo.owner}
                className='input w-full max-w-xs'
              />
            </fieldset>
            <fieldset className='fieldset w-full max-w-xs'>
              <legend className='fieldset-legend'>Repo Name</legend>
              <input
                type='text'
                placeholder='Repo Name'
                disabled
                defaultValue={repo.name}
                className='input w-full max-w-xs'
              />
            </fieldset>
          </div>

          <div className='flex flex-col md:flex-row gap-x-1'>
            <fieldset className='fieldset w-full max-w-xs'>
              <legend className='fieldset-legend'>Homepage</legend>
              <input
                type='text'
                placeholder='Homepage'
                disabled
                defaultValue={repo.homepage}
                className='input w-full max-w-xs'
              />
            </fieldset>
            <fieldset className='fieldset w-full max-w-xs'>
              <legend className='fieldset-legend'>HTML Url</legend>
              <input
                type='text'
                placeholder='HTML Url'
                disabled
                defaultValue={repo.htmlUrl}
                className='input w-full max-w-xs'
              />
            </fieldset>
          </div>

          <div className='flex flex-col md:flex-row gap-x-1'>
            <fieldset className='fieldset w-full max-w-xs'>
              <legend className='fieldset-legend'>License</legend>
              <input
                type='text'
                placeholder='License'
                disabled
                defaultValue={repo.licenseName}
                className='input w-full max-w-xs'
              />
            </fieldset>
            <fieldset className='fieldset w-full max-w-xs'>
              <legend className='fieldset-legend'>License Url</legend>
              <input
                type='text'
                placeholder='License Url'
                disabled
                defaultValue={repo.licenseUrl}
                className='input w-full max-w-xs'
              />
            </fieldset>
          </div>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>Description</legend>
            <textarea
              className='textarea h-24 resize-none'
              placeholder='Description'
              disabled
              defaultValue={repo.description}
            ></textarea>
          </fieldset>

          <fieldset className='fieldset w-full max-w-xs'>
            <legend className='fieldset-legend'>Created At</legend>
            <input
              type='datetime-local'
              placeholder='Created At'
              disabled
              defaultValue={repo.created_at.replace(/Z$/, '')}
              className='input w-full max-w-xs'
            />
          </fieldset>

          <div className='flex flex-col gap-y-2'>
            <fieldset className='fieldset w-full max-w-xs'>
              <legend className='fieldset-legend'>Thumbnail</legend>
              <input
                type='file'
                accept='.jpg, .jpeg, .png'
                className='file-input w-full max-w-xs'
                onChange={e => handleThumbnailPreview(e)}
              />
            </fieldset>

            <img
              src={repo.thumbnail}
              alt={repo.name}
              width='256px'
              height='256px'
            />
          </div>

          <fieldset className='fieldset w-full'>
            <legend className='fieldset-legend'>
              Stacks (Press Tab to add Stack)
            </legend>
            <div className='relative w-full max-w-xs'>
              <input
                type='text'
                list='stacks'
                placeholder='Stacks'
                className='input w-full'
                onKeyDown={e => handleAddStacks(e)}
              />

              <kbd className='kbd absolute right-2 top-1/2 -translate-y-1/2'>
                Tab
              </kbd>
            </div>

            <datalist id='stacks'>
              {allowedStacks.map(stack => (
                <option
                  key={stack}
                  value={stack}
                ></option>
              ))}
            </datalist>

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
          </fieldset>

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
