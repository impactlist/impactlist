import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatLargeNumber, formatCalendarYear, generateEvenlySpacedTicks } from '../../utils/effectsVisualization';
import { formatLives } from '../../utils/formatters';

// Color palette for effects
const COLOR_PALETTE = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#a855f7', // Purple
];

/**
 * Custom tooltip to show detailed information
 */
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload[0]) return null;

  const data = payload[0].payload;

  // Calculate total lives per year for this point
  let totalLivesPerYear = 0;
  const activeEffects = [];

  Object.keys(data).forEach((key) => {
    if (key !== 'year' && data[key] !== 0) {
      totalLivesPerYear += data[key];
      activeEffects.push({ id: key, value: data[key] });
    }
  });

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
      <p className="text-sm font-semibold text-gray-700">Year {formatCalendarYear(data.year)}</p>
      <p className="text-sm text-gray-600">Lives/year: {formatLives(totalLivesPerYear)}</p>
      {activeEffects.length > 0 && (
        <div className="mt-1 text-xs text-gray-500">Active effects: {activeEffects.length}</div>
      )}
    </div>
  );
};

/**
 * Custom X-axis tick formatter for calendar years
 */
const formatXAxisTick = (value) => {
  return formatCalendarYear(value);
};

/**
 * Custom Y-axis tick formatter
 */
const formatYAxisTick = (value) => {
  return formatLargeNumber(value, 1);
};

/**
 * Graph component showing lives saved over time
 */
const LivesSavedGraph = ({ data, height = 300 }) => {
  // Process data for graphing: filter to relevant time range, get effects, and calculate ticks
  const { effectInfo, customTicks, filteredData } = useMemo(() => {
    if (!data || data.length === 0) {
      return { effectInfo: { effectIds: [], colorMap: {} }, customTicks: undefined, filteredData: [] };
    }

    const effectIds = Object.keys(data[0]).filter((key) => key !== 'year');

    const colorMap = {};
    effectIds.forEach((id, index) => {
      colorMap[id] = COLOR_PALETTE[index % COLOR_PALETTE.length];
    });

    const minYear = data[0].year;
    const maxYear = data[data.length - 1].year;

    // Find the index of the last point with a non-zero value
    let lastNonZeroIndex = -1;
    for (let i = data.length - 1; i >= 0; i--) {
      const point = data[i];
      const hasNonZeroValue = effectIds.some((id) => (point[id] || 0) > 1e-9);
      if (hasNonZeroValue) {
        lastNonZeroIndex = i;
        break;
      }
    }

    let newMaxYear;
    if (lastNonZeroIndex === -1) {
      // All points are zero, just show a small initial range
      newMaxYear = minYear + 1;
    } else if (lastNonZeroIndex === data.length - 1) {
      // The very last point has a non-zero value, so the effect runs indefinitely.
      // The graph should extend to the end of the data (timeLimit).
      newMaxYear = maxYear;
    } else {
      // The effect ends. Show the drop to zero and add a buffer.
      const lastNonZeroYear = data[lastNonZeroIndex].year;
      const firstZeroYear = data[lastNonZeroIndex + 1].year;

      const buffer = Math.max((firstZeroYear - lastNonZeroYear) * 0.5, 1);
      newMaxYear = Math.min(maxYear, firstZeroYear + buffer);
    }

    // Filter data to the new, smaller domain
    let filteredData = data.filter((point) => point.year <= newMaxYear);

    // Ensure the line extends to the edge of the graph
    if (filteredData.length > 0) {
      const lastFilteredPoint = filteredData[filteredData.length - 1];
      if (lastFilteredPoint.year < newMaxYear) {
        // Create a new point at the edge with the same (zero) values as the last point.
        const edgePoint = { ...lastFilteredPoint, year: newMaxYear };
        filteredData.push(edgePoint);
      }
    }

    const displayMinYear = filteredData.length > 0 ? filteredData[0].year : minYear;
    const displayMaxYear = filteredData.length > 0 ? filteredData[filteredData.length - 1].year : newMaxYear;

    const ticks = generateEvenlySpacedTicks(displayMinYear, displayMaxYear);

    return {
      effectInfo: { effectIds, colorMap },
      customTicks: ticks,
      filteredData,
    };
  }, [data]);

  if (!filteredData || filteredData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data to display</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            type="number"
            scale="linear"
            domain={['dataMin', 'dataMax']}
            ticks={customTicks}
            tickFormatter={formatXAxisTick}
            tick={{ fontSize: 11 }}
            stroke="#6b7280"
          />
          <YAxis tickFormatter={formatYAxisTick} tick={{ fontSize: 11 }} stroke="#6b7280" width={60} />
          <Tooltip content={<CustomTooltip />} animationDuration={200} />

          {/* Dynamically generate Area components for each effect */}
          {effectInfo.effectIds.map((effectId) => (
            <Area
              key={effectId}
              type="monotone"
              dataKey={effectId}
              stackId="1"
              stroke={effectInfo.colorMap[effectId]}
              fill={effectInfo.colorMap[effectId]}
              fillOpacity={0.7}
              strokeWidth={1.5}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

LivesSavedGraph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      // Dynamic properties for each effect ID
    })
  ).isRequired,
  height: PropTypes.number,
};

export default LivesSavedGraph;
