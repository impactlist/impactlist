import React, { useRef } from 'react';
import PropTypes from 'prop-types';

const TabNavigation = ({ activeTab, onTabChange, tabs, idBase = 'assumptions', badges = {} }) => {
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
    <div className="impact-tabs impact-tabs--attached" role="tablist" aria-label="Assumption sections">
      {tabs.map((tab, index) => {
        const badge = badges[tab.id];
        const badgeDescriptionId = `${idBase}-tab-${tab.id}-badge`;

        return (
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
            // The badge is an accessible DESCRIPTION, not part of the name:
            // the tab keeps announcing (and matching queries) as its label,
            // with the badge state read after it.
            aria-describedby={badge ? badgeDescriptionId : undefined}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onKeyDown={(event) => handleKeyDown(event, index)}
            data-active={activeTab === tab.id}
            className="impact-tab"
          >
            {tab.label}
            {badge && (
              <>
                <span className="impact-tab__badge" aria-hidden="true">
                  {badge.count}
                </span>
                {/* hidden keeps this out of the tab's accessible name while
                    aria-describedby still reads it as the description. */}
                <span id={badgeDescriptionId} hidden>
                  {badge.description}
                </span>
              </>
            )}
          </button>
        );
      })}
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
  badges: PropTypes.objectOf(
    PropTypes.shape({
      count: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
    })
  ),
};

export default TabNavigation;
