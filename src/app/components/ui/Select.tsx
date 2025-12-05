"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string | number;
  onChange?: (e: { target: { value: string } }) => void;
  error?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string | number) => {
    if (onChange) {
      onChange({ target: { value: String(optionValue) } });
    }
    setIsOpen(false);
  };

  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value)
  );

  return (
    <div
      className={`relative flex flex-col gap-1 w-full ${className || ""}`}
      ref={containerRef}
    >
      <div
        className="relative pt-4 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {/* Label */}
        <label
          className={`
            absolute transition-all duration-300 pointer-events-none font-medium z-10
            ${
              isOpen || value
                ? "text-xs -top-0 text-[#B08D45]"
                : "text-sm top-4 text-gray-400 group-hover:text-gray-500"
            }
          `}
        >
          {label}
        </label>

        {/* Display Value Area */}
        <div
          className={`
            w-full bg-transparent py-2 border-b transition-all duration-300 flex items-center justify-between
            ${
              error
                ? "border-red-500"
                : isOpen
                ? "border-[#C5A059]"
                : "border-gray-200 group-hover:border-gray-300"
            }
          `}
        >
          <span
            className={`text-base ${
              value ? "text-gray-900" : "text-transparent"
            }`}
          >
            {selectedOption ? selectedOption.label : "Select"}
          </span>

          <ChevronDown
            className={`
              w-4 h-4 transition-all duration-300 
              ${
                error
                  ? "text-red-400"
                  : isOpen
                  ? "text-[#B08D45]"
                  : "text-gray-400 group-hover:text-gray-600"
              }
              ${isOpen ? "rotate-180" : ""}
            `}
          />
        </div>

        {/* Dropdown Menu */}
        <div
          className={`
            absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 shadow-xl rounded-sm z-50
            max-h-60 overflow-auto transition-all duration-200 origin-top
            ${
              isOpen
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 -translate-y-2 invisible pointer-events-none"
            }
          `}
          role="listbox"
        >
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <div
                key={opt.value}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(opt.value);
                }}
                role="option"
                aria-selected={isSelected}
                className={`
                  px-4 py-3 text-sm cursor-pointer flex items-center justify-between transition-colors
                  ${
                    isSelected
                      ? "bg-[#C5A059]/10 text-[#B08D45] font-medium"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                {opt.label}
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <span className="text-xs text-red-500 animate-pulse font-medium">
          {error}
        </span>
      )}
    </div>
  );
};
