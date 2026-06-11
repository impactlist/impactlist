import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ImageCredits from './ImageCredits';
import { imageCredits } from '../data/imageCredits';

const renderPage = () =>
  render(
    <MemoryRouter>
      <ImageCredits />
    </MemoryRouter>
  );

describe('ImageCredits', () => {
  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /image credits/i })).toBeInTheDocument();
  });

  it('renders one entry per credited photo, each with source and license links', () => {
    renderPage();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(imageCredits.length);

    for (const credit of imageCredits) {
      const item = items.find((li) => within(li).queryByRole('link', { name: credit.name }));
      expect(item, `entry for ${credit.donorId}`).toBeTruthy();
      const sourceLink = within(item).getByRole('link', { name: credit.sourceName });
      expect(sourceLink).toHaveAttribute('href', credit.sourceUrl);
      const licenseLink = within(item).getByRole('link', { name: credit.license });
      expect(licenseLink).toHaveAttribute('href', credit.licenseUrl);
    }
  });

  it('every credit entry documents a free license or a labeled AI generation', () => {
    const freeLicense = /^(CC BY(-SA)?( \d\.\d)?|CC0( \d\.\d)?|Public domain|AI-generated)/i;
    for (const credit of imageCredits) {
      expect(credit.license, `${credit.donorId} license`).toMatch(freeLicense);
      expect(credit.sourceUrl, `${credit.donorId} sourceUrl`).toMatch(/^https?:\/\//);
    }
  });
});
