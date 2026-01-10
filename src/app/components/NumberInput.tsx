import React, { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className = "",
}: NumberInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValueStr = e.target.value;
    setInputValue(newValueStr);

    const newValue = parseFloat(newValueStr);
    if (!isNaN(newValue)) {
        onChange(newValue); 
    }
  };

  const handleBlur = () => {
    let newValue = parseFloat(inputValue);
    if (isNaN(newValue)) newValue = min;
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  return (
    <div className={`flex items-center border border-zinc-700 rounded-md w-fit overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:hover:text-zinc-400 disabled:hover:bg-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <Minus size={14} />
      </button>

      <div className="w-px h-8 bg-zinc-700" />

      <input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="w-10 bg-transparent text-center text-white text-sm outline-none font-medium appearance-none m-0"
        style={{ MozAppearance: "textfield" }}
      />

      <div className="w-px h-8 bg-zinc-700" />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:hover:text-zinc-400 disabled:hover:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <Plus size={14} />
      </button>
      
      <style jsx global>{`
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
      `}</style>
    </div>
  );
}