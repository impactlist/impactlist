import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LivesSavedGraph from './LivesSavedGraph';

describe('LivesSavedGraph', () => {
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
});
