import { useEffect, useState } from 'react';
import { RepoName } from '../types/repo';

const useRepoName = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [reposName, setReposName] = useState<RepoName[]>([]);

  useEffect(() => {
    const getAllReposName = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/repo-name`
        );
        const { data } = await response.json();

        setReposName(data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    getAllReposName();
  }, [setIsLoading]);

  const syncReposName = async () => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/repo-name/sync`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/repo-name`);
    const { data } = await response.json();

    setReposName(data);
  };

  return { reposName, syncReposName };
};

export default useRepoName;
