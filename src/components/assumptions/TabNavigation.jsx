import React, { useRef } from 'react';
import PropTypes from 'prop-types';

const TabNavigation = ({ activeTab, onTabChange, tabs, idBase = 'assumptions' }) => {
  const tabRefs = useRef([]);

  const handleKeyDown = (event, index) => {
    const lastIndex = tabs.length - 1;
    let nextIndex = index;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      nextIndex = index >= lastIndex ? 0 : index + 1;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      nextIndex = index <= 0 ? lastIndex : index - 1;
    } else if (event.key === 'Home') {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      nextIndex = lastIndex;
    } else {
      return;
    }

    const nextTab = tabs[nextIndex];
    if (!nextTab) {
      return;
    }

    onTabChange(nextTab.id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="impact-tabs" role="tablist" aria-label="Assumption sections">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          id={`${idBase}-tab-${tab.id}`}
          ref={(element) => {
            tabRefs.current[index] = element;
          }}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${idBase}-panel-${tab.id}`}
          tabIndex={activeTab === tab.id ? 0 : -1}
          onKeyDown={(event) => handleKeyDown(event, index)}
          data-active={activeTab === tab.id}
          className="impact-tab"
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
  idBase: PropTypes.string,
};

export default TabNavigation;
