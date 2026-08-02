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

// File scope on purpose: several suites below spy on browser APIs (layout
// geometry, rAF, scrollBy). A describe-scoped hook would let one suite's
// fabricated geometry leak into the next.
afterEach(() => {
  vi.restoreAllMocks();
});

describe('SortableTable', () => {
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

  it('keeps the aria-hidden sticky header clone out of the keyboard tab order', () => {
    const { container } = render(
      <SortableTable columns={columns} data={data} defaultSortColumn="costPerLife" defaultSortDirection="asc" />
    );

    const stickyClone = container.querySelector('table[aria-hidden="true"]');
    expect(stickyClone).not.toBeNull();
    stickyClone.querySelectorAll('button').forEach((button) => {
      expect(button).toHaveAttribute('tabindex', '-1');
    });
  });
});

// The stuck state must never cost keyboard users the ability to sort: the
// primary header stays enabled (the aria-hidden sticky clone intercepts only
// pointer input), and focusing a header control while stuck scrolls the real
// header back into view instead of leaving focus under the overlay.
describe('SortableTable stuck-header keyboard access', () => {
  // Geometry that makes the component consider its header stuck: table top
  // above the viewport top, plenty of table still below the header.
  const mockStuckLayout = () => {
    vi.spyOn(window.Element.prototype, 'getBoundingClientRect').mockReturnValue({
      top: -50,
      bottom: 500,
      height: 50,
      width: 600,
      left: 0,
      right: 600,
      x: 0,
      y: -50,
      toJSON: () => ({}),
    });
  };

  it('keeps the primary sort buttons enabled and working while the header is stuck', () => {
    mockStuckLayout();
    const { container } = render(
      <SortableTable columns={columns} data={data} defaultSortColumn="costPerLife" defaultSortDirection="asc" />
    );

    expect(container.querySelector('.impact-table-shell')).toHaveAttribute('data-header-stuck', 'true');

    const table = screen.getByRole('table');
    const sortButton = within(table).getByRole('button', { name: 'Sort by Cost Per Life' });
    expect(sortButton).toBeEnabled();

    fireEvent.click(sortButton);
    expect(getDataRowNames()).toEqual(['Bravo', 'Delta', 'Alpha', 'Charlie']);
  });

  it('scrolls a stuck header back into view when a header control receives focus', () => {
    mockStuckLayout();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback();
      return 0;
    });
    const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => {});
    render(<SortableTable columns={columns} data={data} defaultSortColumn="costPerLife" defaultSortDirection="asc" />);

    fireEvent.focusIn(within(screen.getByRole('table')).getByRole('button', { name: 'Sort by Cost Per Life' }));

    // Scrolls up by the table's overshoot plus the reveal offset, so the
    // header lands just below the un-stick threshold.
    expect(scrollBy).toHaveBeenCalledWith({ top: -58 });
  });

  it('does not scroll on header focus when the header is not stuck', () => {
    // Same geometry, but with the table top comfortably inside the viewport.
    vi.spyOn(window.Element.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 120,
      bottom: 670,
      height: 50,
      width: 600,
      left: 0,
      right: 600,
      x: 0,
      y: 120,
      toJSON: () => ({}),
    });
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback();
      return 0;
    });
    const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => {});
    render(<SortableTable columns={columns} data={data} defaultSortColumn="costPerLife" defaultSortDirection="asc" />);

    fireEvent.focusIn(within(screen.getByRole('table')).getByRole('button', { name: 'Sort by Cost Per Life' }));

    expect(scrollBy).not.toHaveBeenCalled();
  });
});

// A metric column offers several sort keys behind one header (the donor
// list's Donated column: $ amount and % of net worth). Rows may legitimately
// have no value for a metric (percent of an unknown net worth is null) — those
// rows pin after every valued row regardless of direction.
describe('SortableTable metric toggle columns', () => {
  const metricColumns = [
    { key: 'name', label: 'Name' },
    {
      key: 'totalDonated',
      label: 'Donated',
      metrics: [
        { key: 'totalDonated', label: '$', ariaLabel: 'Sort by amount donated' },
        { key: 'percentDonated', label: '%', ariaLabel: 'Sort by percent of net worth donated' },
      ],
    },
  ];

  const metricData = [
    { name: 'Alpha', totalDonated: 100, percentDonated: 0.5 },
    { name: 'Bravo', totalDonated: 400, percentDonated: 0.1 },
    { name: 'Charlie', totalDonated: 200, percentDonated: null },
    { name: 'Delta', totalDonated: 300, percentDonated: 0.9 },
  ];

  const renderMetricTable = (extraColumns = metricColumns) =>
    render(
      <SortableTable columns={extraColumns} data={metricData} defaultSortColumn="name" defaultSortDirection="asc" />
    );

  it('sorts by the % metric with no-value rows pinned last in both directions', () => {
    renderMetricTable();
    const table = screen.getByRole('table');
    const percentButton = within(table).getByRole('button', { name: 'Sort by percent of net worth donated' });

    fireEvent.click(percentButton);
    expect(getDataRowNames()).toEqual(['Delta', 'Alpha', 'Bravo', 'Charlie']);

    fireEvent.click(percentButton);
    expect(getDataRowNames()).toEqual(['Bravo', 'Alpha', 'Delta', 'Charlie']);
  });

  it('sorts by the first metric when the column label itself is clicked', () => {
    renderMetricTable();
    const table = screen.getByRole('table');

    fireEvent.click(within(table).getByRole('button', { name: 'Sort by Donated' }));

    expect(getDataRowNames()).toEqual(['Bravo', 'Delta', 'Charlie', 'Alpha']);
  });

  it('reports the metric sort through aria-sort and the pressed segment', () => {
    renderMetricTable();
    const table = screen.getByRole('table');

    fireEvent.click(within(table).getByRole('button', { name: 'Sort by percent of net worth donated' }));

    expect(within(table).getByRole('columnheader', { name: /Donated/ })).toHaveAttribute('aria-sort', 'descending');
    expect(within(table).getByRole('button', { name: 'Sort by percent of net worth donated' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(within(table).getByRole('button', { name: 'Sort by amount donated' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('passes the active sort to cell render functions so cells can react to it', () => {
    renderMetricTable([
      { ...metricColumns[0], render: (item, { sortColumn }) => `${item.name}:${sortColumn}` },
      metricColumns[1],
    ]);
    const table = screen.getByRole('table');

    fireEvent.click(within(table).getByRole('button', { name: 'Sort by percent of net worth donated' }));

    expect(getDataRowNames()).toEqual([
      'Delta:percentDonated',
      'Alpha:percentDonated',
      'Bravo:percentDonated',
      'Charlie:percentDonated',
    ]);
  });
});
