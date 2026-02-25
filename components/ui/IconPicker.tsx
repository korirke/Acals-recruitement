"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getIconComponent, getIconsByCategory, IconOption } from '../icons/IconRegistry';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  className?: string;
}

export const IconPicker = ({ value, onChange, className = '' }: IconPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Business');
  
  const iconsByCategory = getIconsByCategory();
  const categories = Object.keys(iconsByCategory);
  const CurrentIcon = getIconComponent(value);

  const handleIconSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 hover:border-primary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <CurrentIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          <span className="text-sm font-medium text-neutral-900 dark:text-white">
            {value || 'Select Icon'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Category Tabs */}
          <div className="flex border-b border-neutral-200 dark:border-neutral-700">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Icons Grid */}
          <div className="p-3 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-6 gap-2">
              {iconsByCategory[selectedCategory]?.map((icon: IconOption) => {
                const IconComponent = icon.component;
                const isSelected = value === icon.name;
                
                return (
                  <button
                    key={icon.name}
                    onClick={() => handleIconSelect(icon.name)}
                    className={`flex items-center justify-center p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
                      isSelected 
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' 
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                    title={icon.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};