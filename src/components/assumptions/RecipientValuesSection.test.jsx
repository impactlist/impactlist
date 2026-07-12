import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import RecipientValuesSection from './RecipientValuesSection';
import { createDefaultAssumptions } from '../../utils/assumptionsDataHelpers';
import { getCurrentYear } from '../../utils/donationDataHelpers';

const assumptionsData = createDefaultAssumptions();
const sampleRecipients = Object.entries(assumptionsData.recipients)
  .filter(([, recipient]) => Object.keys(recipient.categories || {}).length > 0)
  .slice(0, 2)
  .map(([id, recipient]) => ({ id, ...recipient }));

const renderSection = (props = {}) =>
  render(
    <MemoryRouter>
      <RecipientValuesSection
        filteredRecipients={sampleRecipients}
        totalMatches={sampleRecipients.length}
        isTruncated={false}
        onShowAllMatches={vi.fn()}
        onSearch={vi.fn()}
        searchTerm=""
        defaultAssumptions={assumptionsData}
        userAssumptions={null}
        onEditRecipient={vi.fn()}
        previewYear={getCurrentYear()}
        {...props}
      />
    </MemoryRouter>
  );

describe('RecipientValuesSection', () => {
  it('describes the default list as recipient-specific assumptions, not user customizations', () => {
    renderSection();

    expect(
      screen.getByText('Showing recipients with recipient-specific assumptions. Search to find any recipient.')
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Show all/ })).not.toBeInTheDocument();
  });

  it('reports truncated searches as a count of the whole, with a way to see everything', async () => {
    const user = userEvent.setup();
    const onShowAllMatches = vi.fn();
    renderSection({ searchTerm: 'foundation', totalMatches: 88, isTruncated: true, onShowAllMatches });

    expect(screen.getByText('Showing 2 of 88 matching recipients.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show all 88 matches' }));
    expect(onShowAllMatches).toHaveBeenCalledTimes(1);
  });

  it('reports complete search results without a show-all action', () => {
    renderSection({ searchTerm: 'foundation', totalMatches: 2, isTruncated: false });

    expect(screen.getByText('Showing 2 matching recipients.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Show all/ })).not.toBeInTheDocument();
  });

  it('links every card to its justification', () => {
    renderSection();

    const justificationLinks = screen.getAllByRole('link', { name: /Justification for/ });
    expect(justificationLinks).toHaveLength(sampleRecipients.length);
    expect(justificationLinks[0]).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/recipient\/.+#full-justification$/)
    );
  });
});
