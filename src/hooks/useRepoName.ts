import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RepoName } from '../types/repo';

const fetchReposName = async (): Promise<RepoName[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/repo-name`
  );
  const { data } = await response.json();

  return data;
};

const useRepoName = () => {
  const queryClient = useQueryClient();

  const { data: reposName = [], isFetching } = useQuery({
    queryKey: ['reposName'],
    queryFn: fetchReposName
  });

  const syncReposName = async () => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/repo-name/sync`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    await queryClient.invalidateQueries({ queryKey: ['reposName'] });
  };

  return { reposName, isLoading: isFetching, syncReposName };
};

export default useRepoName;
