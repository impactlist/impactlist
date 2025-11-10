import { useState } from 'react';
import Tooltip from './Tooltip';

const SortableTable = ({
  columns,
  data,
  defaultSortColumn,
  defaultSortDirection = 'desc',
  rankKey,
  tiebreakColumn,
  tiebreakDirection = 'desc',
}) => {
  const [sortColumn, setSortColumn] = useState(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);

  // Helper function to apply tiebreaker comparison
  const applyTiebreaker = (a, b, tiebreakColumn, tiebreakDirection) => {
    const tiebreakMultiplier = tiebreakDirection === 'asc' ? 1 : -1;
    const aTiebreakValue = a[tiebreakColumn];
    const bTiebreakValue = b[tiebreakColumn];

    // Use appropriate comparison for tiebreaker
    if (typeof aTiebreakValue === 'string' && typeof bTiebreakValue === 'string') {
      return tiebreakMultiplier * aTiebreakValue.localeCompare(bTiebreakValue);
    } else {
      return tiebreakMultiplier * (aTiebreakValue - bTiebreakValue);
    }
  };

  // Handle column header click for sorting
  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      // If same column is clicked, toggle sort direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If different column is clicked, sort by that column in descending order by default
      setSortColumn(columnKey);
      setSortDirection('desc');
    }
  };

  // Sort the data based on the sort column and direction
  const sortedData = [...data].sort((a, b) => {
    // Get values to compare
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    // Determine sort order
    const sortMultiplier = sortDirection === 'asc' ? 1 : -1;

    // Special handling for cost per life column (both costPerLife and actualCostPerLife)
    if (sortColumn === 'costPerLife' || sortColumn === 'actualCostPerLife') {
      // Handle negative values in cost per life
      // 1. Negative values are considered "worse" (higher cost) than any positive value
      // 2. Among negative values, those closer to zero are worse than those further from zero

      // Both values are negative
      if (aValue < 0 && bValue < 0) {
        // Sort by absolute value, but reversed (closer to zero = higher cost)
        // Math.abs converts to positive, we want smaller absolute values first when ascending
        const result = sortMultiplier * (Math.abs(bValue) - Math.abs(aValue));

        // Use tiebreaker if values are equal and tiebreakColumn is provided
        if (result === 0 && tiebreakColumn) {
          return applyTiebreaker(a, b, tiebreakColumn, tiebreakDirection);
        }

        return result;
      }

      // Only a is negative
      if (aValue < 0 && bValue >= 0) {
        // Negative values are considered higher cost than positive values
        return sortDirection === 'asc' ? 1 : -1; // In asc, a comes after b
      }

      // Only b is negative
      if (aValue >= 0 && bValue < 0) {
        // Negative values are considered higher cost than positive values
        return sortDirection === 'asc' ? -1 : 1; // In asc, b comes after a
      }

      // Both are non-negative, use normal sorting
      const result = sortMultiplier * (aValue - bValue);

      // Use tiebreaker if values are equal and tiebreakColumn is provided
      if (result === 0 && tiebreakColumn) {
        return applyTiebreaker(a, b, tiebreakColumn, tiebreakDirection);
      }

      return result;
    }

    // Normal sorting for other columns
    let result;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      result = sortMultiplier * aValue.localeCompare(bValue);
    } else {
      result = sortMultiplier * (aValue - bValue);
    }

    // Use tiebreaker if values are equal and tiebreakColumn is provided
    if (result === 0 && tiebreakColumn) {
      return applyTiebreaker(a, b, tiebreakColumn, tiebreakDirection);
    }

    return result;
  });

  // If rankKey is provided, preserve the original rank values
  // This ensures that even when sorted by a different column, the rank column still shows the correct rank
  const rankedData = rankKey
    ? sortedData.map((item) => {
        // Find the original item with this item's ID to get its rank
        const originalItem = data.find((original) => original.name === item.name);
        return {
          ...item,
          [rankKey]: originalItem[rankKey],
        };
      })
    : sortedData;

  // Render sort indicator
  const renderSortIndicator = (columnKey) => {
    if (sortColumn !== columnKey) {
      return (
        <svg
          className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }

    if (sortDirection === 'asc') {
      return (
        <svg className="h-4 w-4 text-indigo-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
        </svg>
      );
    } else {
      return (
        <svg className="h-4 w-4 text-indigo-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
  };

  return (
    <table className="min-w-full divide-y divide-slate-200">
      <thead className="bg-slate-100">
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              scope="col"
              className={`${column.key === 'rank' ? 'px-2' : 'px-6'} py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer group hover:bg-slate-200 transition-colors ${column.key === 'name' ? 'w-[300px]' : ''} ${column.key === 'rank' ? 'w-10' : ''}`}
              onClick={() => handleSort(column.key)}
            >
              <div className="flex items-center">
                {column.label}
                {column.tooltip && (
                  <Tooltip content={column.tooltip}>
                    <svg
                      className="w-3.5 h-3.5 text-slate-500 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </Tooltip>
                )}
                {renderSortIndicator(column.key)}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-slate-200">
        {rankedData.map((item, index) => (
          <tr
            key={`row-${index}`}
            className={`transition-colors hover:bg-indigo-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
          >
            {columns.map((column) => (
              <td
                key={`cell-${column.key}-${index}`}
                className={`${column.key === 'rank' ? 'px-2' : 'px-6'} py-5 ${column.key === 'name' ? '' : 'whitespace-nowrap'} ${column.key === 'rank' ? 'w-10' : ''}`}
              >
                {column.render ? column.render(item) : item[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SortableTable;
