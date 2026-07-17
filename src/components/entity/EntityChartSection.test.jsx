import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EntityChartSection from './EntityChartSection';

const captured = vi.hoisted(() => ({ props: null }));

vi.mock('../charts/ChartContainer', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('../charts/ImpactBarChart', () => ({
  default: (props) => {
    captured.props = props;
    // Real recharts geometry for a negative bar: x at the zero edge, width
    // extending LEFT (pinned by ImpactBarChart.test.jsx).
    return (
      <svg data-testid="impact-chart">
        {props.renderBarLabel({ x: 100, y: 20, width: -40, height: 20, value: -1003, index: 0 })}
      </svg>
    );
  },
}));

const renderSection = (props = {}) =>
  render(
    <EntityChartSection
      chartData={[
        {
          id: 'ai-capabilities',
          categoryId: 'ai-capabilities',
          name: 'AI Capabilities / AGI Development',
          value: -1003,
          valueTarget: -1003,
          livesSavedValue: -1003,
          livesSavedPercentage: 2.6,
          donationValue: 1000000,
          donationPercentage: 4,
        },
      ]}
      chartView="livesSaved"
      onViewChange={vi.fn()}
      isTransitioning={false}
      toggleComponent={<button type="button">Toggle</button>}
      entityType="donor"
      {...props}
    />
  );

const renderAxisTick = (value) => {
  const { container } = render(<svg>{captured.props.renderXAxisTick({ x: 0, y: 0, payload: { value } })}</svg>);
  return container.querySelector('text');
};

describe('EntityChartSection', () => {
  it('places a negative bar label beyond the zero edge instead of over the bar', () => {
    const { container } = renderSection();

    const label = container.querySelector('text');
    expect(label).toHaveAttribute('x', '108');
    expect(label).toHaveAttribute('text-anchor', 'start');
    expect(label).toHaveTextContent('-1,003 (2.6%)');
  });

  // Both views share one axis-tick path: the same formatter feeds recharts'
  // overlap measurement AND the baseline-safe SVG renderer, so the two can
  // never disagree (the old donations/lives split let a Safari-only baseline
  // bug ship in just one view).
  it('renders donations-view axis ticks compact through the shared baseline-safe renderer', () => {
    renderSection({ chartView: 'donations' });

    expect(captured.props.formatXAxisTick(1500000)).toBe('$1.5 M');
    expect(captured.props.formatXAxisTick(450000)).toBe('$450 K');
    const tick = renderAxisTick(1500000);
    expect(tick).toHaveAttribute('dy', '0.71em');
    expect(tick).not.toHaveAttribute('dominant-baseline');
    expect(tick).toHaveTextContent('$1.5 M');
  });

  it('renders lives-view axis ticks compact, with styled superscripts at scientific magnitudes', () => {
    renderSection();

    expect(captured.props.formatXAxisTick(450000)).toBe('450 K');
    expect(captured.props.formatXAxisTick(-1003)).toBe('-1 K');

    const value = 2.4e22;
    expect(captured.props.formatXAxisTick(value)).toBe('2.40 × 10²²');
    const tick = renderAxisTick(value);
    expect(tick).toHaveAttribute('dy', '0.71em');
    const superscript = [...tick.querySelectorAll('tspan')].find((tspan) => tspan.getAttribute('dy') === '-0.42em');
    expect(superscript).toBeDefined();
  });

  it('blanks axis ticks during the toggle transition in both views', () => {
    renderSection({ isTransitioning: true });
    expect(captured.props.formatXAxisTick(5000).trim()).toBe('');

    renderSection({ chartView: 'donations', isTransitioning: true });
    expect(captured.props.formatXAxisTick(5000).trim()).toBe('');
  });
});
