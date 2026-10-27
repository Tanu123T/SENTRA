import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Initializing SENTRA Command Matrix...' }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-[#243342]" />
        <div className="absolute inset-0 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        <div className="absolute inset-3 rounded-full border border-amber-500/30 animate-ping" />
        <div className="absolute inset-6 rounded-full bg-amber-500" />
      </div>
      <p className="text-sm font-medium tracking-wider text-[#91A0B3] animate-pulse">
        {message}
      </p>
    </div>
  );
};
