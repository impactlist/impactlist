import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import FAQ from './FAQ';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

const renderPage = () =>
  render(
    <MemoryRouter>
      <FAQ />
    </MemoryRouter>
  );

describe('FAQ', () => {
  it('links to the image credits page from the donor photo question', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /expand question: where do the donor photos come from/i }));

    expect(screen.getByRole('link', { name: 'image credits' })).toHaveAttribute('href', '/image-credits');
  });
});
