import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = ''
}) => {
  return (
    <label className={`flex items-center space-x-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div className={`w-5 h-5 border-2 rounded transition-all duration-200 ${
          checked 
            ? 'bg-purple-600 border-purple-600' 
            : 'bg-white border-gray-300 hover:border-gray-400'
        } ${disabled ? '' : 'focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2'}`}>
          {checked && (
            <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" strokeWidth={3} />
          )}
        </div>
      </div>
      {label && (
        <span className="text-sm text-gray-700 select-none">
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;