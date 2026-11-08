import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Initializing SENTRA Command Matrix...' }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
        <div className="absolute inset-0 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
        <div className="absolute inset-3 rounded-full border border-sky-500/30 animate-ping" />
        <div className="absolute inset-6 rounded-full bg-sky-600 shadow-sm" />
      </div>
      <p className="text-xs font-bold tracking-wider text-slate-500 uppercase animate-pulse">
        {message}
      </p>
    </div>
  );
};
