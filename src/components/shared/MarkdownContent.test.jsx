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

  it('renders a :::details directive as a collapsed <details> block with markdown inside', () => {
    render(
      <MemoryRouter>
        <MarkdownContent
          content={[
            'Intro line stays visible.',
            '',
            ':::details{title="How we derived the figure"}',
            'The cost is $\\frac{1}{2}$ the prior, per [GiveWell](https://www.givewell.org).',
            ':::',
            '',
          ].join('\n')}
          delay={0}
        />
      </MemoryRouter>
    );

    // The title renders as the <summary>, and the block is collapsed by default (no `open`).
    const summary = screen.getByText('How we derived the figure');
    expect(summary.tagName).toBe('SUMMARY');
    const details = summary.closest('details');
    expect(details).toBeInTheDocument();
    expect(details).not.toHaveAttribute('open');

    // The body stays markdown: KaTeX math renders cleanly (no error node) and the link
    // keeps its new-tab target.
    expect(details.querySelector('.katex')).toBeInTheDocument();
    expect(details.querySelector('.katex-error')).toBeNull();
    expect(screen.getByRole('link', { name: 'GiveWell' })).toHaveAttribute('target', '_blank');
  });

  it('renders display math and escaped dollars inside a :::details block', () => {
    // Mirrors the heaviest math pattern the content pages put inside collapsibles:
    // inline math, a mid-line `$$...$$` display span, and literal `\$` inside it.
    render(
      <MemoryRouter>
        <MarkdownContent
          content={[
            'Headline claim stays visible.',
            '',
            ':::details{title="Worked calculation"}',
            'Microprobabilities averted: $0.0016 / 10^{-6} = 1{,}600$.',
            '',
            'Cost per microprobability: $$\\$1\\text{B} / 1{,}600 \\approx \\$625{,}000$$',
            ':::',
            '',
          ].join('\n')}
          delay={0}
        />
      </MemoryRouter>
    );

    const details = screen.getByText('Worked calculation').closest('details');
    expect(details).toBeInTheDocument();
    // Both the inline and the display span render as KaTeX, with no error node...
    expect(details.querySelectorAll('.katex').length).toBeGreaterThanOrEqual(2);
    expect(details.querySelector('.katex-error')).toBeNull();
    // ...and the `$$` delimiters were consumed, not left as literal text fragments.
    expect(details.textContent).not.toContain('$$');

    // A leaked escaped-dollar would surface as a literal `\$` in the visible text. KaTeX's
    // hidden MathML annotation legitimately echoes the TeX source (which contains `\$`),
    // so strip it before checking what the reader actually sees.
    const visible = details.cloneNode(true);
    visible.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
    expect(visible.textContent).not.toContain('\\$');
  });
});
