import React from 'react';

const Tooltip = ({ children, content }) => {
  return (
    <div className="relative inline-flex items-center group">
      <div className="cursor-help">{children}</div>
      <div
        className="absolute z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 
                   bg-gray-900 text-white text-sm rounded-md px-3 py-2 
                   left-full ml-2 top-1/2 transform -translate-y-1/2
                   w-64 whitespace-normal"
        role="tooltip"
      >
        {content}
        <div className="absolute top-1/2 right-full transform -translate-y-1/2 -mr-1">
          <div className="border-4 border-transparent border-r-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
