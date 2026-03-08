import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getRecipientId, getCurrentYear } from '../utils/donationDataHelpers';
import { getCostPerLifeFromCombined, getCostPerLifeForRecipientFromCombined } from '../utils/assumptionsDataHelpers';
import { formatLives, formatCurrency } from '../utils/formatters';
import { useAssumptions } from '../contexts/AssumptionsContext';

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
  const getValidYearForCalculation = () => {
    const yearNum = parseInt(donationYear, 10);
    const currentYear = getCurrentYear();
    // Use current year as fallback if year is invalid or in the future
    return !donationYear || isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear ? currentYear : yearNum;
  };

  // References for search input and dropdown
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const allRecipients = useMemo(() => combinedAssumptions.getAllRecipients(), [combinedAssumptions]);
  const allCategories = useMemo(() => combinedAssumptions.getAllCategories(), [combinedAssumptions]);

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

  const getDefaultCustomCostPerLife = useCallback(
    (categoryId, year = null) => {
      if (!categoryId) {
        return '';
      }

      // `year` is passed explicitly when hydrating an existing saved donation.
      // During normal modal interaction, we derive it from the current year field state.
      const parsedDonationYear = parseInt(donationYear, 10);
      const fallbackYear =
        !donationYear || isNaN(parsedDonationYear) || parsedDonationYear < 1900 || parsedDonationYear > getCurrentYear()
          ? getCurrentYear()
          : parsedDonationYear;
      const yearToUse = year ?? fallbackYear;

      return String(getCostPerLifeFromCombined(combinedAssumptions, categoryId, yearToUse));
    },
    [combinedAssumptions, donationYear]
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

    setCustomCostPerLife(getDefaultCustomCostPerLife(selectedCategory));
  }, [getDefaultCustomCostPerLife, hasEditedCustomCostPerLife, isExistingRecipient, selectedCategory]);

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

  // Format a number with commas
  const formatWithCommas = (value) => {
    if (!value) return '';

    const rawValue = value.toString().replace(/,/g, '');
    if (rawValue === '' || rawValue === '-' || rawValue === '.' || rawValue.endsWith('.')) {
      return rawValue;
    }

    const number = Number(rawValue);
    if (isNaN(number)) return rawValue;

    if (Math.abs(number) >= 1000) {
      return number.toLocaleString('en-US');
    }

    return rawValue;
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

  if (!isOpen) return null;

  return (
    <div
      data-testid="specific-donation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <motion.div
        className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {editingDonation ? 'Edit Donation' : 'Add Specific Donation'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setIsExistingRecipient(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium flex-1 ${
                  isExistingRecipient
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                Existing Recipient
              </button>
              <button
                type="button"
                onClick={() => setIsExistingRecipient(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium flex-1 ${
                  !isExistingRecipient
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                New Recipient
              </button>
            </div>

            {isExistingRecipient ? (
              <div>
                <label htmlFor="recipient-search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search for a recipient
                </label>
                <div className="relative">
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
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.recipient ? 'border-red-300' : 'border-gray-300'
                    }`}
                    onBlur={(e) => {
                      if (!e.relatedTarget || !e.relatedTarget.classList.contains('recipient-item')) {
                        setTimeout(() => setShowDropdown(false), 200);
                      }
                    }}
                  />
                  {showDropdown && searchTerm && filteredRecipients.length > 0 && (
                    <div
                      ref={dropdownRef}
                      role="listbox"
                      aria-label="Recipient search results"
                      className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
                    >
                      {filteredRecipients.map((recipient, index) => (
                        <div
                          key={recipient.name}
                          role="option"
                          aria-selected={index === highlightedIndex}
                          onClick={() => handleSelectRecipient(recipient)}
                          className={`cursor-pointer px-4 py-2 recipient-item ${
                            index === highlightedIndex ? 'bg-indigo-100 text-indigo-900' : 'hover:bg-indigo-50'
                          }`}
                          tabIndex="0"
                        >
                          {recipient.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.recipient && <p className="mt-1 text-sm text-danger">{errors.recipient}</p>}
                {searchTerm && filteredRecipients.length === 0 && showDropdown && !selectedRecipient && (
                  <p className="mt-1 text-sm text-gray-500">No recipients found. Try another search term.</p>
                )}
                {selectedRecipient && recipientCostPerLife && (
                  <p className="mt-1 text-xs text-gray-500">Cost per life: {formatCurrency(recipientCostPerLife)}</p>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <label htmlFor="custom-recipient-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Name
                  </label>
                  <input
                    id="custom-recipient-name"
                    type="text"
                    value={customRecipientName}
                    onChange={(e) => setCustomRecipientName(e.target.value)}
                    placeholder="Enter recipient name"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.customRecipientName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.customRecipientName && (
                    <p className="mt-1 text-sm text-danger">{errors.customRecipientName}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="custom-recipient-cause" className="block text-sm font-medium text-gray-700 mb-1">
                    Cause
                  </label>
                  <select
                    id="custom-recipient-cause"
                    value={selectedCategory}
                    onChange={(e) => {
                      const nextCategory = e.target.value;
                      setSelectedCategory(nextCategory);
                      setHasEditedCustomCostPerLife(false);
                      setCustomCostPerLife(nextCategory ? getDefaultCustomCostPerLife(nextCategory) : '');
                    }}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.category ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a cause</option>
                    {allCategories
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-danger">{errors.category}</p>}
                  {selectedCategory && (
                    <p className="mt-1 text-xs text-gray-500">
                      Default cost per life:{' '}
                      {formatCurrency(
                        getCostPerLifeFromCombined(combinedAssumptions, selectedCategory, getValidYearForCalculation())
                      )}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="custom-recipient-cost-per-life"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Cost per life
                  </label>
                  <input
                    id="custom-recipient-cost-per-life"
                    type="text"
                    inputMode="decimal"
                    value={formatWithCommas(customCostPerLife)}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setCustomCostPerLife(newValue);
                      setHasEditedCustomCostPerLife(true);
                    }}
                    placeholder={
                      selectedCategory ? formatWithCommas(getDefaultCustomCostPerLife(selectedCategory)) : '0'
                    }
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.customCostPerLife ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.customCostPerLife && <p className="mt-1 text-sm text-danger">{errors.customCostPerLife}</p>}
                  <p className="mt-1 text-xs text-gray-500">
                    This starts at the selected cause&apos;s current cost per life, and you can edit it for this
                    recipient.
                  </p>
                  {customCostPerLife && !isNaN(Number(cleanNumberInput(customCostPerLife))) && (
                    <p className="mt-1 text-xs text-gray-500">
                      Recipient cost per life: {formatCurrency(Number(cleanNumberInput(customCostPerLife)))}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Display information about selected recipient or cause */}
          {customRecipientName && !isExistingRecipient && selectedCategory && (
            <div className="mb-4 p-3 bg-indigo-50 rounded-md">
              <p className="text-sm text-indigo-600">
                Cause: {allCategories.find((c) => c.id === selectedCategory)?.name || ''}
              </p>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="specific-donation-amount" className="block text-sm font-medium text-gray-700 mb-1">
              Donation Amount
            </label>
            <div className="flex items-center">
              <span className="mr-1 text-gray-600">$</span>
              <input
                id="specific-donation-amount"
                type="text"
                inputMode="numeric"
                value={formatWithCommas(amount)}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.amount ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.amount && <p className="mt-1 text-sm text-danger">{errors.amount}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="specific-donation-year" className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              id="specific-donation-year"
              type="text"
              inputMode="numeric"
              value={donationYear}
              onChange={(e) => setDonationYear(e.target.value)}
              placeholder={getCurrentYear().toString()}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.year ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.year && <p className="mt-1 text-sm text-danger">{errors.year}</p>}
          </div>

          {/* Lives saved preview */}
          {amount && !errors.amount && (
            <div className={`mb-4 p-3 ${livesSaved < 0 ? 'bg-red-50' : 'bg-emerald-50'} rounded-md`}>
              <p className={`text-sm ${livesSaved < 0 ? 'text-danger' : 'text-success'}`}>
                Estimated lives saved:{' '}
                <span className="font-medium">
                  {livesSaved < 0 ? '-' : ''}
                  {formatLives(Math.abs(livesSaved))}
                </span>
              </p>
            </div>
          )}

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingDonation ? 'Update' : 'Add'} Donation
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SpecificDonationModal;
