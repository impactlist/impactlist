import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EntityChartSection from './EntityChartSection';

vi.mock('../charts/ChartContainer', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('../charts/ImpactBarChart', () => ({
  default: ({ renderBarLabel }) => (
    <svg data-testid="impact-chart">
      {renderBarLabel({ x: 100, y: 20, width: 40, height: 20, value: -1003, index: 0 })}
    </svg>
  ),
}));

describe('EntityChartSection', () => {
  it('places a negative bar label beyond the zero edge instead of beside the category axis', () => {
    const { container } = render(
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
      />
    );

    const label = container.querySelector('text');
    expect(label).toHaveAttribute('x', '148');
    expect(label).toHaveAttribute('text-anchor', 'start');
    expect(label).toHaveTextContent('-1,003 (2.6%)');
  });
});
