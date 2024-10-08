import React from 'react';

export const RunIcon: React.FC = () => {
  return (
    <svg
      style={{ fill: 'none' }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="2 2 20 20"
      strokeWidth={2.0}
      stroke="currentColor"
      className={'w-6 h-6 text-gray-700'}
    >
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/>
    </svg>
  );
};
