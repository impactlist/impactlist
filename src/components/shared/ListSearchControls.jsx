import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from './SearchInput';
import AssumptionsSelector from './AssumptionsSelector';

/**
 * The toolbar row above list-page tables: search box on the left, assumptions
 * selector on the right. On small screens they stack, selector first.
 */
const ListSearchControls = ({ searchTerm, onSearchChange, placeholder }) => (
  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div className="order-2 w-full sm:order-1 sm:max-w-md">
      <SearchInput value={searchTerm} onChange={onSearchChange} placeholder={placeholder} />
    </div>
    <div className="order-1 w-full min-w-0 sm:order-2">
      <AssumptionsSelector className="mb-0" />
    </div>
  </div>
);

ListSearchControls.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
};

export default ListSearchControls;
