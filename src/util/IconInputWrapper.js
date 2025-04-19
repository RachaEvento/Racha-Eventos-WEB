// src/components/IconInputWrapper.jsx

import React from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const IconInputWrapper = React.memo(({ children, Icon, onIconClick }) => {
  const handleIconClick = () => {
    if (Icon === MdVisibility || Icon === MdVisibilityOff) {
      onIconClick?.();
    }
  };

  return (
    <div className="relative">
      {children}
      <div
        className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer"
        onClick={handleIconClick}
      >
        <Icon size={20} />
      </div>
    </div>
  );
});

export default IconInputWrapper;
