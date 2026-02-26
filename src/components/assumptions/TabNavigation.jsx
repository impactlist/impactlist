import React from 'react';
import PropTypes from 'prop-types';

const TabNavigation = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="inline-flex rounded-lg bg-slate-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-indigo-100'
              : 'text-slate-500 hover:text-slate-700'
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
