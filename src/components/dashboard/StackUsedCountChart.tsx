import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

type StackUsedCountChartProps = {
  stacks: { name: string; value: number }[];
};

const StackUsedCountChart = ({ stacks }: StackUsedCountChartProps) => {
  return (
    <>
      <ResponsiveContainer
        width='100%'
        height={250}
      >
        <BarChart data={stacks}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
            labelStyle={{ color: '#fff' }}
          />
          <Bar
            dataKey='value'
            fill='#7480FF'
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default StackUsedCountChart;
