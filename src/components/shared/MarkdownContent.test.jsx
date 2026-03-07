import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import MarkdownContent from './MarkdownContent';

describe('MarkdownContent', () => {
  it('renders internal routes using app navigation links', () => {
    render(
      <MemoryRouter>
        <MarkdownContent content='Visit [Animal Welfare](/category/animal-welfare "Animal Welfare link").' delay={0} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Animal Welfare' });
    expect(link).toHaveAttribute('href', '/category/animal-welfare');
    expect(link).not.toHaveAttribute('target');
    expect(link).toHaveAttribute('title', 'Animal Welfare link');
  });

  it('renders external links with a new-tab target', () => {
    render(
      <MemoryRouter>
        <MarkdownContent
          content="Read [Wikipedia](https://en.wikipedia.org/wiki/Quality-adjusted_life_year)."
          delay={0}
        />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Wikipedia' });
    expect(link).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Quality-adjusted_life_year');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('falls back to a normal anchor for internal routes outside router context', () => {
    render(<MarkdownContent content="Visit [Animal Welfare](/category/animal-welfare)." delay={0} />);

    const link = screen.getByRole('link', { name: 'Animal Welfare' });
    expect(link).toHaveAttribute('href', '/category/animal-welfare');
    expect(link.tagName).toBe('A');
  });
});
