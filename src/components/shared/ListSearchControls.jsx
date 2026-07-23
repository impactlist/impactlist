import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from './SearchInput';
import AssumptionsSelector from './AssumptionsSelector';

/**
 * The toolbar above list-page tables. Search and the assumptions selector are
 * always present; pages can add one ranking-level filter between them without
 * duplicating the responsive list-toolbar layout.
 */
const ListSearchControls = ({ searchTerm, onSearchChange, placeholder, filterControl = null }) => (
  <div className="list-search-controls" data-has-filter={Boolean(filterControl)}>
    <div className="list-search-controls__search">
      <SearchInput value={searchTerm} onChange={onSearchChange} placeholder={placeholder} />
    </div>
    {filterControl && <div className="list-search-controls__filter">{filterControl}</div>}
    <div className="list-search-controls__assumptions">
      <AssumptionsSelector className="mb-0" />
    </div>
  </div>
);

ListSearchControls.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  filterControl: PropTypes.node,
};

export default ListSearchControls;
