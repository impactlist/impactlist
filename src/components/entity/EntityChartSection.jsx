import React from 'react';
import PropTypes from 'prop-types';
import ImpactBarChart from '../ImpactBarChart';
import ChartContainer from '../shared/ChartContainer';
import { formatNumber, formatCurrency } from '../../utils/formatters';

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
  containerHeight = 384,
}) => {
  const chartTitle =
    entityType === 'donor'
      ? `Donation Categories by ${chartView === 'donations' ? 'Amount' : 'Lives Saved'}`
      : `Focus Areas by ${chartView === 'donations' ? 'Donation Amount' : 'Lives Saved'}`;

  const chartDescription =
    entityType === 'donor'
      ? chartView === 'donations'
        ? 'Showing distribution of known donations by category'
        : 'Showing comparative impact (lives saved) by category'
      : chartView === 'donations'
        ? 'Distribution of donations across focus areas'
        : 'Distribution of impact (lives saved) across focus areas';

  // Colors for the chart bars
  const COLORS = [
    '#4f46e5',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
    '#d946ef',
    '#818cf8',
    '#10b981',
    '#14b8a6',
    '#06b6d4',
    '#0ea5e9',
    '#22c55e',
    '#84cc16',
    '#34d399',
    '#eab308',
    '#f59e0b',
    '#f97316',
    '#ef4444',
    '#a3e635',
    '#fbbf24',
    '#fb923c',
    '#ec4899',
    '#db2777',
    '#be185d',
    '#9d174d',
    '#831843',
    '#3f3f46',
  ];

  // Custom tooltip function for chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      if (!data || !data.payload) return null;

      const entry = data.payload;
      const value = entry.valueTarget; // Current displayed value
      const percentage = chartView === 'donations' ? entry.donationPercentage : entry.livesSavedPercentage;

      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-slate-200">
          <p className="font-semibold text-sm">{entry.name}</p>
          {chartView === 'donations' ? (
            <>
              <p className="text-sm">{formatCurrency(value)}</p>
              <p className="text-xs text-slate-500">{`${percentage}% of known donations`}</p>
              {entry.name !== 'Other Categories' && entry.categoryId && (
                <div className="mt-1 pt-1 border-t border-slate-100">
                  <p className="text-xs text-slate-600">Cost per life: {formatCurrency(entry.costPerLife || 0)}</p>
                  <p className="text-xs text-slate-600">
                    Lives saved: {formatNumber(Math.round(entry.livesSavedValue))}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <p className={`text-sm ${value < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {formatNumber(Math.round(value))} lives {value < 0 ? 'lost' : 'saved'}
              </p>
              <p className="text-xs text-slate-500">{`${percentage}% of total impact`}</p>
              {entry.name !== 'Other Categories' && entry.categoryId && (
                <div className="mt-1 pt-1 border-t border-slate-100">
                  <p className="text-xs text-slate-600">Cost per life: {formatCurrency(entry.costPerLife || 0)}</p>
                  <p className="text-xs text-slate-600">Donation amount: {formatCurrency(entry.donationValue)}</p>
                </div>
              )}
            </>
          )}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return null;
  }

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
      <div style={{ height: containerHeight }}>
        <ImpactBarChart
          data={chartData}
          dataKey="valueTarget"
          nameKey="name"
          colors={COLORS.map((color, index) => {
            // Use red for negative values in lives saved view
            const entry = chartData[index];
            return chartView === 'livesSaved' && entry && entry.value < 0 ? '#ef4444' : color;
          })}
          tooltipContent={<CustomTooltip />}
          formatXAxisTick={(value) => {
            // Create placeholder space during transition
            if (isTransitioning) {
              return chartView === 'donations'
                ? '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'
                : '\u00A0\u00A0\u00A0\u00A0\u00A0';
            }

            if (value === 0) return '0';

            if (chartView === 'donations') {
              return formatCurrency(value);
            } else {
              // Use formatNumber for lives saved values
              return formatNumber(Math.round(value));
            }
          }}
          xAxisDomain={(() => {
            // If we're in lives saved view or transitioning to it, and there are negative values
            const hasNegativeValues = chartData.some((item) => item.valueTarget < 0);

            if (hasNegativeValues) {
              const minValue = Math.min(0, ...chartData.map((d) => d.valueTarget));
              const maxValue = Math.max(0, ...chartData.map((d) => d.valueTarget));
              return [minValue, maxValue];
            } else if (
              chartView === 'donations' ||
              (chartView === 'livesSaved' && !chartData.some((item) => item.livesSavedValue < 0))
            ) {
              return [0, 'auto'];
            } else {
              // During transition from negative lives saved to donations
              return [
                Math.min(0, ...chartData.map((d) => d.valueTarget)),
                Math.max(...chartData.map((d) => d.valueTarget)),
              ];
            }
          })()}
          labelFormatter={(value, entry) => {
            if (!entry) return '';

            const percentage = chartView === 'donations' ? entry.donationPercentage : entry.livesSavedPercentage;

            return chartView === 'donations'
              ? `${formatCurrency(entry.donationValue)} (${percentage}%)`
              : `${formatNumber(Math.round(entry.livesSavedValue))} (${percentage}%)`;
          }}
          barCategoryGap={chartData.length > 10 ? 4 : chartData.length > 6 ? 8 : 16}
          heightCalculator={(dataLength) => Math.max(containerHeight, dataLength * 55)}
          isAnimationActive={true}
          animationDuration={600}
          animationBegin={0}
          animationEasing="ease-in-out"
          showLegend={true}
          legendFormatter={() =>
            chartView === 'donations' ? 'Donation Amount (By Category)' : 'Lives Saved (By Category)'
          }
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
};

export default React.memo(EntityChartSection);
