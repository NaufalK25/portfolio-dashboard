import { useMemo } from 'react';
import { PieChart } from 'react-feather';
import RepoTypeChart from './RepoTypeChart';
import useRepo from '../../hooks/useRepo';
import useRepoName from '../../hooks/useRepoName';
import { Repo, RepoName } from '../../types/repo';

const getTypes = (data: Repo[] | RepoName[]) => {
  return data.reduce((acc, val) => {
    const foundTypes = acc.find(accData => accData.name === val.type);
    if (foundTypes) {
      foundTypes.value += 1;
    } else {
      acc.push({
        name: val.type,
        value: 1
      });
    }

    return acc;
  }, [] as { name: string; value: number }[]);
};

const RepoTypeCharts = () => {
  const { repos, isLoading: isReposLoading } = useRepo();
  const { reposName, isLoading: isReposNameLoading } = useRepoName();
  const isLoading = isReposLoading || isReposNameLoading;

  const repoTypes = useMemo(() => getTypes(repos), [repos]);
  const repoNameTypes = useMemo(() => getTypes(reposName), [reposName]);

  return (
    <>
      <div className='flex items-center gap-2'>
        <PieChart /> Repo Type
        {isLoading ? (
          <>
            <span className='loading loading-spinner loading-sm'></span>
            <p>Loading...</p>
          </>
        ) : null}
      </div>

      <RepoTypeChart types={repoTypes} />

      <div className='flex items-center gap-2'>
        <PieChart /> Repo Name Type
        {isLoading ? (
          <>
            <span className='loading loading-spinner loading-sm'></span>
            <p>Loading...</p>
          </>
        ) : null}
      </div>

      <RepoTypeChart types={repoNameTypes} />
    </>
  );
};

export default RepoTypeCharts;
