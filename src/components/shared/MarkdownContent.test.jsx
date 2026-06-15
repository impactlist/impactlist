import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import MarkdownContent from './MarkdownContent';
import { CONTENT_TOOLTIPS } from '../../constants/contentTooltips';

describe('MarkdownContent', () => {
  it('renders internal routes using app navigation links', () => {
    render(
      <MemoryRouter>
        <MarkdownContent content='Visit [Animal Welfare](/cause/animal-welfare "Animal Welfare link").' delay={0} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Animal Welfare' });
    expect(link).toHaveAttribute('href', '/cause/animal-welfare');
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
    render(<MarkdownContent content="Visit [Animal Welfare](/cause/animal-welfare)." delay={0} />);

    const link = screen.getByRole('link', { name: 'Animal Welfare' });
    expect(link).toHaveAttribute('href', '/cause/animal-welfare');
    expect(link.tagName).toBe('A');
  });

  it('renders a #tooltip: link as the phrase plus an info-icon tooltip, not a hyperlink', () => {
    render(
      <MemoryRouter>
        <MarkdownContent content="The [plausible range](#tooltip:plausible-range) is wide." delay={0} />
      </MemoryRouter>
    );

    // The phrase stays as plain prose; there is no hyperlink.
    expect(screen.getByText(/plausible range/i)).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();

    // The definition lives behind an info-icon trigger labelled by the term, revealed on focus.
    const trigger = screen.getByRole('button', { name: /plausible range definition/i });
    expect(screen.queryByText(CONTENT_TOOLTIPS['plausible-range'])).toBeNull();
    fireEvent.focus(trigger);
    expect(screen.getByText(CONTENT_TOOLTIPS['plausible-range'])).toBeInTheDocument();
  });

  it('renders an unknown tooltip key as plain text rather than a broken link', () => {
    render(
      <MemoryRouter>
        <MarkdownContent content="See [mystery term](#tooltip:does-not-exist) here." delay={0} />
      </MemoryRouter>
    );

    expect(screen.getByText('mystery term')).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
