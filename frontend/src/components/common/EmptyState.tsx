import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#243342] rounded-lg bg-[#0D151E]/40 my-4">
      <div className="p-3 bg-[#111C27] border border-[#243342] rounded-full text-[#91A0B3] mb-3">
        {icon || <ShieldAlert className="w-6 h-6 text-amber-500" />}
      </div>
      <h4 className="text-sm font-semibold text-[#E8EEF5] mb-1">{title}</h4>
      <p className="text-xs text-[#91A0B3] max-w-sm mb-4">{description}</p>
      {actionText && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
