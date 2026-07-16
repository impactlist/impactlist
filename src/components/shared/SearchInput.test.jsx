import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import SearchInput from './SearchInput';

const ControlledSearch = () => {
  const [value, setValue] = useState('Alice');
  return <SearchInput value={value} onChange={setValue} placeholder="Search donors..." />;
};

describe('SearchInput', () => {
  it('has an accessible name and returns focus to the input after clearing', async () => {
    const user = userEvent.setup();
    render(<ControlledSearch />);

    const input = screen.getByRole('textbox', { name: 'Search donors...' });
    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });
});
