"use client";

import React, { InputHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`flex flex-col gap-1 w-full ${className || ""}`}>
      <div className="relative pt-4">
        <label
          className={`
            absolute transition-all duration-300 pointer-events-none font-medium
            ${
              isFocused
                ? "text-xs top-0 text-[#B08D45]"
                : props.value
                ? "text-xs top-0 text-gray-500"
                : "text-sm top-4 text-gray-400"
            }
          `}
        >
          {label}
        </label>
        <input
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            w-full bg-transparent py-2 border-b transition-all duration-300 outline-none placeholder-transparent
            hover:text-gray-700
            ${
              error
                ? "border-red-500 text-red-900"
                : isFocused
                ? "border-[#C5A059] text-gray-900"
                : "border-gray-200 text-gray-800"
            }
          `}
          placeholder={label}
        />
      </div>
      {error && (
        <span className="text-xs text-red-500 animate-pulse font-medium">
          {error}
        </span>
      )}
    </div>
  );
};
