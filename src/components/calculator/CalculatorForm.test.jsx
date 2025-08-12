import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CalculatorForm from './CalculatorForm';

// Mock categories data
const mockCategories = [
  { id: 'health', name: 'Global Health', recipients: ['amf', 'mc'] },
  { id: 'climate', name: 'Climate Change', recipients: ['cw', 'ei'] },
  { id: 'animal', name: 'Animal Welfare', recipients: ['mfa', 'gfi'] },
];

// Helper to render component with Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CalculatorForm', () => {
  const defaultProps = {
    categories: mockCategories,
    donations: {},
    onDonationChange: vi.fn(),
    onReset: vi.fn(),
    getLivesSavedForCategory: vi.fn(() => 10),
    getCostPerLifeForCategory: vi.fn(() => 5000),
  };

  it('should render all categories', () => {
    renderWithRouter(<CalculatorForm {...defaultProps} />);

    expect(screen.getByText('Global Health')).toBeInTheDocument();
    expect(screen.getByText('Climate Change')).toBeInTheDocument();
    expect(screen.getByText('Animal Welfare')).toBeInTheDocument();
  });

  it('should show reset button', () => {
    renderWithRouter(<CalculatorForm {...defaultProps} />);

    const resetButton = screen.getByText('Reset All Amounts');
    expect(resetButton).toBeInTheDocument();
  });

  it('should call onReset when reset button is clicked', () => {
    renderWithRouter(<CalculatorForm {...defaultProps} />);

    const resetButton = screen.getByText('Reset All Amounts');
    fireEvent.click(resetButton);

    expect(defaultProps.onReset).toHaveBeenCalledTimes(1);
  });

  it('should render input fields for each category', () => {
    renderWithRouter(<CalculatorForm {...defaultProps} />);

    const inputs = screen.getAllByPlaceholderText('0');
    expect(inputs).toHaveLength(mockCategories.length);
  });

  it('should call onDonationChange when input value changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CalculatorForm {...defaultProps} />);

    const inputs = screen.getAllByPlaceholderText('0');
    await user.type(inputs[0], '1000');

    // Check that onDonationChange was called
    expect(defaultProps.onDonationChange).toHaveBeenCalled();
  });

  it('should display formatted donation amounts', () => {
    const propsWithDonations = {
      ...defaultProps,
      donations: {
        health: '1000',
        climate: '5000',
      },
    };

    renderWithRouter(<CalculatorForm {...propsWithDonations} />);

    // The component formats numbers with commas
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveValue('1,000');
    expect(inputs[1]).toHaveValue('5,000');
  });

  it('should display lives saved for each category', () => {
    const propsWithDonations = {
      ...defaultProps,
      donations: {
        health: '1000',
      },
      getLivesSavedForCategory: vi.fn((categoryId, amount) => {
        if (categoryId === 'health' && amount === '1000') return 0.2;
        return 0;
      }),
    };

    renderWithRouter(<CalculatorForm {...propsWithDonations} />);

    // Should show lives saved for the health category
    expect(screen.getByText(/Lives saved:/)).toBeInTheDocument();
  });

  it('should display cost per life for each category', () => {
    const propsWithCostPerLife = {
      ...defaultProps,
      getCostPerLifeForCategory: vi.fn((categoryId) => {
        if (categoryId === 'health') return 5000;
        if (categoryId === 'climate') return 10000;
        return 20000;
      }),
    };

    renderWithRouter(<CalculatorForm {...propsWithCostPerLife} />);

    // Should show cost per life for each category - text is split across elements
    expect(screen.getByText(/\$5,000/)).toBeInTheDocument();
    expect(screen.getByText(/\$10,000/)).toBeInTheDocument();
    expect(screen.getByText(/\$20,000/)).toBeInTheDocument();
  });

  it('should render category links', () => {
    renderWithRouter(<CalculatorForm {...defaultProps} />);

    // Check that category names are links
    const healthLink = screen.getByRole('link', { name: /Global Health/i });
    expect(healthLink).toHaveAttribute('href', '/category/health');

    const climateLink = screen.getByRole('link', { name: /Climate Change/i });
    expect(climateLink).toHaveAttribute('href', '/category/climate');
  });

  it('should apply custom className', () => {
    const { container } = renderWithRouter(<CalculatorForm {...defaultProps} className="custom-class" />);

    const formElement = container.querySelector('.custom-class');
    expect(formElement).toBeInTheDocument();
  });

  it('should handle empty donations prop', () => {
    renderWithRouter(<CalculatorForm {...defaultProps} donations={{}} />);

    const inputs = screen.getAllByPlaceholderText('0');
    inputs.forEach((input) => {
      expect(input).toHaveValue('');
    });
  });

  it('should handle categories with no recipients', () => {
    const categoriesWithNoRecipients = [{ id: 'empty', name: 'Empty Category', recipients: [] }];

    const props = {
      ...defaultProps,
      categories: categoriesWithNoRecipients,
    };

    renderWithRouter(<CalculatorForm {...props} />);

    expect(screen.getByText('Empty Category')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
  });
});
