import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Repo } from '../types/repo';

const fetchRepos = async (): Promise<Repo[]> => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/repo`);
  let { data }: { data: Repo[] } = await response.json();

  data = data.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return data;
};

const useRepo = () => {
  const queryClient = useQueryClient();

  const { data: repos = [], isFetching } = useQuery({
    queryKey: ['repos'],
    queryFn: fetchRepos
  });

  const updateRepos = () =>
    queryClient.invalidateQueries({ queryKey: ['repos'] });

  return { repos, isLoading: isFetching, updateRepos };
};

export default useRepo;
