import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LivesSavedGraph from './LivesSavedGraph';

const areaPropsLog = [];
const areaChartPropsLog = [];
const tooltipPropsLog = [];

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: (props) => {
    areaChartPropsLog.push(props);
    return <div>{props.children}</div>;
  },
  Area: (props) => {
    areaPropsLog.push(props);
    return <div data-testid={`area-${props.dataKey}`} />;
  },
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: (props) => {
    tooltipPropsLog.push(props);
    return null;
  },
}));

describe('LivesSavedGraph', () => {
  beforeEach(() => {
    areaPropsLog.length = 0;
    areaChartPropsLog.length = 0;
    tooltipPropsLog.length = 0;
  });

  it('does not treat supplemental point fields as plotted series when explicit series metadata is provided', () => {
    const data = [
      { year: 2026, 'future-value': 100, population: 8300000000 },
      { year: 2027, 'future-value': 99, population: 8310000000 },
    ];

    render(
      <LivesSavedGraph
        data={data}
        seriesMetadataOverride={[
          {
            id: 'future-value',
            label: 'Future value',
          },
        ]}
        colorMode="effect"
        height={220}
      />
    );

    expect(screen.queryByRole('button', { name: /future value/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /population/i })).not.toBeInTheDocument();
  });

  it('renders area series with a smooth curve between points', () => {
    const data = [
      { year: 2026, baseline: 0.01 },
      { year: 2027, baseline: 0.038 },
      { year: 2043, baseline: 0.02 },
    ];

    render(
      <LivesSavedGraph
        data={data}
        seriesMetadataOverride={[
          {
            id: 'baseline',
            label: 'Baseline',
          },
        ]}
        colorMode="effect"
        height={220}
      />
    );

    expect(areaPropsLog).toHaveLength(1);
    expect(areaPropsLog[0].type).toBe('linear');
    expect(areaChartPropsLog).toHaveLength(1);
    expect(areaChartPropsLog[0].data).toEqual(data);
  });

  it('adds duplicate-year boundary points so zero-to-value transitions render vertically', () => {
    const data = [
      { year: 2026, baseline: 0 },
      { year: 2027, baseline: 0.038 },
      { year: 2042, baseline: 0.038 },
      { year: 2043, baseline: 0 },
    ];

    render(
      <LivesSavedGraph
        data={data}
        seriesMetadataOverride={[
          {
            id: 'baseline',
            label: 'Baseline',
          },
        ]}
        colorMode="effect"
        height={220}
      />
    );

    expect(areaChartPropsLog).toHaveLength(1);
    expect(areaChartPropsLog[0].data).toEqual([
      data[0],
      { year: 2027, baseline: 0, __boundaryClone: true, __realPoint: data[1] },
      data[1],
      data[2],
      { year: 2043, baseline: 0.038, __boundaryClone: true, __realPoint: data[3] },
      data[3],
    ]);
  });

  it('uses the real data point for tooltip values when hovering a duplicate-year boundary', () => {
    const data = [
      { year: 2026, baseline: 0 },
      { year: 2027, baseline: 10 },
      { year: 2028, baseline: 10 },
      { year: 2029, baseline: 0 },
    ];

    render(
      <LivesSavedGraph
        data={data}
        seriesMetadataOverride={[
          {
            id: 'baseline',
            label: 'Baseline',
          },
        ]}
        colorMode="effect"
        height={220}
        tooltipValueFormatter={(value) => value.toFixed(1)}
        tooltipUnitLabel="units"
      />
    );

    expect(tooltipPropsLog).toHaveLength(1);

    const boundaryClonePoint = areaChartPropsLog[0].data[1];
    const tooltipElement = React.cloneElement(tooltipPropsLog[0].content, {
      active: true,
      payload: [
        {
          dataKey: 'baseline',
          value: boundaryClonePoint.baseline,
          payload: boundaryClonePoint,
          color: '#2563eb',
        },
      ],
    });

    render(tooltipElement);

    expect(screen.getByText('Year: 2027')).toBeInTheDocument();
    expect(screen.getByText((_, element) => element?.textContent === '10.0 units')).toBeInTheDocument();
  });
});
