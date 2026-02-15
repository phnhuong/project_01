import React from 'react';
import { clsx } from 'clsx';

const Table = ({ 
  columns, 
  data = [], 
  keyExtractor = (item) => item.id, 
  isLoading,
  emptyMessage = "Không có dữ liệu"
}) => {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col, index) => (
              <th 
                key={index}
                className={clsx(
                  "px-6 py-3 font-semibold text-gray-900",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={keyExtractor(item, index)} className="hover:bg-gray-50 transition-colors">
              {columns.map((col, colIndex) => (
                <td 
                  key={colIndex} 
                  className={clsx(
                    "px-6 py-4 text-gray-700",
                    col.className
                  )}
                >
                  {col.render ? col.render(item) : item[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
