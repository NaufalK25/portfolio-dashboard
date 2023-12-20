import { useEffect, useState } from 'react';
import { PieChart } from 'react-feather';
import RepoTypeChart from './RepoTypeChart';
import useRepo from '../../hooks/useRepo';
import useRepoName from '../../hooks/useRepoName';
import { Repo, RepoName } from '../../types/repo';

const RepoTypeCharts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [repoTypes, setRepoTypes] = useState<{ name: string; value: number }[]>(
    []
  );
  const [repoNameTypes, setRepoNameTypes] = useState<
    { name: string; value: number }[]
  >([]);

  const { repos } = useRepo(setIsLoading);
  const { reposName } = useRepoName(setIsLoading);

  useEffect(() => {
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

    setRepoTypes(getTypes(repos));
    setRepoNameTypes(getTypes(reposName));
  }, [repos, reposName]);

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
