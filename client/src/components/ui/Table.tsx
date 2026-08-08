import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "No data available",
}: TableProps<T>) {
  return (
    <div className='w-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-gray-50/50 border-b border-gray-100'>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className='px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap'
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-50'>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className='px-6 py-12 text-center text-gray-400 text-sm'
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`transition-colors ${
                    onRowClick ? "cursor-pointer hover:bg-gray-50/80" : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className='px-6 py-4 text-sm text-gray-700 whitespace-nowrap'
                    >
                      {col.render
                        ? col.render(item)
                        : (item[col.key as keyof T] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
