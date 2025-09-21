import React from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  disabled?: boolean;
  className?: string;
}

const Radio: React.FC<RadioProps> = ({
  options,
  value,
  onChange,
  name,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex items-center space-x-2 cursor-pointer ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="relative">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="sr-only"
            />
            <div className={`w-5 h-5 border-2 rounded-full transition-all duration-200 ${
              value === option.value
                ? 'bg-purple-600 border-purple-600'
                : 'bg-white border-gray-300 hover:border-gray-400'
            } ${disabled ? '' : 'focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2'}`}>
              {value === option.value && (
                <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>
          </div>
          <span className="text-sm text-gray-700 select-none">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
};

export default Radio;