import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Header from './Header';

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
      <button type="button">outside target</button>
    </MemoryRouter>
  );

const getToggle = () => screen.getByRole('button', { name: 'Toggle mobile menu' });

describe('Header mobile menu', () => {
  it('exposes the disclosure state via aria-expanded', async () => {
    renderHeader();

    const toggle = getToggle();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'mobile-nav-menu');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    // The mobile menu adds a second FAQ link (the desktop one is hidden by
    // CSS only, which jsdom doesn't apply).
    expect(await screen.findAllByRole('link', { name: 'FAQ' })).toHaveLength(2);
  });

  it('closes on Escape and returns focus to the toggle', async () => {
    renderHeader();

    const toggle = getToggle();
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(globalThis, { key: 'Escape' });

    await waitFor(() => {
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });
    expect(toggle).toHaveFocus();
  });

  it('closes when clicking outside the header without stealing focus', async () => {
    renderHeader();

    const toggle = getToggle();
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    fireEvent.pointerDown(screen.getByRole('button', { name: 'outside target' }));

    await waitFor(() => {
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });
    expect(toggle).not.toHaveFocus();
  });
});
