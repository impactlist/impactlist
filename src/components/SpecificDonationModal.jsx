import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { getRecipientId, getCurrentYear } from '../utils/donationDataHelpers';
import { getCostPerLifeFromCombined, getCostPerLifeForRecipientFromCombined } from '../utils/assumptionsDataHelpers';
import { formatNumber, formatLives } from '../utils/formatters';
import { useAssumptions } from '../contexts/AssumptionsContext';

const SpecificDonationModal = ({ isOpen, onClose, onSave, editingDonation = null }) => {
  const { combinedAssumptions } = useAssumptions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [customRecipientName, setCustomRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [multiplier, setMultiplier] = useState('');
  const [costPerLife, setCostPerLife] = useState('');
  const [donationYear, setDonationYear] = useState(getCurrentYear().toString());
  const [errors, setErrors] = useState({});
  const [isExistingRecipient, setIsExistingRecipient] = useState(true);

  // References for search input and dropdown
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const allRecipients = useMemo(() => combinedAssumptions.getAllRecipients(), [combinedAssumptions]);
  const allCategories = useMemo(() => combinedAssumptions.getAllCategories(), [combinedAssumptions]);

  // State to control dropdown visibility
  const [showDropdown, setShowDropdown] = useState(false);

  // Track highlighted item for keyboard navigation
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Filtered recipients based on search
  const filteredRecipients = useMemo(() => {
    if (!searchTerm || !showDropdown) return [];

    const term = searchTerm.toLowerCase();
    return allRecipients
      .filter((recipient) => recipient.name.toLowerCase().includes(term))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 10); // Limit to first 10 results
  }, [searchTerm, allRecipients, showDropdown]);

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
        if (editingDonation.multiplier) {
          setMultiplier(editingDonation.multiplier.toString());
        } else if (editingDonation.costPerLife) {
          setCostPerLife(editingDonation.costPerLife.toString());
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
  }, [editingDonation, isOpen, allRecipients]);

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
    setMultiplier('');
    setCostPerLife('');
    setDonationYear(getCurrentYear().toString());
    setErrors({});
    setIsExistingRecipient(true);
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

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
    if (!donationYear || isNaN(yearNum)) {
      newErrors.year = 'Please enter a valid year';
    } else if (yearNum < 1900 || yearNum > 2100) {
      newErrors.year = 'Year must be between 1900 and 2100';
    }

    // For custom recipients, validate category and at least one of multiplier or costPerLife
    if (!isExistingRecipient) {
      if (!selectedCategory) {
        newErrors.category = 'Please select a category';
      }

      const cleanedMultiplier = cleanNumberInput(multiplier);
      const cleanedCostPerLife = cleanNumberInput(costPerLife);

      if (cleanedMultiplier && isNaN(Number(cleanedMultiplier))) {
        newErrors.multiplier = 'Please enter a valid multiplier';
      }

      if (cleanedCostPerLife) {
        const costPerLifeNum = Number(cleanedCostPerLife);
        if (isNaN(costPerLifeNum)) {
          newErrors.costPerLife = 'Please enter a valid cost per life';
        } else if (costPerLifeNum === 0) {
          newErrors.costPerLife = 'Cost per life cannot be zero';
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

        const cleanedMultiplier = cleanNumberInput(multiplier);
        const cleanedCostPerLife = cleanNumberInput(costPerLife);

        if (cleanedMultiplier) {
          donationData.multiplier = Number(cleanedMultiplier);
        } else if (cleanedCostPerLife) {
          donationData.costPerLife = Number(cleanedCostPerLife);
        }
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

    if (isExistingRecipient && selectedRecipient) {
      // For existing recipients, calculate based on their weighted categories
      const recipientId = getRecipientId(selectedRecipient);
      if (!recipientId) {
        throw new Error(`Could not find ID for recipient: ${selectedRecipient.name}`);
      }

      // Get actual cost per life for this recipient using combined assumptions
      const recipientCostPerLife = getCostPerLifeForRecipientFromCombined(
        combinedAssumptions,
        recipientId,
        parseInt(donationYear, 10) || getCurrentYear()
      );
      return cleanedAmount / recipientCostPerLife;
    } else if (!isExistingRecipient && selectedCategory) {
      let effectiveCostPerLife;

      if (multiplier && !isNaN(Number(cleanNumberInput(multiplier)))) {
        const multiplierValue = Number(cleanNumberInput(multiplier));
        const baseCostPerLife = getCostPerLifeFromCombined(
          combinedAssumptions,
          selectedCategory,
          parseInt(donationYear, 10) || getCurrentYear()
        );
        effectiveCostPerLife = baseCostPerLife / multiplierValue;
      } else if (costPerLife && !isNaN(Number(cleanNumberInput(costPerLife)))) {
        effectiveCostPerLife = Number(cleanNumberInput(costPerLife));
      } else {
        effectiveCostPerLife = getCostPerLifeFromCombined(
          combinedAssumptions,
          selectedCategory,
          parseInt(donationYear, 10) || getCurrentYear()
        );
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

    return getCostPerLifeForRecipientFromCombined(
      combinedAssumptions,
      recipientId,
      parseInt(donationYear, 10) || getCurrentYear()
    );
  };

  const recipientCostPerLife = selectedRecipient ? getRecipientCostPerLife() : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden"
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
                      className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
                    >
                      {filteredRecipients.map((recipient, index) => (
                        <div
                          key={recipient.name}
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
                {errors.recipient && <p className="mt-1 text-sm text-red-600">{errors.recipient}</p>}
                {searchTerm && filteredRecipients.length === 0 && showDropdown && !selectedRecipient && (
                  <p className="mt-1 text-sm text-gray-500">No recipients found. Try another search term.</p>
                )}
                {selectedRecipient && recipientCostPerLife && (
                  <p className="mt-1 text-xs text-gray-500">
                    Default cost per life: ${formatNumber(recipientCostPerLife)}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={customRecipientName}
                    onChange={(e) => setCustomRecipientName(e.target.value)}
                    placeholder="Enter recipient name"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.customRecipientName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.customRecipientName && (
                    <p className="mt-1 text-sm text-red-600">{errors.customRecipientName}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.category ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {allCategories
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                  {selectedCategory && (
                    <p className="mt-1 text-xs text-gray-500">
                      Default cost per life: $
                      {formatNumber(
                        getCostPerLifeFromCombined(
                          combinedAssumptions,
                          selectedCategory,
                          parseInt(donationYear, 10) || getCurrentYear()
                        )
                      )}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Effectiveness</p>

                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-1">
                      Multiplier (makes recipient more effective)
                    </label>
                    <input
                      type="text"
                      inputMode="text"
                      value={formatWithCommas(multiplier)}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setMultiplier(newValue);
                        setCostPerLife(''); // Clear cost per life when editing multiplier
                      }}
                      placeholder="1.0"
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.multiplier ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.multiplier && <p className="mt-1 text-sm text-red-600">{errors.multiplier}</p>}
                    {multiplier && selectedCategory && !isNaN(Number(cleanNumberInput(multiplier))) && (
                      <p className="mt-1 text-xs text-gray-500">
                        Cost per life: $
                        {formatNumber(
                          getCostPerLifeFromCombined(
                            combinedAssumptions,
                            selectedCategory,
                            parseInt(donationYear, 10) || getCurrentYear()
                          ) / Number(cleanNumberInput(multiplier))
                        )}
                      </p>
                    )}
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm text-gray-600 mb-1">OR Direct Cost Per Life</label>
                    <div className="flex items-center">
                      <span className="mr-1 text-gray-600">$</span>
                      <input
                        type="text"
                        inputMode="text"
                        value={formatWithCommas(costPerLife)}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setCostPerLife(newValue);
                          setMultiplier(''); // Clear multiplier when editing cost per life
                        }}
                        placeholder={
                          selectedCategory
                            ? formatNumber(
                                getCostPerLifeFromCombined(
                                  combinedAssumptions,
                                  selectedCategory,
                                  parseInt(donationYear, 10) || getCurrentYear()
                                )
                              )
                            : '0'
                        }
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.costPerLife ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.costPerLife && <p className="mt-1 text-sm text-red-600">{errors.costPerLife}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Display information about selected recipient or category */}
          {customRecipientName && !isExistingRecipient && selectedCategory && (
            <div className="mb-4 p-3 bg-indigo-50 rounded-md">
              <p className="text-sm text-indigo-600">
                Category: {allCategories.find((c) => c.id === selectedCategory)?.name || ''}
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Donation Amount</label>
            <div className="flex items-center">
              <span className="mr-1 text-gray-600">$</span>
              <input
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
            {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="text"
              inputMode="numeric"
              value={donationYear}
              onChange={(e) => setDonationYear(e.target.value)}
              placeholder={getCurrentYear().toString()}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.year ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
          </div>

          {/* Lives saved preview */}
          {amount && !errors.amount && (
            <div className={`mb-4 p-3 ${livesSaved < 0 ? 'bg-red-50' : 'bg-emerald-50'} rounded-md`}>
              <p className={`text-sm ${livesSaved < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
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
