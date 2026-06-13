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

  it('links back to the top donors page', () => {
    renderPage();
    expect(screen.getByRole('link', { name: 'Back to top donors' })).toHaveAttribute('href', '/');
  });

  it('explains that some donor images are AI-generated synthetic images', () => {
    renderPage();
    expect(screen.getByText(/we used an AI-generated synthetic image instead/i)).toBeInTheDocument();
  });

  it('describes synthetic entries as images and photographs as photos', () => {
    renderPage();
    const synthetic = imageCredits.find((c) => c.license.startsWith('AI-generated'));
    const photo = imageCredits.find((c) => !c.license.startsWith('AI-generated'));
    expect(synthetic).toBeTruthy();
    expect(photo).toBeTruthy();

    const items = screen.getAllByRole('listitem');
    const syntheticItem = items.find((li) => within(li).queryByRole('link', { name: synthetic.name }));
    const photoItem = items.find((li) => within(li).queryByRole('link', { name: photo.name }));
    expect(syntheticItem).toHaveTextContent(/Image(,| by )/);
    expect(photoItem).toHaveTextContent(/Photo(,| by )/);
  });

  it('renders one entry per credited photo, each with source and license links', () => {
    renderPage();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(imageCredits.length);

    // Index each entry by its donor href in one pass, then look each credit up
    // directly. The previous nested scan (every item × every credit, each a
    // name-based query that resolves accessible names) was O(n²) and timed out
    // on CI as the list grew.
    const itemByDonorId = new Map();
    for (const item of items) {
      const profileLink = within(item)
        .getAllByRole('link')
        .find((link) => link.getAttribute('href')?.startsWith('/donor/'));
      expect(profileLink, 'each entry links to a donor profile').toBeTruthy();
      itemByDonorId.set(profileLink.getAttribute('href').replace('/donor/', ''), item);
    }

    for (const credit of imageCredits) {
      const item = itemByDonorId.get(credit.donorId);
      expect(item, `entry for ${credit.donorId}`).toBeTruthy();
      expect(within(item).getByRole('link', { name: credit.name })).toBeInTheDocument();
      const sourceLink = within(item).getByRole('link', { name: credit.sourceName });
      expect(sourceLink).toHaveAttribute('href', credit.sourceUrl);
      const licenseLink = within(item).getByRole('link', { name: credit.license });
      expect(licenseLink).toHaveAttribute('href', credit.licenseUrl);
    }
  });

  it('every credit entry documents a free license or a disclosed AI generation', () => {
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
