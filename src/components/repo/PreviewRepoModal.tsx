import { ExternalLink, GitHub } from 'react-feather';
import { Link } from 'react-router-dom';
import StackIcon from './StackIcon';
import { Repo, RepoStack } from '../../types/repo';

type PreviewRepoModalProps = {
  repo: Repo;
};

const PreviewRepoModal = ({ repo }: PreviewRepoModalProps) => {
  let { stacks } = repo;

  if (typeof stacks === 'string') {
    stacks = stacks.split(', ') as RepoStack[];
  }

  return (
    <dialog
      id={`preview_repo_modal_${repo.ghId}`}
      className='modal'
    >
      <div className='modal-box'>
        <h3 className='font-bold text-lg'>
          Preview #{repo.ghId} - {repo.owner}/{repo.name}
        </h3>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
            ✕
          </button>

          <div className='flex justify-center'>
            <section className='w-3/4 gap-y-3 flex flex-col items-center py-1.5 justify-between'>
              <section className='flex justify-between w-full px-3 pt-1.5'>
                <h4 className='text-sm font-bold text-slate-800 dark:text-slate-200'>
                  {repo.name}
                </h4>
                {repo.licenseName ? (
                  <Link
                    to={repo.licenseUrl}
                    className='text-sm hover:underline hover:font-bold active:font-bold focus:font-bold text-slate-800 dark:text-slate-200'
                  >
                    {repo.licenseName}
                  </Link>
                ) : null}
              </section>

              <section
                className='h-60 flex items-end justify-end w-full px-3 pb-3 bg-cover bg-center bg-no-repeat'
                style={{
                  backgroundImage: `url(${repo.thumbnail})`
                }}
              >
                <section className='flex gap-x-2 bg-gray-300 p-1.5 rounded-md shadow-lg shadow-gray-500/50'>
                  {repo.homepage ? (
                    <Link
                      to={repo.homepage}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='tooltip'
                      data-tip='Homepage'
                    >
                      <ExternalLink color='black' />
                    </Link>
                  ) : null}

                  <Link
                    to={repo.htmlUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='tooltip'
                    data-tip='Repository'
                  >
                    <GitHub color='black' />
                  </Link>
                </section>
              </section>

              <section className='p-1 flex flex-col gap-y-3'>
                {repo.description ? (
                  <p className='text-sm text-slate-800 dark:text-slate-200'>
                    {repo.description}
                  </p>
                ) : null}
                <section className='flex justify-center'>
                  <section className='flex gap-x-3 flex-row bg-slate-500 dark:bg-slate-700 p-2 rounded-md shadow-lg'>
                    {stacks.map(stack => (
                      <div
                        className='tooltip'
                        data-tip={stack}
                        key={stack}
                      >
                        <StackIcon
                          stack={stack}
                          color='hex'
                        />
                      </div>
                    ))}
                  </section>
                </section>
              </section>
            </section>
          </div>

          <button className='btn btn-outline'>Close</button>
        </form>
      </div>
    </dialog>
  );
};

export default PreviewRepoModal;
