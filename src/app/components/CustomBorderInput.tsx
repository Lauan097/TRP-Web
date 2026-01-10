'use client'

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ComponentProps, useState } from "react";

interface CustomBorderInputProps extends ComponentProps<typeof Input> {
  label: string;
  maxLength?: number;
  value?: string;
  className?: string;
}

export default function CustomBorderInput({
  label,
  maxLength,
  value,
  className,
  ...props
}: CustomBorderInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const length = String(value || "").length;
  const isAtLimit = maxLength ? length >= maxLength : false;  

  return (
    <div className="relative w-full">

      <Input
        value={value}
        maxLength={maxLength}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "bg-[#202022] h-10 peer",
          "outline-none focus:outline-none focus:ring-0 focus:ring-transparent",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          isFocused && isAtLimit ? "border-red-500" : 
          isFocused ? "border-blue-500" : "border-gray-500",
          className
        )}
        {...props}
      />

      <label
        className={cn(
          "absolute left-3 -top-1.5 px-1",
          "text-xs font-medium",
          "bg-[#202022] rounded-sm",
          isFocused && isAtLimit ? "text-red-400" : 
          isFocused ? "text-gray-400" : "text-gray-400",
        )}
      >
        {label}
      </label>

      {maxLength && (
        <span
          className={cn(
            "absolute right-3 -top-1.5 px-1",
            "text-xs font-medium",
            "bg-[#202022] rounded-sm",
            isFocused && isAtLimit ? "text-red-400" : 
            isFocused ? "text-gray-400" : "text-gray-400",
          )}
        >
          {length}/{maxLength}
        </span>
      )}
    </div>
  )
}