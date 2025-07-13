import React, { useState, useEffect } from 'react';
import { useGlobalParameters } from './GlobalParametersContext';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalParametersEditor = () => {
  const {
    globalParameters,
    updateGlobalParameters,
    recipientEffectOverrides,
    resetToDefaults,
    isModalOpen,
    closeModal,
  } = useGlobalParameters();

  // Local state for form values
  const [formValues, setFormValues] = useState(globalParameters);
  const [activeTab, setActiveTab] = useState('global');

  // Update form values when global parameters change
  useEffect(() => {
    setFormValues(globalParameters);
  }, [globalParameters]);

  // Handle input changes
  const handleInputChange = (paramName, value) => {
    setFormValues((prev) => ({
      ...prev,
      [paramName]: value === '' ? '' : Number(value),
    }));
  };

  // Handle form submission
  const handleSave = () => {
    const validValues = {};
    Object.keys(formValues).forEach((key) => {
      if (formValues[key] !== '' && !isNaN(formValues[key])) {
        validValues[key] = Number(formValues[key]);
      }
    });
    updateGlobalParameters(validValues);
    closeModal();
  };

  // Handle reset
  const handleReset = () => {
    resetToDefaults();
    closeModal();
  };

  // Handle cancel
  const handleCancel = () => {
    setFormValues(globalParameters);
    closeModal();
  };

  if (!isModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={handleCancel}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <h2 className="text-2xl font-bold">Global Parameters & Impact Settings</h2>
            <p className="text-blue-100 mt-2">Configure global parameters that affect all impact calculations</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('global')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'global'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Global Parameters
              </button>
              <button
                onClick={() => setActiveTab('recipients')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'recipients'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Recipient Overrides
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {activeTab === 'global' && (
              <div className="space-y-6">
                {/* Animal Welfare Weights */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Animal Welfare Weights (relative to humans = 1.0)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Simple Animals</label>
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        value={formValues.simpleAnimalWeight || ''}
                        onChange={(e) => handleInputChange('simpleAnimalWeight', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Medium Complexity Animals</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formValues.mediumAnimalWeight || ''}
                        onChange={(e) => handleInputChange('mediumAnimalWeight', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Complex Animals</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formValues.complexAnimalWeight || ''}
                        onChange={(e) => handleInputChange('complexAnimalWeight', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.3"
                      />
                    </div>
                  </div>
                </div>

                {/* Temporal Parameters */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Temporal Parameters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Discount Rate (annual)</label>
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        max="1"
                        value={formValues.discountRate || ''}
                        onChange={(e) => handleInputChange('discountRate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.05"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Rate at which future benefits are discounted (e.g., 0.05 = 5%)
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Horizon (years)</label>
                      <input
                        type="number"
                        min="1"
                        value={formValues.timeHorizon || ''}
                        onChange={(e) => handleInputChange('timeHorizon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="100"
                      />
                      <p className="text-sm text-gray-500 mt-1">Maximum time horizon for considering effects</p>
                    </div>
                  </div>
                </div>

                {/* Population Parameters */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Population Parameters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Population Growth Rate (annual)
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        value={formValues.populationGrowthRate || ''}
                        onChange={(e) => handleInputChange('populationGrowthRate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.01"
                      />
                      <p className="text-sm text-gray-500 mt-1">Annual population growth rate (e.g., 0.01 = 1%)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Population</label>
                      <input
                        type="number"
                        min="1000000"
                        value={formValues.currentPopulation || ''}
                        onChange={(e) => handleInputChange('currentPopulation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="8000000000"
                      />
                      <p className="text-sm text-gray-500 mt-1">Current global population</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Population Limit (multiple)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formValues.populationLimit || ''}
                        onChange={(e) => handleInputChange('populationLimit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Leave empty for no limit"
                      />
                      <p className="text-sm text-gray-500 mt-1">Maximum population as multiple of current (optional)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recipients' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Recipient Effect Overrides</h3>
                <p className="text-gray-600 mb-4">
                  {recipientEffectOverrides
                    ? 'Custom recipient overrides are active. Use the recipient detail pages to modify specific overrides.'
                    : 'No custom recipient overrides are currently set. Visit individual recipient pages to set custom parameters for specific effects.'}
                </p>
                {recipientEffectOverrides && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <pre className="text-sm text-gray-800 overflow-auto">
                      {JSON.stringify(recipientEffectOverrides, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <button onClick={handleReset} className="px-4 py-2 text-red-600 hover:text-red-800 font-medium">
              Reset to Defaults
            </button>
            <div className="space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlobalParametersEditor;
