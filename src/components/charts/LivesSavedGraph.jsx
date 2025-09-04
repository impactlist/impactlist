import React from 'react';
import PropTypes from 'prop-types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatLargeNumber, formatCalendarYear } from '../../utils/effectsVisualization';

// Color scheme for different segments
const SEGMENT_COLORS = {
  historical: '#6366f1', // Indigo (past)
  'future-growth': '#10b981', // Emerald (growth)
  'population-limit': '#f59e0b', // Amber (limit)
  qaly: '#ec4899', // Pink (QALY-based effects)
};

/**
 * Custom tooltip to show detailed information
 */
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload[0]) return null;

  const data = payload[0].payload;

  // Calculate total lives per year for this point
  const totalLivesPerYear =
    (data.historical || 0) + (data['future-growth'] || 0) + (data['population-limit'] || 0) + (data.qaly || 0);

  // Determine which segment is active (has non-zero value)
  let activeSegment = 'None';
  if (data.qaly > 0) activeSegment = 'Fixed Window';
  else if (data['population-limit'] > 0) activeSegment = 'Population Limit';
  else if (data['future-growth'] > 0) activeSegment = 'Future Growth';
  else if (data.historical > 0) activeSegment = 'Historical';

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
      <p className="text-sm font-semibold text-gray-700">Year {formatCalendarYear(data.year)}</p>
      <p className="text-sm text-gray-600">Lives/year: {formatLargeNumber(totalLivesPerYear, 3)}</p>
      <p className="text-xs text-gray-500 mt-1">Segment: {activeSegment}</p>
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
const LivesSavedGraph = ({ data, breakdown, height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data to display</p>
      </div>
    );
  }

  // Transform data for stacked area chart
  // The data already comes in the correct format from generateVisualizationPoints
  const transformedData = [];

  // Check if data is already in the correct format
  if (data.length > 0 && 'historical' in data[0]) {
    // Data is already in the correct format with segment values as properties
    transformedData.push(...data);
  } else {
    // Legacy format with segment and value properties
    const yearMap = new Map();
    data.forEach((point) => {
      const year = point.year;
      if (!yearMap.has(year)) {
        yearMap.set(year, {
          year: year,
          historical: 0,
          'future-growth': 0,
          'population-limit': 0,
          qaly: 0,
        });
      }
      const entry = yearMap.get(year);
      if (point.segment && point.value !== undefined) {
        entry[point.segment] = point.value;
      }
    });
    yearMap.forEach((value) => transformedData.push(value));
  }

  transformedData.sort((a, b) => a.year - b.year);

  // Determine if we need logarithmic scale based on time span
  const maxYear = Math.max(...data.map((d) => d.year));
  const useLogScale = maxYear > 10000;

  // Custom legend content
  const renderLegend = () => {
    const items = [
      { key: 'historical', label: 'Historical', color: SEGMENT_COLORS.historical },
      { key: 'future-growth', label: 'Future Growth', color: SEGMENT_COLORS['future-growth'] },
      { key: 'population-limit', label: 'Population Limit', color: SEGMENT_COLORS['population-limit'] },
      { key: 'qaly', label: 'Fixed Window', color: SEGMENT_COLORS.qaly },
    ];

    return (
      <div className="flex justify-center gap-6 mt-2">
        {items.map((item) => {
          // Only show if segment has data
          const hasData =
            breakdown && breakdown[item.key.replace('-', '')] && breakdown[item.key.replace('-', '')].lives > 0;
          if (!hasData && item.key !== 'historical') return null;

          return (
            <div key={item.key} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={transformedData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            scale={useLogScale ? 'log' : 'linear'}
            domain={useLogScale ? ['dataMin', 'dataMax'] : undefined}
            tickFormatter={formatXAxisTick}
            tick={{ fontSize: 11 }}
            stroke="#6b7280"
          />
          <YAxis tickFormatter={formatYAxisTick} tick={{ fontSize: 11 }} stroke="#6b7280" width={60} />
          <Tooltip content={<CustomTooltip />} animationDuration={200} />

          {/* Stack areas in order */}
          <Area
            type="monotone"
            dataKey="historical"
            stackId="1"
            stroke={SEGMENT_COLORS.historical}
            fill={SEGMENT_COLORS.historical}
            fillOpacity={0.7}
            strokeWidth={1.5}
          />
          <Area
            type="monotone"
            dataKey="future-growth"
            stackId="1"
            stroke={SEGMENT_COLORS['future-growth']}
            fill={SEGMENT_COLORS['future-growth']}
            fillOpacity={0.7}
            strokeWidth={1.5}
          />
          <Area
            type="monotone"
            dataKey="population-limit"
            stackId="1"
            stroke={SEGMENT_COLORS['population-limit']}
            fill={SEGMENT_COLORS['population-limit']}
            fillOpacity={0.7}
            strokeWidth={1.5}
          />
          <Area
            type="monotone"
            dataKey="qaly"
            stackId="1"
            stroke={SEGMENT_COLORS.qaly}
            fill={SEGMENT_COLORS.qaly}
            fillOpacity={0.7}
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
      {renderLegend()}
    </div>
  );
};

LivesSavedGraph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
      segment: PropTypes.string.isRequired,
    })
  ).isRequired,
  breakdown: PropTypes.object,
  height: PropTypes.number,
};

export default LivesSavedGraph;
