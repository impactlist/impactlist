import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FormattedScientificSvgText from './FormattedScientificSvgText';

const renderSvgText = (props) => {
  const { container } = render(
    <svg>
      <FormattedScientificSvgText value="18,497" x={0} y={0} {...props} />
    </svg>
  );
  return container.querySelector('text');
};

describe('FormattedScientificSvgText', () => {
  // iOS Safari does not apply a <text>'s dominant-baseline to <tspan>
  // content, which drew the lives-saved x-axis ticks a line too high, on top
  // of the chart. The component must position text with a dy shift and never
  // emit the dominant-baseline attribute.
  it('emulates the hanging baseline with a dy shift instead of dominant-baseline', () => {
    const text = renderSvgText({ dominantBaseline: 'hanging' });
    expect(text).not.toHaveAttribute('dominant-baseline');
    expect(text).toHaveAttribute('dy', '0.71em');
    expect(text).toHaveTextContent('18,497');
  });

  it('emulates the middle baseline used by bar labels the same way', () => {
    const text = renderSvgText({ dominantBaseline: 'middle' });
    expect(text).not.toHaveAttribute('dominant-baseline');
    expect(text).toHaveAttribute('dy', '0.355em');
  });

  it('keeps the superscript exponent relative to the shifted baseline for scientific values', () => {
    const text = renderSvgText({ value: '2.4 × 10²²', dominantBaseline: 'hanging' });
    expect(text).toHaveAttribute('dy', '0.71em');
    expect(text).toHaveAttribute('aria-label', '2.4 × 10²²');

    const tspans = [...text.querySelectorAll('tspan')];
    const exponent = tspans.find((tspan) => tspan.textContent === '22');
    expect(exponent).toHaveAttribute('dy', '-0.42em');
  });
});
