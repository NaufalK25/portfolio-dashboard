import { useRef, useState } from 'react';
import { Image } from 'react-feather';
import useRepoName from '../../hooks/useRepoName';
import { RepoStack } from '../../types/repo';
import { allowedStacks } from '../../utils/constants';
import { createErrorToast, createSuccessToast } from '../../utils/toast';

const CreateRepoModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const ghIdRef = useRef<HTMLInputElement | null>(null);
  const typeRef = useRef<HTMLSelectElement | null>(null);
  const ownerRef = useRef<HTMLInputElement | null>(null);
  const repoNameRef = useRef<HTMLInputElement | null>(null);
  const homepageRef = useRef<HTMLInputElement | null>(null);
  const htmlUrlRef = useRef<HTMLInputElement | null>(null);
  const licenseRef = useRef<HTMLInputElement | null>(null);
  const licenseUrlRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const createdAtRef = useRef<HTMLInputElement | null>(null);
  const stacksRef = useRef<HTMLInputElement | null>(null);

  const { reposName } = useRepoName(setIsLoading);

  const handleRepositorySelected = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setIsLoading(true);

    const [owner, repoName] = e.currentTarget.value.split('/');

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/gh-repo/${owner}/${repoName}`
    );
    const data = await response.json();

    if (ghIdRef.current) {
      ghIdRef.current.value = data.id;
    }
    if (typeRef.current) {
      typeRef.current.value = data.owner.type;
    }
    if (ownerRef.current) {
      ownerRef.current.value = data.owner.login;
    }
    if (repoNameRef.current) {
      repoNameRef.current.value = data.name;
    }
    if (homepageRef.current) {
      homepageRef.current.value = data.homepage || '';
    }
    if (htmlUrlRef.current) {
      htmlUrlRef.current.value = data.html_url;
    }
    if (licenseRef.current) {
      licenseRef.current.value = data.license?.name || '';
    }
    if (licenseUrlRef.current) {
      licenseUrlRef.current.value = data.license?.url || '';
    }
    if (descriptionRef.current) {
      descriptionRef.current.value = data.description || '';
    }
    if (createdAtRef.current) {
      createdAtRef.current.value = data.created_at.replace(/Z$/, '');
    }

    setIsLoading(false);
  };

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

  const handleCreateRepo = async () => {
    setIsLoading(true);

    const stacks = [];
    if (stacksRef.current) {
      for (const stackEl of stacksRef.current.children) {
        stacks.push(stackEl.lastChild ? stackEl.lastChild.textContent : '');
      }
    }

    const formData = new FormData();
    if (ghIdRef.current) {
      formData.append('ghId', ghIdRef.current.value);
    }
    if (typeRef.current) {
      formData.append('type', typeRef.current.value);
    }
    if (ownerRef.current) {
      formData.append('owner', ownerRef.current.value);
    }
    if (repoNameRef.current) {
      formData.append('name', repoNameRef.current.value);
    }
    if (homepageRef.current) {
      formData.append('homepage', homepageRef.current.value);
    }
    if (htmlUrlRef.current) {
      formData.append('htmlUrl', htmlUrlRef.current.value);
    }
    if (licenseRef.current) {
      formData.append('licenseName', licenseRef.current.value);
    }
    if (licenseUrlRef.current) {
      formData.append('licenseUrl', licenseUrlRef.current.value);
    }
    if (descriptionRef.current) {
      formData.append('description', descriptionRef.current.value);
    }
    if (createdAtRef.current) {
      formData.append('created_at', `${createdAtRef.current.value}Z`);
    }
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }
    formData.append('stacks', stacks.join(','));

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/repo`, {
      method: 'POST',
      body: formData
    });

    const { success, message } = await response.json();

    setIsLoading(false);
    (document.getElementById('create_repo_modal') as HTMLDialogElement).close();

    if (success) {
      createSuccessToast(message);
    } else {
      createErrorToast(Array.isArray(message) ? message[0] : message);
    }
  };

  return (
    <dialog
      id='create_repo_modal'
      className='modal'
    >
      <div className='modal-box'>
        <h3 className='font-bold text-lg'>Create new repo!</h3>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
            ✕
          </button>

          <label className='form-control w-full max-w-xs'>
            <div className='label'>
              <span className='label-text'>Repository</span>{' '}
              {isLoading ? (
                <span className='loading loading-spinner loading-sm'></span>
              ) : null}
            </div>
            <select
              className='select select-bordered'
              required
              onChange={e => handleRepositorySelected(e)}
            >
              <option
                disabled
                selected
              >
                owner/repo
              </option>
              {reposName
                ? reposName.map(repoName => (
                    <option
                      key={repoName.id}
                      value={`${repoName.owner}/${repoName.name}`}
                    >
                      {repoName.owner}/{repoName.name}
                    </option>
                  ))
                : null}
            </select>
          </label>

          <div className='flex flex-col md:flex-row gap-x-1'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>GitHub Id (Read-Only)</span>
              </div>
              <input
                type='text'
                placeholder='GitHub Id'
                ref={ghIdRef}
                disabled
                className='input input-bordered w-full max-w-xs'
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Type (Read-Only)</span>
              </div>
              <select
                className='select select-bordered'
                ref={typeRef}
                disabled
              >
                <option>User</option>
                <option>Organization</option>
              </select>
            </label>
          </div>

          <div className='flex flex-col md:flex-row gap-x-1'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Owner (Read-Only)</span>
              </div>
              <input
                type='text'
                placeholder='Owner'
                ref={ownerRef}
                disabled
                className='input input-bordered w-full max-w-xs'
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Repo Name (Read-Only)</span>
              </div>
              <input
                type='text'
                placeholder='Repo Name'
                ref={repoNameRef}
                disabled
                className='input input-bordered w-full max-w-xs'
              />
            </label>
          </div>

          <div className='flex flex-col md:flex-row gap-x-1'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Homepage (Read-Only)</span>
              </div>
              <input
                type='text'
                placeholder='Homepage'
                ref={homepageRef}
                disabled
                className='input input-bordered w-full max-w-xs'
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>HTML Url (Read-Only)</span>
              </div>
              <input
                type='text'
                placeholder='HTML Url'
                ref={htmlUrlRef}
                disabled
                className='input input-bordered w-full max-w-xs'
              />
            </label>
          </div>

          <div className='flex flex-col md:flex-row gap-x-1'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>License (Read-Only)</span>
              </div>
              <input
                type='text'
                placeholder='License'
                ref={licenseRef}
                disabled
                className='input input-bordered w-full max-w-xs'
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>License Url (Read-Only)</span>
              </div>
              <input
                type='text'
                placeholder='License Url'
                ref={licenseUrlRef}
                disabled
                className='input input-bordered w-full max-w-xs'
              />
            </label>
          </div>

          <label className='form-control'>
            <div className='label'>
              <span className='label-text'>Description (Read-Only)</span>
            </div>
            <textarea
              className='textarea textarea-bordered h-24 resize-none'
              placeholder='Description'
              ref={descriptionRef}
              disabled
            ></textarea>
          </label>

          <label className='form-control w-full max-w-xs'>
            <div className='label'>
              <span className='label-text'>Created At (Read-Only)</span>
            </div>
            <input
              type='datetime-local'
              placeholder='Created At'
              ref={createdAtRef}
              disabled
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

            <Image size={256} />
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
            ></div>
          </label>

          <div
            className={`${
              isLoading ? 'btn-disabled' : ''
            } btn btn-success mt-4`}
            onClick={handleCreateRepo}
          >
            {isLoading ? (
              <>
                <span className='loading loading-spinner'></span>
                <p>Loading...</p>
              </>
            ) : (
              <p>Create</p>
            )}
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default CreateRepoModal;
