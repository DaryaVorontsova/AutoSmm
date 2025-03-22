import React from 'react';

export const Error: React.FC<{ message: string | null }> = ({ message }) => {
  return (
    <div className="invalid-feedback d-block mb-3 text-center">{message}</div>
  );
};
