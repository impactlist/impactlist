import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ImpactBarChart from '../charts/ImpactBarChart';
import ChartContainer from '../charts/ChartContainer';
import { formatRoundedLives, formatCurrency, formatCompactAxisNumber } from '../../utils/formatters';
import { getEffectiveCostPerLifeFromCombined } from '../../utils/assumptionsDataHelpers';
import { getCurrentYear } from '../../utils/donationDataHelpers';
import { buildCausePath } from '../../utils/causeRoutes';
import { getCategoryColor } from '../../utils/chartColors';
import { computeNiceTicks } from '../../utils/chartTicks';
import FormattedScientificValue from '../shared/FormattedScientificValue';
import FormattedScientificSvgText from '../shared/FormattedScientificSvgText';

/**
 * A reusable chart section for displaying entity impact data.
 */
const EntityChartSection = ({
  chartData,
  chartView,
  onViewChange,
  isTransitioning,
  toggleComponent,
  entityType,
  className = '',
  // Minimum chart height; tall category lists grow at ~55px per row.
  containerHeight = 384,
  combinedAssumptions = null,
}) => {
  const chartTitle =
    entityType === 'donor'
      ? `Donation Causes by ${chartView === 'donations' ? 'Amount' : 'Lives Saved'}`
      : `Cause Areas by ${chartView === 'donations' ? 'Donation Amount' : 'Lives Saved'}`;

  const chartDescription =
    entityType === 'donor'
      ? chartView === 'donations'
        ? 'Showing distribution of known donations by cause'
        : 'Showing comparative impact (lives saved) by cause'
      : chartView === 'donations'
        ? 'Distribution of donations across cause areas'
        : 'Distribution of impact (lives saved) across cause areas';

  // Custom tooltip function for chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      if (!data || !data.payload) return null;

      const entry = data.payload;
      const value = entry.valueTarget; // Current displayed value
      const percentage = chartView === 'donations' ? entry.donationPercentage : entry.livesSavedPercentage;
      const effectiveCostPerLife =
        entry.effectiveCostPerLife !== undefined
          ? entry.effectiveCostPerLife
          : getEffectiveCostPerLifeFromCombined(combinedAssumptions, entry, getCurrentYear());

      return (
        <div className="impact-surface p-3 shadow-md">
          <p className="font-semibold text-sm">{entry.name}</p>
          {chartView === 'donations' ? (
            <>
              <p className="text-sm">{formatCurrency(value)}</p>
              <p className="text-xs text-muted">{`${percentage}% of known donations`}</p>
              {entry.name !== 'Other Causes' && entry.categoryId && (
                <div className="mt-1 border-t border-[var(--border-subtle)] pt-1">
                  <p className="text-xs text-muted">
                    Cost per life:{' '}
                    <FormattedScientificValue value={formatCurrency(effectiveCostPerLife)} variant="compact" />
                  </p>
                  <p className="text-xs text-muted">
                    Lives saved: <FormattedScientificValue value={formatRoundedLives(entry.livesSavedValue)} />
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <p className={`text-sm ${value < 0 ? 'text-danger' : 'text-success'}`}>
                {/* "lost" carries the sign, so the number is shown unsigned —
                    "-1,003 lives lost" was a double negative. */}
                <FormattedScientificValue value={formatRoundedLives(Math.abs(value))} />{' '}
                {Math.abs(Math.round(value)) === 1 ? 'life' : 'lives'} {value < 0 ? 'lost' : 'saved'}
              </p>
              <p className="text-xs text-muted">{`${percentage}% of total impact`}</p>
              {entry.name !== 'Other Causes' && entry.categoryId && (
                <div className="mt-1 border-t border-[var(--border-subtle)] pt-1">
                  <p className="text-xs text-muted">
                    Cost per life:{' '}
                    <FormattedScientificValue value={formatCurrency(effectiveCostPerLife)} variant="compact" />
                  </p>
                  <p className="text-xs text-muted">Donation amount: {formatCurrency(entry.donationValue)}</p>
                </div>
              )}
            </>
          )}
        </div>
      );
    }
    return null;
  };

  // Long category names overflow the fixed-width axis and get clipped
  // mid-word; wrap them onto two lines split at the space nearest the middle.
  const splitTickLabel = (text) => {
    if (text.length <= 16) {
      return [text];
    }

    const midpoint = text.length / 2;
    let splitIndex = -1;
    let bestDistance = Infinity;
    for (let index = 0; index < text.length; index += 1) {
      if (text[index] === ' ' && Math.abs(index - midpoint) < bestDistance) {
        bestDistance = Math.abs(index - midpoint);
        splitIndex = index;
      }
    }

    return splitIndex === -1 ? [text] : [text.slice(0, splitIndex), text.slice(splitIndex + 1)];
  };

  const renderTickText = (value, fill, className) => {
    const lines = splitTickLabel(value);

    return (
      <text x={-6} y={0} textAnchor="end" fill={fill} fontSize={14} className={className}>
        {lines.length === 1 ? (
          <tspan dy={4}>{lines[0]}</tspan>
        ) : (
          <>
            <tspan x={-6} dy={-3}>
              {lines[0]}
            </tspan>
            <tspan x={-6} dy={14}>
              {lines[1]}
            </tspan>
          </>
        )}
      </text>
    );
  };

  // Custom Y-axis tick renderer to make category names clickable
  const renderYAxisTick = (props) => {
    const { x, y, payload } = props;
    // Find the corresponding data entry to get the categoryId
    const dataEntry = chartData.find((item) => item.name === payload.value);

    if (!dataEntry || !dataEntry.categoryId || dataEntry.name === 'Other Causes') {
      return <g transform={`translate(${x},${y})`}>{renderTickText(payload.value, 'var(--text-strong)')}</g>;
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <Link to={buildCausePath(dataEntry.categoryId)}>
          {renderTickText(payload.value, 'var(--link-accent-strong)', 'hover:underline hover:font-medium')}
        </Link>
      </g>
    );
  };

  if (chartData.length === 0) {
    return null;
  }

  // One formatting brain for the value axis, used twice: recharts receives it
  // as tickFormatter so its overlap-based tick dropping measures the exact
  // strings we render, and renderValueAxisTick draws those same strings
  // through FormattedScientificSvgText (styled superscripts once values
  // reach scientific notation). Ticks use the compact K/M/B/T style — a
  // "450,000" tick crowds the axis on phones; full precision lives in the
  // tooltip and bar labels.
  const formatXAxisValue = (value) => {
    // Hold blank space while the toggle animation retargets values so ticks
    // don't repaint mid-flight — in both toggle directions.
    if (isTransitioning) {
      return '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';
    }
    if (value === 0) return '0';
    return chartView === 'donations' ? `$${formatCompactAxisNumber(value)}` : formatCompactAxisNumber(value);
  };

  const renderValueAxisTick = ({ x, y, payload, textAnchor = 'middle' }) => (
    <g transform={`translate(${x},${y})`}>
      <FormattedScientificSvgText
        value={formatXAxisValue(payload.value)}
        x={0}
        y={0}
        fill="var(--text-strong)"
        fontSize={14}
        textAnchor={textAnchor}
        dominantBaseline="hanging"
      />
    </g>
  );

  // Recharts calls Bar label content with geometry plus the row INDEX only —
  // no payload row — and plain label formatters receive just the value. Both
  // previous label mechanisms therefore silently rendered nothing; derive the
  // row from chartData by index instead.
  const renderBarLabel = (props) => {
    const { x, y, width, height, value, index } = props;
    const entry = chartData[index];
    if (!entry || value === undefined || isTransitioning) {
      return null;
    }

    const isLivesView = chartView === 'livesSaved';
    const percentage = isLivesView ? entry.livesSavedPercentage : entry.donationPercentage;
    const label = isLivesView ? formatRoundedLives(entry.livesSavedValue) : formatCurrency(entry.donationValue);
    // Recharts hands a negative bar its rect with x at the ZERO edge and a
    // negative width extending left (positive bars: x at zero, width to the
    // right), so `x + width` is a negative bar's far-left edge — anchoring
    // there drew the label on top of the bar. Anchor at the rect's rightmost
    // edge instead: the zero line for negative bars, the bar end for
    // positive ones. Pinned against real recharts geometry in
    // ImpactBarChart.test.jsx.
    const labelX = Math.max(x, x + width) + 8;

    return (
      <FormattedScientificSvgText
        value={label}
        suffix={` (${percentage}%)`}
        x={labelX}
        y={y + height / 2}
        fill="var(--text-muted)"
        fontSize={12}
        fontWeight={400}
        textAnchor="start"
        dominantBaseline="middle"
      />
    );
  };

  // Negative values (lives lost) need an explicitly pinned domain so the axis
  // keeps a zero baseline with bars extending both ways — but recharts only
  // rounds ticks for 'auto' domains; a pinned one gets sliced into equal
  // steps from the raw minimum (ticks like 5,497). So compute round ticks
  // and the matching domain ourselves. Positive-only data stays on
  // [0, 'auto'], where recharts rounds ticks itself.
  const targetValues = chartData.map((item) => item.valueTarget);
  const niceScale = targetValues.some((value) => value < 0)
    ? computeNiceTicks(Math.min(0, ...targetValues), Math.max(0, ...targetValues))
    : null;

  return (
    <ChartContainer
      title={chartTitle}
      description={chartDescription}
      view={chartView}
      onViewChange={onViewChange}
      toggleComponent={toggleComponent}
      isTransitioning={isTransitioning}
      className={className}
    >
      <div style={{ height: Math.max(containerHeight, chartData.length * 55) }}>
        <ImpactBarChart
          data={chartData}
          dataKey="valueTarget"
          nameKey="name"
          colors={chartData.map((entry) => {
            if (chartView === 'livesSaved' && entry && entry.value < 0) {
              return '#ef4444';
            }
            return getCategoryColor(entry.categoryId || entry.id || entry.name);
          })}
          tooltipContent={<CustomTooltip />}
          formatXAxisTick={formatXAxisValue}
          renderXAxisTick={renderValueAxisTick}
          xAxisDomain={niceScale ? niceScale.domain : [0, 'auto']}
          xAxisTicks={niceScale ? niceScale.ticks : undefined}
          renderBarLabel={renderBarLabel}
          barCategoryGap={chartData.length > 10 ? 4 : chartData.length > 6 ? 8 : 16}
          heightCalculator={(dataLength) => Math.max(containerHeight, dataLength * 55)}
          isAnimationActive={true}
          animationDuration={600}
          animationBegin={0}
          animationEasing="ease-in-out"
          showLegend={true}
          legendFormatter={() => (chartView === 'donations' ? 'Donation Amount (By Cause)' : 'Lives Saved (By Cause)')}
          renderYAxisTick={renderYAxisTick}
        />
      </div>
    </ChartContainer>
  );
};

EntityChartSection.propTypes = {
  chartData: PropTypes.array.isRequired,
  chartView: PropTypes.string.isRequired,
  onViewChange: PropTypes.func.isRequired,
  isTransitioning: PropTypes.bool,
  toggleComponent: PropTypes.element.isRequired,
  entityType: PropTypes.oneOf(['donor', 'recipient']).isRequired,
  className: PropTypes.string,
  containerHeight: PropTypes.number,
  combinedAssumptions: PropTypes.object,
};

export default React.memo(EntityChartSection);
