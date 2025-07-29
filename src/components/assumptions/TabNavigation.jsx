import React from 'react';
import PropTypes from 'prop-types';

const TabNavigation = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="flex space-x-4 border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === tab.id ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

TabNavigation.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TabNavigation;
