import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatLargeNumber, formatCalendarYear, generateEvenlySpacedTicks } from '../../utils/effectsVisualization';
import { formatLives } from '../../utils/formatters';
import { getCategoryVariantColor } from '../../utils/chartColors';

const EFFECT_COLOR_PALETTE = [
  '#2563eb',
  '#059669',
  '#d97706',
  '#dc2626',
  '#7c3aed',
  '#0891b2',
  '#eab308',
  '#c2410c',
  '#db2777',
  '#5b3a29',
];

const buildFallbackLabel = (effectId) => {
  return effectId
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const buildSeriesMetadata = (data, effectIds, colorMode) => {
  const rawSeriesMetadata = Array.isArray(data?.seriesMetadata) ? data.seriesMetadata : [];
  const seriesMetadataById = Object.fromEntries(rawSeriesMetadata.map((series) => [series.id, series]));
  const variantCountsByCategory = {};

  return effectIds.map((effectId, index) => {
    const metadata = seriesMetadataById[effectId];
    const categoryId = metadata?.categoryId || effectId;
    const variantIndex = variantCountsByCategory[categoryId] || 0;
    variantCountsByCategory[categoryId] = variantIndex + 1;

    return {
      id: effectId,
      label: metadata?.label || buildFallbackLabel(effectId),
      categoryId: metadata?.categoryId || null,
      categoryName: metadata?.categoryName || null,
      effectType: metadata?.effectType || 'unknown',
      totalLives: metadata?.totalLives ?? null,
      shareOfTotal: metadata?.shareOfTotal ?? null,
      startYear: metadata?.startYear ?? null,
      endYear: metadata?.endYear ?? null,
      color:
        colorMode === 'effect'
          ? EFFECT_COLOR_PALETTE[index % EFFECT_COLOR_PALETTE.length]
          : getCategoryVariantColor(categoryId, variantIndex),
    };
  });
};

const CustomTooltip = ({ active, payload, seriesMetadata, activeSeriesId }) => {
  if (!active || !Array.isArray(payload) || payload.length === 0) return null;

  const seriesById = Object.fromEntries(seriesMetadata.map((series) => [series.id, series]));
  const pointYear = payload[0]?.payload?.year;
  const activeEffects = payload
    .filter((entry) => Math.abs(entry.value || 0) > 1e-9)
    .map((entry) => ({
      id: entry.dataKey,
      value: entry.value,
      color: entry.color,
      series: seriesById[entry.dataKey],
    }))
    .sort((a, b) => {
      if (activeSeriesId === a.id) return -1;
      if (activeSeriesId === b.id) return 1;
      return Math.abs(b.value) - Math.abs(a.value);
    });

  const highlightedEffect =
    activeEffects.find((effect) => effect.id === activeSeriesId) ||
    activeEffects.reduce((largestEffect, effect) => {
      if (!largestEffect || Math.abs(effect.value) > Math.abs(largestEffect.value)) {
        return effect;
      }
      return largestEffect;
    }, null);
  const otherEffectsCount = Math.max(activeEffects.length - 1, 0);
  const totalLivesPerYear = activeEffects.reduce((sum, effect) => sum + effect.value, 0);

  return (
    <div className="impact-surface rounded-lg p-3 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-strong">Year {formatCalendarYear(pointYear)}</p>
        <p className="text-sm font-semibold text-strong">{formatLives(totalLivesPerYear)} lives/year</p>
      </div>

      {highlightedEffect && (
        <div className="mt-2 space-y-1">
          <div className="flex items-start justify-between gap-3 text-xs">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2 w-2 flex-none rounded-full" style={{ backgroundColor: highlightedEffect.color }} />
              <p className="truncate font-medium text-strong">
                {highlightedEffect.series?.label || highlightedEffect.id}
              </p>
            </div>
            <p className="text-strong">{formatLives(highlightedEffect.value)}</p>
          </div>
          {otherEffectsCount > 0 && (
            <p className="pl-4 text-xs text-muted">
              + {otherEffectsCount} other{otherEffectsCount === 1 ? '' : 's'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const formatXAxisTick = (value) => formatCalendarYear(value);

const formatYAxisTick = (value) => {
  const precision = Math.abs(value) < 10 ? 2 : 1;
  return formatLargeNumber(value, precision);
};

const LivesSavedGraph = ({ data, height = 300, colorMode = 'category' }) => {
  const [activeSeriesId, setActiveSeriesId] = useState(null);

  const { customTicks, filteredData, seriesMetadata } = useMemo(() => {
    if (!data || data.length === 0) {
      return { customTicks: undefined, filteredData: [], seriesMetadata: [] };
    }

    const effectIds = Object.keys(data[0]).filter((key) => key !== 'year');
    const seriesMetadata = buildSeriesMetadata(data, effectIds, colorMode);

    const minYear = data[0].year;
    const maxYear = data[data.length - 1].year;

    let lastNonZeroIndex = -1;
    for (let i = data.length - 1; i >= 0; i--) {
      const point = data[i];
      const hasNonZeroValue = effectIds.some((id) => Math.abs(point[id] || 0) > 1e-9);
      if (hasNonZeroValue) {
        lastNonZeroIndex = i;
        break;
      }
    }

    let newMaxYear;
    if (lastNonZeroIndex === -1) {
      newMaxYear = minYear + 1;
    } else if (lastNonZeroIndex === data.length - 1) {
      newMaxYear = maxYear;
    } else {
      const lastNonZeroYear = data[lastNonZeroIndex].year;
      const firstZeroYear = data[lastNonZeroIndex + 1].year;
      const buffer = Math.max((firstZeroYear - lastNonZeroYear) * 0.5, 1);
      newMaxYear = Math.min(maxYear, firstZeroYear + buffer);
    }

    const filteredData = data.filter((point) => point.year <= newMaxYear);
    const lastFilteredPoint = filteredData[filteredData.length - 1];

    if (lastFilteredPoint && lastFilteredPoint.year < newMaxYear) {
      filteredData.push({ ...lastFilteredPoint, year: newMaxYear });
    }

    const displayMinYear = filteredData.length > 0 ? filteredData[0].year : minYear;
    const displayMaxYear = filteredData.length > 0 ? filteredData[filteredData.length - 1].year : newMaxYear;

    return {
      customTicks: generateEvenlySpacedTicks(displayMinYear, displayMaxYear),
      filteredData,
      seriesMetadata,
    };
  }, [colorMode, data]);

  if (!filteredData || filteredData.length === 0) {
    return (
      <div className="impact-surface flex h-64 items-center justify-center rounded-lg">
        <p className="text-muted">No data to display</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={filteredData}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          onMouseLeave={() => setActiveSeriesId(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
          <XAxis
            dataKey="year"
            type="number"
            scale="linear"
            domain={['dataMin', 'dataMax']}
            ticks={customTicks}
            tickFormatter={formatXAxisTick}
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            stroke="var(--border-strong)"
          />
          <YAxis
            tickFormatter={formatYAxisTick}
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            stroke="var(--border-strong)"
            width={60}
          />
          <Tooltip
            content={<CustomTooltip seriesMetadata={seriesMetadata} activeSeriesId={activeSeriesId} />}
            animationDuration={150}
          />

          {seriesMetadata.map((series) => {
            const isDimmed = activeSeriesId && activeSeriesId !== series.id;
            const isActive = activeSeriesId === series.id;

            return (
              <Area
                key={series.id}
                type="monotone"
                dataKey={series.id}
                name={series.label}
                stackId="1"
                stroke={series.color}
                fill={series.color}
                fillOpacity={isDimmed ? 0.28 : 0.7}
                strokeOpacity={isDimmed ? 0.35 : 1}
                strokeWidth={isActive ? 2 : 1.5}
                onMouseEnter={() => setActiveSeriesId(series.id)}
                onMouseLeave={() => setActiveSeriesId(null)}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>

      {seriesMetadata.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {seriesMetadata.map((series) => {
            const isActive = activeSeriesId === series.id;
            const isDimmed = activeSeriesId && activeSeriesId !== series.id;

            return (
              <button
                key={series.id}
                type="button"
                className="relative flex items-center gap-2 text-left text-sm transition-opacity duration-150"
                style={{ opacity: isDimmed ? 0.45 : 1 }}
                onMouseEnter={() => setActiveSeriesId(series.id)}
                onMouseLeave={() => setActiveSeriesId(null)}
                onFocus={() => setActiveSeriesId(series.id)}
                onBlur={() => setActiveSeriesId(null)}
              >
                {activeSeriesId === series.id && (
                  <span
                    className="pointer-events-none absolute left-0 top-full z-10 mt-2 rounded-md border px-2 py-1 text-xs shadow-lg"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-strong)',
                      maxWidth: 'min(16rem, calc(100vw - 2rem))',
                      whiteSpace: 'normal',
                    }}
                  >
                    {series.totalLives === null ? 'N/A' : formatLives(series.totalLives)} lives
                    {series.shareOfTotal === null ? '' : ` (${(series.shareOfTotal * 100).toFixed(1)}%)`}
                  </span>
                )}
                <span
                  className="h-2.5 w-2.5 flex-none rounded-full"
                  style={{
                    backgroundColor: series.color,
                    boxShadow: isActive ? `0 0 0 3px ${series.color}22` : 'none',
                  }}
                />
                <span className={isActive ? 'text-strong' : 'text-muted'}>{series.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

LivesSavedGraph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
    })
  ).isRequired,
  height: PropTypes.number,
  colorMode: PropTypes.oneOf(['category', 'effect']),
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  seriesMetadata: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeSeriesId: PropTypes.string,
};

export default LivesSavedGraph;
