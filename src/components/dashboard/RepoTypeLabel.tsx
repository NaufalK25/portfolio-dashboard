import { PieLabel } from 'recharts';

const RepoTypeLabel: PieLabel = props => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, name, payload } =
    props;
  const { value } = payload.payload;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline='central'
    >
      {`${name} (${value}) - ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default RepoTypeLabel;
