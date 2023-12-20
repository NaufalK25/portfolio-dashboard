import { useEffect, useState } from 'react';
import { BarChart } from 'react-feather';
import StackUsedCountChart from './StackUsedCountChart';
import { backEnd, database, frontEnd, other } from '../../utils/constants';
import useRepo from '../../hooks/useRepo';

const StackUsedCountCharts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stacks, setStacks] = useState<{ name: string; value: number }[]>([]);

  const { repos } = useRepo(setIsLoading);

  useEffect(() => {
    setStacks(
      repos.reduce((acc, val) => {
        const stacks = Array.isArray(val.stacks)
          ? val.stacks
          : val.stacks.split(', ');

        stacks.forEach(stack => {
          const foundStack = acc.find(accStack => accStack.name === stack);
          if (foundStack) {
            foundStack.value += 1;
          } else {
            acc.push({
              name: stack,
              value: 1
            });
          }
        });

        return acc;
      }, [] as { name: string; value: number }[])
    );
  }, [repos]);

  return (
    <>
      <div className='flex items-center gap-2'>
        <BarChart />
        All Stacks
        {isLoading ? (
          <>
            <span className='loading loading-spinner loading-sm'></span>
            <p>Loading...</p>
          </>
        ) : null}
      </div>

      <StackUsedCountChart stacks={stacks} />

      <div className='grid grid-cols-1 md:grid-cols-2'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <BarChart />
            Front End Stacks
            {isLoading ? (
              <>
                <span className='loading loading-spinner loading-sm'></span>
                <p>Loading...</p>
              </>
            ) : null}
          </div>
          <StackUsedCountChart
            stacks={stacks.filter(stack => frontEnd.includes(stack.name))}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <BarChart />
            Back End Stacks
            {isLoading ? (
              <>
                <span className='loading loading-spinner loading-sm'></span>
                <p>Loading...</p>
              </>
            ) : null}
          </div>
          <StackUsedCountChart
            stacks={stacks.filter(stack => backEnd.includes(stack.name))}
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <BarChart />
            Database
            {isLoading ? (
              <>
                <span className='loading loading-spinner loading-sm'></span>
                <p>Loading...</p>
              </>
            ) : null}
          </div>
          <StackUsedCountChart
            stacks={stacks.filter(stack => database.includes(stack.name))}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <BarChart />
            Other
            {isLoading ? (
              <>
                <span className='loading loading-spinner loading-sm'></span>
                <p>Loading...</p>
              </>
            ) : null}
          </div>
          <StackUsedCountChart
            stacks={stacks.filter(stack => other.includes(stack.name))}
          />
        </div>
      </div>
    </>
  );
};

export default StackUsedCountCharts;
