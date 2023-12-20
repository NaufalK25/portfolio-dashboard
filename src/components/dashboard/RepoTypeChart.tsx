import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import RepoTypeLabel from './RepoTypeLabel';

type RepoTypeChartProps = {
  types: { name: string; value: number }[];
};

const RepoTypeChart = ({ types }: RepoTypeChartProps) => {
  return (
    <>
      <ResponsiveContainer
        width='100%'
        height={250}
      >
        <PieChart>
          <Pie
            data={types}
            dataKey='value'
            nameKey='name'
            cx='50%'
            cy='50%'
            outerRadius={50}
            fill='#7480FF'
            label={RepoTypeLabel}
            labelLine={false}
          />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default RepoTypeChart;
