'use client'

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { ComponentProps, useState, useRef } from "react";
import { AtSign } from "lucide-react";
import MentionPopover from "./mentions/MentionPopover";

interface CustomBorderTextareaProps extends ComponentProps<typeof Textarea> {
  label: string;
  maxLength: number;
  value?: string;
  className?: string;
  menuMention?: boolean;
  onMentionInsert?: (text: string) => void;
}

export default function CustomBorderTextarea({
  label,
  maxLength,
  value,
  className,
  menuMention = false,
  onMentionInsert,
  ...props
}: CustomBorderTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showMentionPopover, setShowMentionPopover] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const mentionButtonRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const length = String(value || "").length;
  const isAtLimit = length >= maxLength;  

  const handleMentionInsert = (mention: string) => {
    if (onMentionInsert && textareaRef.current) {
      const currentValue = value || "";
      const beforeCursor = currentValue.substring(0, cursorPosition);
      const afterCursor = currentValue.substring(cursorPosition);
      const newValue = beforeCursor + mention + afterCursor;
      onMentionInsert(newValue);
    }
  };

  const handleTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    setCursorPosition(target.selectionStart || 0);
  };

  const handleTextareaKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    setCursorPosition(target.selectionStart || 0);
  };

  return (
    <div className="relative w-full">

      <Textarea
        ref={textareaRef}
        value={value}
        maxLength={maxLength}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClick={handleTextareaClick}
        onKeyUp={handleTextareaKeyUp}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4B5563 transparent',
        }}
        className={cn(
          "bg-[#202022] border-gray-600 min-h-[120px] pt-5 peer",
          menuMention ? "pr-12" : "pr-3",
          "outline-none focus:outline-none focus:ring-0 focus:ring-transparent",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          "[&::-webkit-scrollbar]:w-2",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:bg-gray-600",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-thumb:hover]:bg-gray-500",
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

      {menuMention && (
        <>
          <div
            ref={mentionButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              setShowMentionPopover(!showMentionPopover);
            }}
            className="absolute bottom-3 right-2 p-1.5 hover:bg-gray-700 rounded transition-colors cursor-pointer"
            title="Inserir menção"
          >
            <AtSign size={18} className="text-gray-400 hover:text-gray-200" />
          </div>

          <MentionPopover
            isOpen={showMentionPopover}
            onClose={() => setShowMentionPopover(false)}
            onInsert={handleMentionInsert}
            anchorRef={mentionButtonRef}
          />
        </>
      )}
    </div>
  )
}