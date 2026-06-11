import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
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

describe('image inventory', () => {
  const smallDir = path.resolve(process.cwd(), 'public/images/people/small');
  const shippedIds = fs
    .readdirSync(smallDir)
    .filter((f) => /\.(jpe?g|png)$/i.test(f) && !f.startsWith('unknown.'))
    .map((f) => f.replace(/\.(jpe?g|png)$/i, ''));

  it('every shipped image has exactly one credit entry', () => {
    const creditCounts = new Map();
    for (const credit of imageCredits) {
      creditCounts.set(credit.donorId, (creditCounts.get(credit.donorId) ?? 0) + 1);
    }
    for (const id of shippedIds) {
      expect(creditCounts.get(id), `credit entries for shipped image ${id}`).toBe(1);
    }
  });

  it('every credit entry has a shipped image', () => {
    const shipped = new Set(shippedIds);
    for (const credit of imageCredits) {
      expect(shipped.has(credit.donorId), `shipped image for credit ${credit.donorId}`).toBe(true);
    }
  });

  it('every credit entry has an uncropped original (local checkouts only)', () => {
    // media/ is deliberately untracked (originals don't ship or get committed),
    // so this check can only run where the directory exists; CI skips it.
    const originalsDir = path.resolve(process.cwd(), 'media/people/original');
    if (!fs.existsSync(originalsDir)) return;
    const originals = new Set(fs.readdirSync(originalsDir).map((f) => f.replace(/\.[^.]+$/, '')));
    for (const credit of imageCredits) {
      expect(originals.has(credit.donorId), `original in media/people/original for ${credit.donorId}`).toBe(true);
    }
  });
});
