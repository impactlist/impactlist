import { useEffect, useRef, useState } from 'react';
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
  const [isHeaderStuck, setIsHeaderStuck] = useState(false);
  const [columnWidths, setColumnWidths] = useState([]);
  const [tableWidth, setTableWidth] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const tableRef = useRef(null);
  const tableHeadRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const stickyTrackRef = useRef(null);

  useEffect(() => {
    const updateStickyState = () => {
      if (!tableRef.current || !tableHeadRef.current) {
        return;
      }

      const tableRect = tableRef.current.getBoundingClientRect();
      const headerHeight = tableHeadRef.current.getBoundingClientRect().height;
      const nextIsStuck = tableRect.top <= 0 && tableRect.bottom - headerHeight > 0;

      setIsHeaderStuck((currentValue) => (currentValue === nextIsStuck ? currentValue : nextIsStuck));
    };

    let animationFrameId = null;

    const requestUpdate = () => {
      if (animationFrameId !== null) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null;
        updateStickyState();
      });
    };

    updateStickyState();
    window.addEventListener('scroll', requestUpdate, true);
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      window.removeEventListener('scroll', requestUpdate, true);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [data.length]);

  useEffect(() => {
    if (!tableRef.current || !tableHeadRef.current || !scrollContainerRef.current) {
      return;
    }

    let animationFrameId = null;
    const syncStickyTrack = (nextScrollLeft = 0) => {
      if (!stickyTrackRef.current) {
        return;
      }

      stickyTrackRef.current.style.setProperty('--impact-table-scroll-offset', `${-nextScrollLeft}px`);
    };

    const areWidthsEqual = (currentWidths, nextWidths) =>
      currentWidths.length === nextWidths.length && currentWidths.every((width, index) => width === nextWidths[index]);

    const measureLayout = () => {
      if (!tableRef.current || !tableHeadRef.current || !scrollContainerRef.current) {
        return;
      }

      const headerCells = Array.from(tableHeadRef.current.querySelectorAll('th'));
      const nextColumnWidths = headerCells.map((cell) => Math.ceil(cell.getBoundingClientRect().width));
      const nextTableWidth = Math.ceil(tableRef.current.getBoundingClientRect().width);
      const nextHeaderHeight = Math.ceil(tableHeadRef.current.getBoundingClientRect().height);
      const nextScrollLeft = scrollContainerRef.current.scrollLeft;

      setColumnWidths((currentWidths) =>
        areWidthsEqual(currentWidths, nextColumnWidths) ? currentWidths : nextColumnWidths
      );
      setTableWidth((currentWidth) => (currentWidth === nextTableWidth ? currentWidth : nextTableWidth));
      setHeaderHeight((currentHeight) => (currentHeight === nextHeaderHeight ? currentHeight : nextHeaderHeight));
      syncStickyTrack(nextScrollLeft);
    };

    const requestMeasure = () => {
      if (animationFrameId !== null) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null;
        measureLayout();
      });
    };

    measureLayout();

    if (typeof window.ResizeObserver !== 'undefined') {
      const resizeObserver = new window.ResizeObserver(requestMeasure);
      resizeObserver.observe(tableRef.current);
      resizeObserver.observe(tableHeadRef.current);
      resizeObserver.observe(scrollContainerRef.current);

      return () => {
        if (animationFrameId !== null) {
          window.cancelAnimationFrame(animationFrameId);
        }

        resizeObserver.disconnect();
      };
    }

    window.addEventListener('resize', requestMeasure);

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      window.removeEventListener('resize', requestMeasure);
    };
  }, [columns.length, data.length]);

  // Helper function to get column padding class
  const getColumnPadding = (columnKey) => {
    if (columnKey === 'photo') return 'px-2';
    if (columnKey === 'rank') return 'pl-3 pr-2';
    return 'px-4';
  };

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
          className="ml-1 h-4 w-4 text-muted opacity-0 group-hover:opacity-100"
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
        <svg className="ml-1 h-4 w-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
        </svg>
      );
    } else {
      return (
        <svg className="ml-1 h-4 w-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
  };

  const getAriaSort = (columnKey) => {
    if (sortColumn !== columnKey) {
      return 'none';
    }

    return sortDirection === 'asc' ? 'ascending' : 'descending';
  };

  const renderTooltipIcon = () => (
    <svg
      className="h-3.5 w-3.5 text-muted"
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
  );

  const renderTableHeader = (instanceKey, isInteractive) => (
    <thead ref={instanceKey === 'primary' ? tableHeadRef : undefined}>
      <tr>
        {columns.map((column) => (
          <th
            key={`${instanceKey}-${column.key}`}
            scope="col"
            aria-sort={getAriaSort(column.key)}
            className={`${getColumnPadding(column.key)} group py-4 text-left ${column.key === 'name' ? 'w-[220px]' : ''} ${column.key === 'rank' ? 'w-14' : ''} ${column.key === 'photo' ? 'min-w-24' : ''}`}
          >
            <div className="impact-table__header-inner">
              <button
                type="button"
                className="impact-table__sort-button"
                disabled={!isInteractive}
                aria-hidden={!isInteractive}
                aria-label={`Sort by ${column.label || column.key}`}
                onClick={() => handleSort(column.key)}
              >
                <span>{column.label}</span>
                {renderSortIndicator(column.key)}
              </button>
              {column.tooltip &&
                (isInteractive ? (
                  <Tooltip content={column.tooltip}>{renderTooltipIcon()}</Tooltip>
                ) : (
                  <span className="impact-table__tooltip-icon" aria-hidden="true">
                    {renderTooltipIcon()}
                  </span>
                ))}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );

  const renderColGroup = () => {
    if (columnWidths.length !== columns.length) {
      return null;
    }

    return (
      <colgroup>
        {columnWidths.map((width, index) => (
          <col key={`col-${columns[index].key}`} style={{ width: `${width}px`, minWidth: `${width}px` }} />
        ))}
      </colgroup>
    );
  };

  const showStickyHeader =
    isHeaderStuck && headerHeight > 0 && tableWidth > 0 && columnWidths.length === columns.length;
  const stickyShellStyle = headerHeight > 0 ? { '--impact-table-sticky-height': `${headerHeight}px` } : undefined;
  const stickyTrackStyle =
    tableWidth > 0
      ? {
          '--impact-table-scroll-offset': '0px',
          width: `${tableWidth}px`,
          minWidth: `${tableWidth}px`,
        }
      : undefined;

  return (
    <div
      className="impact-table-shell"
      data-header-stuck={showStickyHeader ? 'true' : 'false'}
      style={stickyShellStyle}
    >
      <div className="impact-table-sticky-rail" data-visible={showStickyHeader ? 'true' : 'false'}>
        <div className="impact-table-sticky-viewport">
          <div ref={stickyTrackRef} className="impact-table-sticky-track" style={stickyTrackStyle}>
            <table className="impact-table impact-table--sticky" role="presentation" aria-hidden={!showStickyHeader}>
              {renderColGroup()}
              {renderTableHeader('sticky', showStickyHeader)}
            </table>
          </div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="impact-table-scroll"
        onScroll={(event) => {
          if (stickyTrackRef.current) {
            stickyTrackRef.current.style.setProperty(
              '--impact-table-scroll-offset',
              `${-event.currentTarget.scrollLeft}px`
            );
          }
        }}
      >
        <table ref={tableRef} className="impact-table">
          {renderColGroup()}
          {renderTableHeader('primary', !showStickyHeader)}
          <tbody>
            {rankedData.map((item, index) => (
              <tr key={`row-${index}`}>
                {columns.map((column) => (
                  <td
                    key={`cell-${column.key}-${index}`}
                    className={`${getColumnPadding(column.key)} py-4 ${column.key === 'name' ? '' : 'whitespace-nowrap'} ${column.key === 'rank' ? 'w-14' : ''} ${column.key === 'photo' ? 'min-w-24' : ''}`}
                  >
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SortableTable;
