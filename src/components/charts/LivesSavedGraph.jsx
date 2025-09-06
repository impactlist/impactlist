import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatLargeNumber, formatCalendarYear, generateEvenlySpacedTicks } from '../../utils/effectsVisualization';

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
      <p className="text-sm text-gray-600">Lives/year: {formatLargeNumber(totalLivesPerYear, 3)}</p>
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
  // Extract effect IDs, assign colors, and calculate tick positions
  const { effectInfo, customTicks } = useMemo(() => {
    if (!data || data.length === 0) {
      return { effectInfo: { effectIds: [], colorMap: {} }, customTicks: undefined };
    }

    // Get all effect IDs from the first point (excluding 'year')
    const effectIds = Object.keys(data[0]).filter((key) => key !== 'year');

    // Assign colors to each effect
    const colorMap = {};
    effectIds.forEach((id, index) => {
      colorMap[id] = COLOR_PALETTE[index % COLOR_PALETTE.length];
    });

    // Calculate custom tick positions for X-axis
    const minYear = Math.min(...data.map((d) => d.year));
    const maxYear = Math.max(...data.map((d) => d.year));
    const ticks = generateEvenlySpacedTicks(minYear, maxYear);

    return {
      effectInfo: { effectIds, colorMap },
      customTicks: ticks,
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data to display</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
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
