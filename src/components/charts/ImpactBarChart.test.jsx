import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ImpactBarChart from './ImpactBarChart';

// Real recharts throughout — but ResponsiveContainer measures 0×0 in jsdom,
// so swap it for a fixed-size passthrough to make the chart actually lay out.
vi.mock('recharts', async (importOriginal) => {
  const recharts = await importOriginal();
  return {
    ...recharts,
    ResponsiveContainer: ({ children }) => React.cloneElement(children, { width: 800, height: 400 }),
  };
});

const data = [
  { name: 'Positive', amount: 500 },
  { name: 'Negative', amount: -500 },
];

describe('ImpactBarChart', () => {
  it('feeds formatXAxisTick to the x-axis for default tick rendering', () => {
    render(<ImpactBarChart data={data} dataKey="amount" nameKey="name" formatXAxisTick={(value) => `F${value}F`} />);

    expect(screen.getAllByText(/^F.+F$/).length).toBeGreaterThan(0);
  });

  it('renders x-axis ticks through a custom renderer while the formatter stays wired for measurement', () => {
    const formatTick = vi.fn((value) => String(value));
    render(
      <ImpactBarChart
        data={data}
        dataKey="amount"
        nameKey="name"
        formatXAxisTick={formatTick}
        renderXAxisTick={({ x, y, payload }) => (
          <text data-testid="custom-tick" x={x} y={y}>
            {`C${payload.value}`}
          </text>
        )}
      />
    );

    expect(screen.getAllByTestId('custom-tick').length).toBeGreaterThan(0);
    // The formatter must be passed to recharts even when a custom renderer
    // draws the ticks: recharts' overlap-based tick dropping measures the
    // formatted strings, and dropping the formatter would make it measure
    // raw values that don't match what's drawn.
    expect(formatTick).toHaveBeenCalled();
  });

  it('renders explicitly provided x-axis ticks verbatim instead of slicing the domain', () => {
    // The round-tick fix for negative-value charts relies on recharts letting
    // an explicit `ticks` array win over its own generation (which slices a
    // pinned numeric domain into equal steps from the raw minimum).
    const { container } = render(
      <ImpactBarChart
        data={data}
        dataKey="amount"
        nameKey="name"
        xAxisDomain={[-600, 600]}
        xAxisTicks={[-600, -300, 0, 300, 600]}
        formatXAxisTick={(value) => `T${value}`}
      />
    );

    const renderedTicks = [...container.querySelectorAll('.recharts-xAxis .recharts-cartesian-axis-tick-value')].map(
      (node) => node.textContent
    );
    expect(renderedTicks).toEqual(['T-600', 'T-300', 'T0', 'T300', 'T600']);
  });

  it('hands bar labels rects whose rightmost edge is the zero line for negative bars', () => {
    const labelCalls = new Map();
    render(
      <ImpactBarChart
        data={data}
        dataKey="amount"
        nameKey="name"
        renderBarLabel={(props) => {
          labelCalls.set(props.index, props);
          return null;
        }}
      />
    );

    const positive = labelCalls.get(0);
    const negative = labelCalls.get(1);
    expect(positive).toBeDefined();
    expect(negative).toBeDefined();

    // Positive bars grow right from the zero line at their x. A negative
    // bar's rect must share that zero line as its RIGHTMOST edge — the
    // geometry EntityChartSection.renderBarLabel anchors its labels to
    // (recharts reports it as x at the zero edge with a negative width).
    const zeroEdge = positive.x;
    expect(Math.max(negative.x, negative.x + negative.width)).toBeCloseTo(zeroEdge, 5);
    expect(Math.min(negative.x, negative.x + negative.width)).toBeLessThan(zeroEdge);
  });
});
