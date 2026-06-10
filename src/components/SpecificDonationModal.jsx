import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import ModalShell, { ModalHeader } from './shared/ModalShell';
import CurrencyInput from './shared/CurrencyInput';
import { getRecipientId, getCurrentYear } from '../utils/donationDataHelpers';
import { getCostPerLifeFromCombined, getCostPerLifeForRecipientFromCombined } from '../utils/assumptionsDataHelpers';
import { formatLives, formatCurrency } from '../utils/formatters';
import { useAssumptions } from '../contexts/AssumptionsContext';
import FormattedScientificValue from './shared/FormattedScientificValue';

const SpecificDonationModal = ({ isOpen, onClose, onSave, editingDonation = null }) => {
  const { combinedAssumptions } = useAssumptions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [customRecipientName, setCustomRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCostPerLife, setCustomCostPerLife] = useState('');
  const [donationYear, setDonationYear] = useState(getCurrentYear().toString());
  const [errors, setErrors] = useState({});
  const [isExistingRecipient, setIsExistingRecipient] = useState(true);

  // Helper function to get a valid year for calculations
  const getValidYearForCalculation = useCallback(() => {
    const yearNum = parseInt(donationYear, 10);
    const currentYear = getCurrentYear();
    // Use current year as fallback if year is invalid or in the future
    return !donationYear || isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear ? currentYear : yearNum;
  }, [donationYear]);

  // References for search input and dropdown
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const allRecipients = useMemo(() => combinedAssumptions.getAllRecipients(), [combinedAssumptions]);
  const allCategories = useMemo(() => combinedAssumptions.getAllCategories(), [combinedAssumptions]);
  const sortedCategories = useMemo(
    () => [...allCategories].sort((a, b) => a.name.localeCompare(b.name)),
    [allCategories]
  );

  // State to control dropdown visibility
  const [showDropdown, setShowDropdown] = useState(false);

  // Track highlighted item for keyboard navigation
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [hasEditedCustomCostPerLife, setHasEditedCustomCostPerLife] = useState(false);

  // Filtered recipients based on search
  const filteredRecipients = useMemo(() => {
    if (!searchTerm || !showDropdown) return [];

    const term = searchTerm.toLowerCase();
    return allRecipients
      .filter((recipient) => recipient.name.toLowerCase().includes(term))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 10); // Limit to first 10 results
  }, [searchTerm, allRecipients, showDropdown]);

  // Callers pass the year explicitly (usually getValidYearForCalculation()).
  // Deliberately NOT dependent on the year field state: this callback is a
  // dependency of the init effect below, and an identity change mid-entry
  // would re-run resetForm and wipe the user's in-progress form.
  const getDefaultCustomCostPerLife = useCallback(
    (categoryId, year) => {
      if (!categoryId) {
        return '';
      }

      return String(getCostPerLifeFromCombined(combinedAssumptions, categoryId, year));
    },
    [combinedAssumptions]
  );

  // Initialize with editing data if provided
  useEffect(() => {
    if (editingDonation) {
      setAmount(editingDonation.amount.toString());

      // Set the year from the saved donation, or use current year as fallback
      if (editingDonation.date) {
        setDonationYear(editingDonation.date.toString());
      } else {
        setDonationYear(getCurrentYear().toString());
      }

      if (editingDonation.isCustomRecipient) {
        setIsExistingRecipient(false);
        setCustomRecipientName(editingDonation.recipientName);
        setSelectedCategory(editingDonation.categoryId);
        const editingYear = editingDonation.date ? parseInt(editingDonation.date, 10) : getCurrentYear();
        if (editingDonation.customCostPerLife !== undefined && editingDonation.customCostPerLife !== null) {
          setCustomCostPerLife(editingDonation.customCostPerLife.toString());
          setHasEditedCustomCostPerLife(true);
        } else if (editingDonation.multiplier) {
          const baseCostPerLife = getCostPerLifeFromCombined(
            combinedAssumptions,
            editingDonation.categoryId,
            editingYear
          );
          setCustomCostPerLife(String(baseCostPerLife * editingDonation.multiplier));
          setHasEditedCustomCostPerLife(true);
        } else if (editingDonation.categoryId) {
          setCustomCostPerLife(getDefaultCustomCostPerLife(editingDonation.categoryId, editingYear));
          setHasEditedCustomCostPerLife(false);
        }
      } else {
        setIsExistingRecipient(true);
        const recipient = allRecipients.find((r) => r.name === editingDonation.recipientName);
        setSelectedRecipient(recipient || null);
        setSearchTerm(recipient?.name || '');
      }
    } else {
      // Reset form when opening for a new donation
      resetForm();
    }

    // Always hide dropdown when initializing
    setShowDropdown(false);
  }, [allRecipients, combinedAssumptions, editingDonation, getDefaultCustomCostPerLife, isOpen]);

  // Reset highlighted index when filtered results change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredRecipients.length]);

  const resetForm = () => {
    setSearchTerm('');
    setSelectedRecipient(null);
    setCustomRecipientName('');
    setAmount('');
    setSelectedCategory('');
    setCustomCostPerLife('');
    setDonationYear(getCurrentYear().toString());
    setErrors({});
    setIsExistingRecipient(true);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    setHasEditedCustomCostPerLife(false);
  };

  useEffect(() => {
    if (isExistingRecipient || !selectedCategory || hasEditedCustomCostPerLife) {
      return;
    }

    setCustomCostPerLife(getDefaultCustomCostPerLife(selectedCategory, getValidYearForCalculation()));
  }, [
    getDefaultCustomCostPerLife,
    getValidYearForCalculation,
    hasEditedCustomCostPerLife,
    isExistingRecipient,
    selectedCategory,
  ]);

  const handleSelectRecipient = (recipient) => {
    setSelectedRecipient(recipient);
    setSearchTerm(recipient.name);
    setErrors({ ...errors, recipient: null });
    // Hide dropdown
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  // Handle keyboard navigation in dropdown
  const handleKeyDown = (e) => {
    if (!showDropdown || filteredRecipients.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prevIndex) => {
          const nextIndex = prevIndex < filteredRecipients.length - 1 ? prevIndex + 1 : prevIndex;
          scrollToHighlighted(nextIndex);
          return nextIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prevIndex) => {
          const nextIndex = prevIndex > 0 ? prevIndex - 1 : 0;
          scrollToHighlighted(nextIndex);
          return nextIndex;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredRecipients.length) {
          handleSelectRecipient(filteredRecipients[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Scroll to highlighted item in dropdown
  const scrollToHighlighted = (index) => {
    if (dropdownRef.current && index >= 0) {
      const highlightedElement = dropdownRef.current.children[index];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  };

  // Clean a number input value
  const cleanNumberInput = (value) => {
    return value.toString().replace(/,/g, '');
  };

  const handleSubmit = () => {
    // Hide dropdown when submitting
    setShowDropdown(false);

    const newErrors = {};

    // Validate recipient or custom recipient
    if (isExistingRecipient && !selectedRecipient) {
      newErrors.recipient = 'Please select a recipient';
    } else if (!isExistingRecipient && !customRecipientName.trim()) {
      newErrors.customRecipientName = 'Please enter a recipient name';
    }

    // Validate amount
    const cleanedAmount = cleanNumberInput(amount);
    if (!cleanedAmount || isNaN(Number(cleanedAmount)) || Number(cleanedAmount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    // Validate year
    const yearNum = parseInt(donationYear, 10);
    const currentYear = getCurrentYear();
    if (!donationYear || isNaN(yearNum)) {
      newErrors.year = 'Please enter a valid year';
    } else if (yearNum < 1900 || yearNum > currentYear) {
      newErrors.year = `Year must be between 1900 and ${currentYear}`;
    }

    // For custom recipients, validate category
    if (!isExistingRecipient) {
      if (!selectedCategory) {
        newErrors.category = 'Please select a cause';
      }

      const cleanedCustomCostPerLife = cleanNumberInput(customCostPerLife);
      if (!cleanedCustomCostPerLife) {
        newErrors.customCostPerLife = 'Please enter a valid cost per life';
      } else {
        const customCostPerLifeNum = Number(cleanedCustomCostPerLife);
        if (isNaN(customCostPerLifeNum)) {
          newErrors.customCostPerLife = 'Please enter a valid cost per life';
        } else if (customCostPerLifeNum === 0) {
          newErrors.customCostPerLife = 'Cost per life cannot be zero';
        }
      }
    }

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.keys(newErrors).length > 0;

    if (!hasErrors) {
      const donationData = {
        id: editingDonation?.id || new Date().getTime().toString(),
        recipientName: isExistingRecipient ? selectedRecipient.name : customRecipientName,
        amount: Number(cleanNumberInput(amount)),
        date: donationYear, // Store as string year (e.g., "2020")
        isCustomRecipient: !isExistingRecipient,
      };

      // Add category and effectiveness data for custom recipients
      if (!isExistingRecipient) {
        donationData.categoryId = selectedCategory;
        donationData.customCostPerLife = Number(cleanNumberInput(customCostPerLife));
      }

      onSave(donationData);
      resetForm();
      onClose();
    }
  };

  // Calculate lives saved for the current donation
  const calculateLivesSaved = () => {
    if (!amount || isNaN(Number(cleanNumberInput(amount))) || Number(cleanNumberInput(amount)) <= 0) {
      return 0;
    }

    if (!combinedAssumptions) {
      throw new Error('combinedAssumptions is required but does not exist.');
    }

    const cleanedAmount = Number(cleanNumberInput(amount));
    const yearToUse = getValidYearForCalculation();

    if (isExistingRecipient && selectedRecipient) {
      // For existing recipients, calculate based on their weighted categories
      const recipientId = getRecipientId(selectedRecipient);
      if (!recipientId) {
        throw new Error(`Could not find ID for recipient: ${selectedRecipient.name}`);
      }

      // Get actual cost per life for this recipient using combined assumptions
      const recipientCostPerLife = getCostPerLifeForRecipientFromCombined(combinedAssumptions, recipientId, yearToUse);
      return cleanedAmount / recipientCostPerLife;
    } else if (!isExistingRecipient && selectedCategory) {
      let effectiveCostPerLife = getCostPerLifeFromCombined(combinedAssumptions, selectedCategory, yearToUse);

      if (customCostPerLife && !isNaN(Number(cleanNumberInput(customCostPerLife)))) {
        effectiveCostPerLife = Number(cleanNumberInput(customCostPerLife));
      }

      return cleanedAmount / effectiveCostPerLife;
    }

    return 0;
  };

  const livesSaved = calculateLivesSaved();

  // Calculate cost per life for the selected recipient
  const getRecipientCostPerLife = () => {
    if (!isExistingRecipient || !selectedRecipient) return null;

    if (!combinedAssumptions) {
      throw new Error('combinedAssumptions is required but does not exist.');
    }

    const recipientId = getRecipientId(selectedRecipient);
    if (!recipientId) return null;

    const yearToUse = getValidYearForCalculation();
    return getCostPerLifeForRecipientFromCombined(combinedAssumptions, recipientId, yearToUse);
  };

  const recipientCostPerLife = selectedRecipient ? getRecipientCostPerLife() : null;

  const recipientToggleClass = (isActiveOption) =>
    `flex-1 ${isActiveOption ? 'impact-btn impact-btn--custom-accent' : 'impact-btn impact-btn--secondary'}`;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="specific-donation-modal-title"
      panelClassName="max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto"
    >
      <div data-testid="specific-donation-modal">
        <ModalHeader
          title={editingDonation ? 'Edit Donation' : 'Add Specific Donation'}
          titleId="specific-donation-modal-title"
          onClose={onClose}
        />

        <div className="mb-6">
          <div className="mb-4 flex gap-4">
            <button
              type="button"
              onClick={() => setIsExistingRecipient(true)}
              className={recipientToggleClass(isExistingRecipient)}
            >
              Existing Recipient
            </button>
            <button
              type="button"
              onClick={() => setIsExistingRecipient(false)}
              className={recipientToggleClass(!isExistingRecipient)}
            >
              New Recipient
            </button>
          </div>

          {isExistingRecipient ? (
            <div className="impact-field" data-state={errors.recipient ? 'error' : 'default'}>
              <label htmlFor="recipient-search" className="impact-field__label">
                Search for a recipient
              </label>
              <div className="relative">
                <div className="impact-field__control">
                  <input
                    id="recipient-search"
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                      setHighlightedIndex(-1);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type to search..."
                    className="impact-field__input"
                    onBlur={(e) => {
                      if (!e.relatedTarget || !e.relatedTarget.classList.contains('recipient-item')) {
                        setTimeout(() => setShowDropdown(false), 200);
                      }
                    }}
                  />
                </div>
                {showDropdown && searchTerm && filteredRecipients.length > 0 && (
                  <div
                    ref={dropdownRef}
                    role="listbox"
                    aria-label="Recipient search results"
                    className="impact-surface absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-sm shadow-lg focus:outline-none"
                  >
                    {filteredRecipients.map((recipient, index) => (
                      <div
                        key={recipient.name}
                        role="option"
                        aria-selected={index === highlightedIndex}
                        onClick={() => handleSelectRecipient(recipient)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleSelectRecipient(recipient);
                          }
                        }}
                        className={`recipient-item cursor-pointer px-4 py-2 text-strong ${
                          index === highlightedIndex
                            ? 'bg-[var(--accent-soft)]'
                            : 'hover:bg-[var(--accent-soft)] hover:bg-opacity-60'
                        }`}
                        tabIndex="0"
                      >
                        {recipient.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.recipient && <p className="impact-field__error">{errors.recipient}</p>}
              {searchTerm && filteredRecipients.length === 0 && showDropdown && !selectedRecipient && (
                <p className="mt-1 text-sm text-muted">No recipients found. Try another search term.</p>
              )}
              {selectedRecipient && recipientCostPerLife && (
                <p className="mt-1 text-xs text-muted">
                  Cost per life:{' '}
                  <FormattedScientificValue value={formatCurrency(recipientCostPerLife)} variant="compact" />
                </p>
              )}
            </div>
          ) : (
            <div>
              <div className="impact-field mb-4" data-state={errors.customRecipientName ? 'error' : 'default'}>
                <label htmlFor="custom-recipient-name" className="impact-field__label">
                  Recipient Name
                </label>
                <div className="impact-field__control">
                  <input
                    id="custom-recipient-name"
                    type="text"
                    value={customRecipientName}
                    onChange={(e) => setCustomRecipientName(e.target.value)}
                    placeholder="Enter recipient name"
                    className="impact-field__input"
                  />
                </div>
                {errors.customRecipientName && <p className="impact-field__error">{errors.customRecipientName}</p>}
              </div>

              <div className="impact-field mb-4" data-state={errors.category ? 'error' : 'default'}>
                <label htmlFor="custom-recipient-cause" className="impact-field__label">
                  Cause
                </label>
                <div className="impact-field__control">
                  <select
                    id="custom-recipient-cause"
                    value={selectedCategory}
                    onChange={(e) => {
                      const nextCategory = e.target.value;
                      setSelectedCategory(nextCategory);
                      setHasEditedCustomCostPerLife(false);
                      setCustomCostPerLife(
                        nextCategory ? getDefaultCustomCostPerLife(nextCategory, getValidYearForCalculation()) : ''
                      );
                    }}
                    className="impact-field__input"
                  >
                    <option value="">Select a cause</option>
                    {sortedCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.category && <p className="impact-field__error">{errors.category}</p>}
                {selectedCategory && (
                  <p className="mt-1 text-xs text-muted">
                    Default cost per life:{' '}
                    <FormattedScientificValue
                      value={formatCurrency(
                        getCostPerLifeFromCombined(combinedAssumptions, selectedCategory, getValidYearForCalculation())
                      )}
                      variant="compact"
                    />
                  </p>
                )}
              </div>

              <div className="mb-4">
                {/* Negative cost per life is legal here (domain rule), so the
                    input keeps the default text inputMode — iOS's decimal
                    keypad has no minus key. */}
                <CurrencyInput
                  id="custom-recipient-cost-per-life"
                  label="Cost per life"
                  value={customCostPerLife}
                  onChange={(value) => {
                    setCustomCostPerLife(value);
                    setHasEditedCustomCostPerLife(true);
                  }}
                  placeholder={
                    selectedCategory ? getDefaultCustomCostPerLife(selectedCategory, getValidYearForCalculation()) : '0'
                  }
                  error={errors.customCostPerLife}
                />
                <p className="mt-1 text-xs text-muted">
                  This starts at the selected cause&apos;s current cost per life, and you can edit it for this
                  recipient.
                </p>
                {customCostPerLife && !isNaN(Number(cleanNumberInput(customCostPerLife))) && (
                  <p className="mt-1 text-xs text-muted">
                    Recipient cost per life:{' '}
                    <FormattedScientificValue
                      value={formatCurrency(Number(cleanNumberInput(customCostPerLife)))}
                      variant="compact"
                    />
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Display information about selected recipient or cause */}
        {customRecipientName && !isExistingRecipient && selectedCategory && (
          <div className="mb-4 rounded-md bg-[var(--accent-soft)] p-3">
            <p className="text-sm text-strong">
              Cause: {allCategories.find((c) => c.id === selectedCategory)?.name || ''}
            </p>
          </div>
        )}

        <div className="mb-4">
          <CurrencyInput
            id="specific-donation-amount"
            label="Donation Amount"
            value={amount}
            onChange={setAmount}
            placeholder="0"
            error={errors.amount}
            inputMode="decimal"
          />
        </div>

        <div className="impact-field mb-4" data-state={errors.year ? 'error' : 'default'}>
          <label htmlFor="specific-donation-year" className="impact-field__label">
            Year
          </label>
          <div className="impact-field__control">
            <input
              id="specific-donation-year"
              type="text"
              inputMode="numeric"
              value={donationYear}
              onChange={(e) => setDonationYear(e.target.value)}
              placeholder={getCurrentYear().toString()}
              className="impact-field__input"
            />
          </div>
          {errors.year && <p className="impact-field__error">{errors.year}</p>}
        </div>

        {/* Lives saved preview */}
        {amount && !errors.amount && (
          <div
            className={`mb-4 rounded-md p-3 ${livesSaved < 0 ? 'bg-[var(--danger-soft)]' : 'bg-[var(--success-soft)]'}`}
          >
            <p className={`text-sm ${livesSaved < 0 ? 'text-danger' : 'text-success'}`}>
              Estimated lives saved:{' '}
              <span className="font-medium">
                {livesSaved < 0 ? '-' : ''}
                <FormattedScientificValue value={formatLives(Math.abs(livesSaved))} />
              </span>
            </p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="impact-btn impact-btn--secondary">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="impact-btn impact-btn--custom-accent flex-1">
            {editingDonation ? 'Update' : 'Add'} Donation
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

export default SpecificDonationModal;
