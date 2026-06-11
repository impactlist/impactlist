import { render, screen, within, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SortableTable from './SortableTable';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'costPerLife', label: 'Cost Per Life' },
  { key: 'computed', label: 'Computed', sortable: false, render: () => 'X' },
];

// Negative cost per life is a legitimate domain value: donations to these
// recipients cause deaths. The comparator treats negatives as worse (higher
// cost) than any positive, and negatives closer to zero as worse than those
// further from zero.
const data = [
  { name: 'Alpha', costPerLife: 100 },
  { name: 'Bravo', costPerLife: -10 },
  { name: 'Charlie', costPerLife: 1 },
  { name: 'Delta', costPerLife: -1000 },
];

const getDataRowNames = () => {
  const rows = screen.getAllByRole('row');
  return rows.slice(1).map((row) => within(row).getAllByRole('cell')[0].textContent);
};

describe('SortableTable', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('orders negative cost-per-life values after positives, closest-to-zero last (ascending)', () => {
    render(<SortableTable columns={columns} data={data} defaultSortColumn="costPerLife" defaultSortDirection="asc" />);

    expect(getDataRowNames()).toEqual(['Charlie', 'Alpha', 'Delta', 'Bravo']);
  });

  it('reverses the cost-per-life order when the header is clicked to toggle direction', () => {
    render(<SortableTable columns={columns} data={data} defaultSortColumn="costPerLife" defaultSortDirection="asc" />);

    const table = screen.getByRole('table');
    fireEvent.click(within(table).getByRole('button', { name: 'Sort by Cost Per Life' }));

    expect(getDataRowNames()).toEqual(['Bravo', 'Delta', 'Alpha', 'Charlie']);
  });

  it('throws loudly when asked to sort a column no row has a value for', () => {
    // Silence React's logging of the (intentional) render error.
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() =>
      render(<SortableTable columns={columns} data={data} defaultSortColumn="lives" defaultSortDirection="desc" />)
    ).toThrow(/no row has a value for sort column "lives"/);
  });

  it('renders sortable: false columns with a disabled header that cannot trigger sorting', () => {
    render(<SortableTable columns={columns} data={data} defaultSortColumn="costPerLife" defaultSortDirection="asc" />);

    const table = screen.getByRole('table');
    const computedButton = within(table).getByText('Computed').closest('button');
    expect(computedButton).toBeDisabled();

    fireEvent.click(computedButton);

    expect(getDataRowNames()).toEqual(['Charlie', 'Alpha', 'Delta', 'Bravo']);
  });

  it('renders the empty message when there are no rows', () => {
    render(
      <SortableTable
        columns={columns}
        data={[]}
        defaultSortColumn="costPerLife"
        defaultSortDirection="asc"
        emptyMessage="No donors match your search."
      />
    );

    expect(screen.getByText('No donors match your search.')).toBeInTheDocument();
  });

  it('does not render the empty message when there are rows', () => {
    render(
      <SortableTable
        columns={columns}
        data={data}
        defaultSortColumn="costPerLife"
        defaultSortDirection="asc"
        emptyMessage="No donors match your search."
      />
    );

    expect(screen.queryByText('No donors match your search.')).not.toBeInTheDocument();
  });

  it('renders an empty body when there are no rows and no empty message', () => {
    render(<SortableTable columns={columns} data={[]} defaultSortColumn="costPerLife" defaultSortDirection="asc" />);

    expect(screen.getAllByRole('row')).toHaveLength(1); // header only
  });
});
