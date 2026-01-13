'use client'

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, X } from "lucide-react";

interface SelectOption {
  name: string;
  value: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }> | string;
  iconColor?: string;
}

interface CustomSelectMenuProps {
  label?: string;
  options: SelectOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  multiSelect?: boolean;
  maxSelected?: number;
  className?: string;
  disabled?: boolean;
}

export default function CustomSelectMenu({
  label,
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção...",
  multiSelect = false,
  maxSelected,
  className,
  disabled = false
}: CustomSelectMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);
  const selectedOptions = options.filter(option => selectedValues.includes(option.value));

  const handleSelect = (optionValue: string) => {
    if (multiSelect) {
      const currentValues = selectedValues;
      const isSelected = currentValues.includes(optionValue);
      
      let newValues: string[];
      if (isSelected) {
        newValues = currentValues.filter(v => v !== optionValue);
      } else {
        if (maxSelected && currentValues.length >= maxSelected) {
          return;
        }
        newValues = [...currentValues, optionValue];
      }
      
      onChange(newValues);
    } else {
      // Seleção única
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiSelect) {
      const newValues = selectedValues.filter(v => v !== optionValue);
      onChange(newValues);
    } else {
      onChange('');
    }
  };

  const getDisplayText = () => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }
    
    if (multiSelect) {
      return `${selectedOptions.length} selecionado(s)`;
    } else {
      return selectedOptions[0]?.name || placeholder;
    }
  };

  const isSelected = (optionValue: string) => selectedValues.includes(optionValue);
  
  const canSelect = (optionValue: string) => {
    if (!multiSelect) return true;
    if (isSelected(optionValue)) return true;
    return !maxSelected || selectedValues.length < maxSelected;
  };

  return (
    <div className="relative w-full">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            disabled={disabled}
            suppressHydrationWarning
            className={cn(
              "w-full h-10 justify-between bg-[#202022] border text-left font-normal transition-colors",
              isOpen ? "border-blue-500" : "border-gray-600",
              "hover:bg-[#202022]",
              "focus:ring-0 focus:ring-transparent focus:outline-none",
              "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",
              selectedOptions.length === 0 ? "text-gray-400 hover:text-gray-400" : "text-gray-200 hover:text-gray-200",
              disabled && "opacity-50",
              className
            )}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {!multiSelect && selectedOptions.length > 0 && selectedOptions[0]?.icon && (() => {
                const Icon = selectedOptions[0].icon;
                const iconColor = selectedOptions[0].iconColor;
                if (typeof Icon === 'string') {
                  return <span className="shrink-0 text-base" style={{ color: iconColor }}>{Icon}</span>;
                }
                const IconComponent = Icon as React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
                return <IconComponent 
                  className={cn("w-4 h-4 shrink-0", !iconColor && "text-gray-400")} 
                  style={{ color: iconColor }} 
                />;
              })()}
              <span className="truncate">{getDisplayText()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {!multiSelect && selectedOptions.length > 0 && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      onChange('');
                    }
                  }}
                  className="text-gray-400 hover:text-red-400 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </div>
              )}
              <ChevronDown className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                isOpen && "rotate-180"
              )} />
            </div>
          </Button>
        </PopoverTrigger>

        <label
          className={cn(
            "absolute left-3 -top-1.5 px-1 text-xs font-medium",
            "bg-[#202022] rounded-sm text-gray-400",
            disabled && "opacity-50"
          )}
        >
          {label}
        </label>

        <PopoverContent className="w-(--radix-popover-trigger-width) p-0 bg-[#202022] border-gray-600 z-9999!" align="start" sideOffset={4}>
          <style>{`
            .custom-dropdown-scroll::-webkit-scrollbar {
              width: 8px;
            }
            .custom-dropdown-scroll::-webkit-scrollbar-track {
              background: transparent;
              border-radius: 4px;
            }
            .custom-dropdown-scroll::-webkit-scrollbar-thumb {
              background-color: #404040;
              border-radius: 4px;
              border: 1px solid #1a1a1a;
            }
            .custom-dropdown-scroll::-webkit-scrollbar-thumb:hover {
              background-color: #525252;
            }
          `}</style>
          <div
            className="max-h-48 overflow-y-auto custom-dropdown-scroll"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#404040 transparent'
            }}
          >
            {options.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                Nenhuma opção disponível
              </div>
            ) : (
              options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#3b3b3bc2]",
                    isSelected(option.value),
                    !canSelect(option.value) && !isSelected(option.value) && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => canSelect(option.value) && handleSelect(option.value)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {option.icon && (
                      typeof option.icon === 'string' ? (
                        <span 
                          className="w-4 h-4 flex items-center justify-center text-base shrink-0"
                          style={{ color: option.iconColor }}
                        >
                          {option.icon}
                        </span>
                      ) : (
                        <option.icon 
                          className={cn("w-4 h-4 shrink-0", !option.iconColor && "text-gray-400")} 
                          style={{ color: option.iconColor }}
                        />
                      )
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {option.name}
                      </div>
                      {option.description && (
                        <div className="text-xs text-gray-400 truncate">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    {multiSelect && isSelected(option.value) && (
                      <X
                        onClick={(e) => handleRemove(option.value, e)}
                        className="h-4 w-4 text-red-400 hover:text-red-300 cursor-pointer"
                      />
                    )}
                    {isSelected(option.value) && (
                      <span className="w-5 h-5 flex justify-center items-center bg-blue-500 rounded-4xl">
                        <Check className="w-4 h-4 text-white" />
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Contador e opções selecionadas para multi-seleção */}
          {multiSelect && (
            <div className="border-t border-gray-600">
              {selectedOptions.length > 0 && (
                <div className="p-2 space-y-1">
                  <div className="text-xs text-gray-400 mb-2">
                    Selecionados ({selectedValues.length}{maxSelected ? `/${maxSelected}` : ''}):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedOptions.map((option) => (
                      <div
                        key={option.value}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded border border-blue-500/30"
                      >
                        <span className="truncate max-w-[100px]">{option.name}</span>
                        <X
                          onClick={(e) => handleRemove(option.value, e)}
                          className="h-3 w-3 hover:text-blue-300 shrink-0 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {maxSelected && (
                <div className="px-3 py-2 border-t border-gray-700">
                  <div className="text-xs text-gray-400 text-center">
                    {selectedValues.length} / {maxSelected} selecionados
                  </div>
                </div>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>

    </div>
  );
}