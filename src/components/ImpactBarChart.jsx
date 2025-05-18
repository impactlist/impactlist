import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import {
  CHART_COLORS,
  CHART_MARGIN_WITH_LABELS,
  CHART_MARGIN_WITHOUT_LABELS,
  CHART_LARGE_WIDTH_THRESHOLD,
  CHART_MEDIUM_WIDTH_THRESHOLD,
  CHART_DEFAULT_WIDTH,
} from '../utils/constants';

// Optional chart toggle component that both DonorDetail and RecipientDetail can use
export const ImpactChartToggle = ({ chartView, onToggle, disabled }) => {
  return (
    <div className="flex items-center">
      <div className="p-0.5 bg-slate-100 rounded-lg flex text-xs sm:text-sm shadow-inner">
        <button
          onClick={() => onToggle('donations')}
          className={`px-3 py-2 font-medium rounded-md transition-all duration-200 ease-in-out flex items-center gap-1 ${
            chartView === 'donations' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
          disabled={disabled}
        >
          <span>Donations</span>
        </button>
        <button
          onClick={() => onToggle('livesSaved')}
          className={`px-3 py-2 font-medium rounded-md transition-all duration-200 ease-in-out flex items-center gap-1 ${
            chartView === 'livesSaved' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
          }`}
          disabled={disabled}
        >
          <span>Lives Saved</span>
        </button>
      </div>
    </div>
  );
};

const ImpactBarChart = ({
  data,
  layout = 'vertical',
  colors = CHART_COLORS,
  formatXAxisTick = (value) => `${value}%`,
  dataKey = 'percentage',
  nameKey = 'name',
  tooltipContent,
  xAxisDomain,
  barGap = 0,
  barCategoryGap = 8,
  labelFormatter = (value) => `${value}%`,
  heightCalculator = (dataLength) => Math.max(200, dataLength * 40),
  isAnimationActive = false,
  animationDuration = 0,
  animationBegin = 0,
  animationEasing = 'ease-out',
  showLegend = false,
  legendFormatter = () => 'Value',
}) => {
  const [containerWidth, setContainerWidth] = useState(800);
  const chartContainerRef = useRef(null);

  // Calculate responsive margins based on available width
  const calculateChartMargins = (width) => {
    // Linearly reduce margins as width decreases
    if (width >= CHART_LARGE_WIDTH_THRESHOLD) {
      // Full margins for wider screens
      return CHART_MARGIN_WITH_LABELS;
    } else if (width <= CHART_MEDIUM_WIDTH_THRESHOLD) {
      // Minimum margins for very narrow screens
      return CHART_MARGIN_WITHOUT_LABELS;
    } else {
      // Proportional margins for in-between widths
      const ratio = (width - CHART_MEDIUM_WIDTH_THRESHOLD) / CHART_MEDIUM_WIDTH_THRESHOLD; // 0 to 1
      return {
        top: CHART_MARGIN_WITH_LABELS.top,
        right: Math.round(
          CHART_MARGIN_WITHOUT_LABELS.right +
            (CHART_MARGIN_WITH_LABELS.right - CHART_MARGIN_WITHOUT_LABELS.right) * ratio
        ),
        left: Math.round(
          CHART_MARGIN_WITHOUT_LABELS.left + (CHART_MARGIN_WITH_LABELS.left - CHART_MARGIN_WITHOUT_LABELS.left) * ratio
        ),
        bottom: CHART_MARGIN_WITH_LABELS.bottom,
      };
    }
  };

  // Effect to handle chart container resizing
  useEffect(() => {
    const updateContainerWidth = () => {
      if (chartContainerRef.current) {
        const width = chartContainerRef.current.clientWidth;
        setContainerWidth(width);
      }
    };

    // Initial update
    updateContainerWidth();

    // Add resize listener
    window.addEventListener('resize', updateContainerWidth);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, []);

  // Handle case where some values might be negative
  const domain =
    xAxisDomain ||
    (() => {
      const values = data.map((item) => item[dataKey]);
      const hasNegativeValues = values.some((val) => val < 0);
      if (hasNegativeValues) {
        const minValue = Math.floor(Math.min(...values));
        const maxValue = Math.ceil(Math.max(...values));

        // If max is 0 (only negative values), ensure we include 0 in the domain
        const adjustedMax = maxValue < 0 ? 0 : maxValue;

        return [minValue, adjustedMax];
      } else {
        return [0, Math.ceil(Math.max(...values))];
      }
    })();

  return (
    <div
      className={`py-4 px-2 relative ${containerWidth < CHART_DEFAULT_WIDTH ? 'overflow-x-auto' : 'overflow-hidden'}`}
    >
      <div
        ref={chartContainerRef}
        className="w-full overflow-visible"
        style={{ height: `${heightCalculator(data.length)}px` }}
      >
        <ResponsiveContainer
          width="98%"
          height="100%"
          minWidth={containerWidth < CHART_DEFAULT_WIDTH ? CHART_DEFAULT_WIDTH : undefined}
        >
          <BarChart
            data={data}
            layout={layout}
            margin={calculateChartMargins(containerWidth)}
            barGap={barGap}
            barCategoryGap={barCategoryGap}
          >
            <XAxis
              type="number"
              tickFormatter={formatXAxisTick}
              domain={domain}
              axisLine={true}
              tick={{
                fill: '#1e293b',
                fontSize: 14,
              }}
              tickLine={true}
              stroke="#1e293b"
              // Ensure we show enough ticks for better readability
              tickCount={7}
              // Add padding to prevent labels from being cut off
              allowDataOverflow={true}
            />
            <YAxis
              type="category"
              dataKey={nameKey}
              width={120}
              tick={{
                fontSize: 14,
                fill: '#1e293b',
                dy: 0,
              }}
              axisLine={true}
              stroke="#1e293b"
              interval={0}
            />

            {tooltipContent && <Tooltip content={tooltipContent} cursor={false} />}

            {showLegend && <Legend formatter={legendFormatter} />}

            <Bar
              dataKey={dataKey}
              name="Value"
              radius={[0, 4, 4, 0]}
              label={{
                position: 'right',
                formatter: labelFormatter,
                fontSize: 12,
                fill: '#64748b',
              }}
              isAnimationActive={isAnimationActive}
              animationDuration={animationDuration}
              animationBegin={animationBegin}
              animationEasing={animationEasing}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.id || index}`}
                  fill={colors[index % colors.length]}
                  style={{
                    filter: 'brightness(1)',
                    transition: 'filter 0.2s ease-in-out',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.filter = 'brightness(1.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.filter = 'brightness(1)';
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ImpactBarChart;
