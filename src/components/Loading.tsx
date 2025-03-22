import React from 'react';

export const Loading: React.FC = () => {
  return (
    <div className="mb-3 text-primary">
      <span
        className="spinner-border spinner-border-sm"
        aria-hidden="true"
      ></span>
      <span role="status">Загрузка...</span>
    </div>
  );
};
