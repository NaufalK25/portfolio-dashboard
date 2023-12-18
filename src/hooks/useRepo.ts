import { useEffect, useState } from 'react';
import { Repo } from '../types/repo';

const useRepo = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    const getAllRepos = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/repo`);
        let { data }: { data: Repo[] } = await response.json();

        data = data.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setRepos(data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    getAllRepos();
  }, [setIsLoading]);

  const updateRepos = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/repo`);
      let { data }: { data: Repo[] } = await response.json();

      data = data.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setRepos(data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  return { repos, setRepos, updateRepos };
};

export default useRepo;
