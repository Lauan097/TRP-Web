'use client'

import * as React from 'react'
import { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { Check, X, Loader2, Hash } from 'lucide-react';
import { BiChevronDown } from "react-icons/bi";

type DiscordChannel = {
  id: string
  name: string
  type: number
}

interface TextChannelSelectProps {
  channels: DiscordChannel[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  selectType?: 0 | 1
  maxSelected?: number
}

export default function TextChannelSelect({
  channels,
  value,
  onChange,
  placeholder = "Selecione um canal de texto...",
  disabled = false,
  className,
  selectType = 0,
  maxSelected
}: TextChannelSelectProps) {

  const isMulti = selectType === 1

  const selectedIds = useMemo(() => {
    if (isMulti) {
      if (Array.isArray(value)) {
        return value
      } else if (typeof value === 'string' && value.startsWith('[')) {
        try {
          return JSON.parse(value)
        } catch {
          return []
        }
      } else {
        return []
      }
    } else {
      return value ? [value as string] : []
    }
  }, [value, isMulti])

  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedTerm, setDebouncedTerm] = useState("")

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0, left: 0, width: 0
  })

  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const baseTextChannels = useMemo(() => 
    channels.filter(c => c.type === 0),
    [channels]
  )

  const selectedChannel =
    !isMulti ? baseTextChannels.find(c => c.id === value) : null

  const isSearching = searchTerm !== debouncedTerm

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim().toLowerCase())
    }, 200)

    return () => clearTimeout(timeout)
  }, [searchTerm])

  const filteredTextChannels = baseTextChannels.filter(cat =>
    cat.name.toLowerCase().includes(debouncedTerm)
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (!isOpen || !buttonRef.current) return

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return

      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width
      })
    }

    updatePosition()

    const handleScroll = () => updatePosition()
    const handleResize = () => updatePosition()

    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize, true)

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize, true)
    }
  }, [isOpen])

  const handleSelect = (channelId: string) => {
    if (!isMulti) {
      onChange(channelId)
      setIsOpen(false)
      setSearchTerm("")
      return
    }

    let updated = [...selectedIds]

    if (updated.includes(channelId)) {
      updated = updated.filter((id: string) => id !== channelId)
    } else {
      if (maxSelected && updated.length >= maxSelected) return
      updated.push(channelId)
    }

    onChange(updated)
  }

  const limitReached =
  isMulti && maxSelected !== undefined && selectedIds.length >= maxSelected

  return (
    <div className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          setIsOpen(!isOpen)
          setSearchTerm("")
        }}
        className={cn(
          "flex items-center justify-between w-full",
          "px-3 py-2 rounded-lg",
          "bg-[#202022] transition-colors border",
          limitReached && isOpen
            ? "border-red-500"
            : isOpen
              ? "border-blue-500"
              : "border-gray-600",
          "text-white focus:outline-none"
        )}
      >
        {!isOpen && (
          <>
            {isMulti && selectedIds.length > 0 ? (
              <div className="flex flex-wrap gap-1 max-w-full">
                {selectedIds.map((id: string) => {
                  const channel = baseTextChannels.find(c => c.id === id)
                  return (
                    <span
                      key={id}
                      className="flex items-center gap-1 px-2 py-0.5 text-xs bg-[#2a2a2a] rounded-md"
                    >
                      <Hash className="w-3 h-3 text-gray-400" />
                      {channel?.name}

                      <X
                        onClick={(e) => {
                          e.stopPropagation()
                          onChange(selectedIds.filter((i: string) => i !== id))
                        }}
                        className="w-3 h-3 cursor-pointer text-gray-400 hover:text-red-400"
                      />
                    </span>
                  )
                })}
              </div>
            ) : (
              <span className="flex items-center gap-2">
                {selectedChannel ? (
                  <>
                    <Hash className="w-5 h-5 text-gray-300" />
                    {selectedChannel.name}
                  </>
                ) : (
                  <span className="text-gray-400">{placeholder}</span>
                )}
              </span>
            )}
          </>
        )}

        {isOpen && (
          <input
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
          />
        )}

        <div className="flex items-center gap-1.5">

          {!isOpen && !isMulti && value && (
            <X
              onClick={(e) => {
                e.stopPropagation()
                onChange("")
              }}
              className="w-4 h-4 text-gray-400 hover:text-red-400 transition cursor-pointer"
            />
          )}

          <BiChevronDown
            className={cn(
              "w-5 h-5 text-gray-400 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </button>

      {isOpen && typeof window !== 'undefined' && createPortal(
        <>
          <style>{`
            .custom-dropdown-scroll::-webkit-scrollbar {
              width: 8px;
            }
            .custom-dropdown-scroll::-webkit-scrollbar-track {
              background: #1a1a1a;
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
            ref={menuRef}
            className="fixed z-auto bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width
            }}
          >
            <div
              className="max-h-72 overflow-y-auto custom-dropdown-scroll"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#404040 #1a1a1a'
              }}
            >
              {limitReached && (
                <div className="px-3 py-2 bg-red-900/20 border-b border-red-500/30">
                  <p className="text-red-400 text-xs">
                    Você atingiu o número máximo de seleções ({maxSelected}).
                  </p>
                </div>
              )}

            {isSearching && (
              <div className="flex justify-center py-3">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            )}

            {!isSearching && filteredTextChannels.length === 0 && (
              <div className="text-center text-gray-400 py-3">
                Nenhum canal de texto encontrado
              </div>
            )}

            {!isSearching && filteredTextChannels.map(channel => {
              const isSelected = selectedIds.includes(channel.id)

              return (
                <div
                  key={channel.id}
                  onClick={() => handleSelect(channel.id)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2",
                    "cursor-pointer text-white hover:bg-[#303030] transition-colors"
                  )}
                >
                  <span className="flex items-center gap-2 text-sm">
                    <Hash className="w-5 h-5 text-gray-400" />
                    {channel.name}
                  </span>

                  {isMulti ? (
                    <span
                      className={cn(
                        "w-5 h-5 rounded-md flex items-center justify-center border transition-colors",
                        isSelected
                          ? "bg-blue-600 border-blue-500"
                          : "bg-[#2a2a2a] border-gray-600"
                      )}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </span>
                  ) : (
                    isSelected && (
                      <span className="w-5 h-5 flex justify-center items-center bg-blue-500 rounded-4xl">
                        <Check className="w-4 h-4 text-white" />
                      </span>
                    )
                  )}
                </div>
              )
            })}

            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  )
}