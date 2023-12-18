import DataTable, {
  TableColumn,
  TableStyles
} from 'react-data-table-component';

const customStyles: TableStyles = {
  headCells: {
    style: {
      fontSize: '1rem',
      fontWeight: '600'
    }
  }
};

type DashboardDataTableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  pending?: boolean;
};

function DashboardDataTable<T>({
  columns,
  data,
  pending
}: DashboardDataTableProps<T>) {
  return (
    <DataTable<T>
      columns={columns}
      customStyles={customStyles}
      data={data}
      pagination
      progressComponent={
        <div className='p-4 flex justify-center items-center gap-x-1 h-[32rem] md:h-[36rem]'>
          <span className='loading loading-spinner'></span>
          <p className='text-lg'>Loading...</p>
        </div>
      }
      progressPending={pending}
      theme='dark'
    />
  );
}

export default DashboardDataTable;
