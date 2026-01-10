'use client';

import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, Users, Shield, MessageSquare, Smile } from 'lucide-react';
import { useServerData } from '@/app/hooks/useServerData';
import Image from 'next/image';

interface User {
  id: string;
  username: string;
  nickname?: string;
  avatar?: string;
}

interface Role {
  id: string;
  name: string;
  color?: string;
}

interface Channel {
  id: string;
  name: string;
  type?: number;
}

interface Emoji {
  id: string;
  name: string;
  animated: boolean;
}

interface FilteredDataType {
  users: User[];
  roles: Role[];
  channels: Channel[];
  emojis: Emoji[];
}

interface MentionPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (text: string) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

type TabType = 'users' | 'roles' | 'channels' | 'emojis';

const MentionPopover: React.FC<MentionPopoverProps> = ({ isOpen, onClose, onInsert, anchorRef }) => {
  const { data, loading } = useServerData();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);

  const ANIMATION_DURATION = 180; // ms
  const [mounted, setMounted] = useState(false);
  const [positioned, setPositioned] = useState(false);
  const [exiting, setExiting] = useState(false);

  const updatePosition = useCallback(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const margin = 16;

    let top = rect.bottom + 8;
    let left = rect.left;

    setPosition({ top, left });

    const pop = popoverRef.current;
    if (pop) {
      const popRect = pop.getBoundingClientRect();
      const maxLeft = window.innerWidth - popRect.width - margin;
      left = Math.max(margin, Math.min(left, maxLeft));
      const maxTop = window.innerHeight - popRect.height - margin;
      top = Math.max(margin, Math.min(top, maxTop));
      setPosition({ top, left });
    } else {
      requestAnimationFrame(() => {
        const pop2 = popoverRef.current;
        if (!pop2) return;
        const popRect = pop2.getBoundingClientRect();
        const maxLeft = window.innerWidth - popRect.width - margin;
        left = Math.max(margin, Math.min(left, maxLeft));
        const maxTop = window.innerHeight - popRect.height - margin;
        top = Math.max(margin, Math.min(top, maxTop));
        setPosition({ top, left });
      });
    }
  }, [anchorRef]);

  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      rafRef.current = requestAnimationFrame(() => {
        setMounted(true);
        setExiting(false);
        setPositioned(false);

        rafRef.current = requestAnimationFrame(() => {
          updatePosition();
          timeoutRef.current = window.setTimeout(() => {
            updatePosition();
            setPositioned(true);
          }, 10);
        });
      });

      const handleScroll = () => updatePosition();
      const handleResize = () => updatePosition();

      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize, true);

      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize, true);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    if (!isOpen && mounted) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setExiting(true);
        setPositioned(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
          setMounted(false);
          setExiting(false);
        }, ANIMATION_DURATION + 20);
      });

      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    return undefined;
  }, [isOpen, mounted, updatePosition]);

  const filteredData = useMemo((): FilteredDataType => {
    if (!data) {
      return {
        users: [],
        roles: [],
        channels: [],
        emojis: []
      };
    }

    const search = searchTerm.toLowerCase();

    return {
      users: data.users.filter(u => u.username.toLowerCase().includes(search)).slice(0, 15),
      roles: data.roles.filter(r => r.name.toLowerCase().includes(search)).slice(0, 15),
      channels: data.channels.filter(c => c.name.toLowerCase().includes(search)),
      emojis: data.emojis.filter(e => e.name.toLowerCase().includes(search))
    };
  }, [data, searchTerm]);

  const handleInsert = (mention: string) => {
    onInsert(mention);
    setSearchTerm('');
    onClose();
  };

  if (!mounted) return null;

  const portalElement = typeof document !== 'undefined' ? document.body : null;

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'users', label: 'Usuários', icon: <Users size={16} /> },
    { id: 'roles', label: 'Cargos', icon: <Shield size={16} /> },
    { id: 'channels', label: 'Canais', icon: <MessageSquare size={16} /> },
    { id: 'emojis', label: 'Emojis', icon: <Smile size={16} /> }
  ];

  return portalElement ? createPortal(
    <>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-200 ${isOpen && positioned && !exiting ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      <div
        ref={popoverRef}
        onClick={(e) => e.stopPropagation()}
        className={`absolute z-50 bg-[#2c2f33]/95 backdrop-blur-sm rounded-lg ring-1 ring-black/30 shadow-[0_10px_30px_rgba(0,0,0,0.6)] w-80 max-h-96 flex flex-col border border-[#23272a] transition-transform duration-200 ${isOpen && positioned && !exiting ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-98'}`}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          position: 'fixed'
        }}
      >
        <div className="flex border-b border-[#23272a] bg-[#1e1f20] rounded-t-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 transition-colors text-xs sm:text-sm cursor-pointer ${
                activeTab === tab.id
                  ? 'text-[#7289da] border-b-2 border-[#7289da]'
                  : 'text-gray-400 hover:text-white'
              }`}
              title={tab.label}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-3 border-b border-[#23272a]">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Procurar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#1e1f20] border border-[#2c2f33] rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#7289da]"
            />
          </div>
        </div>

        <div 
          className="flex-1 overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#404249 #2c2f33',
          }}
        >
          <style>{`
            .mention-popover-content::-webkit-scrollbar {
              width: 8px;
            }
            .mention-popover-content::-webkit-scrollbar-track {
              background: #2c2f33;
            }
            .mention-popover-content::-webkit-scrollbar-thumb {
              background: #404249;
              border-radius: 4px;
            }
            .mention-popover-content::-webkit-scrollbar-thumb:hover {
              background: #4f545c;
            }
          `}</style>
          <div className="mention-popover-content h-full overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                <p>Carregando...</p>
              </div>
          ) : filteredData[activeTab].length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm mb-2">
              <p>Nenhum resultado</p>
            </div>
          ) : (
            <div className="divide-y divide-[#23272a]">
              {activeTab === 'users' && filteredData.users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleInsert(`<@${user.id}>`)}
                  className="w-full text-left px-3 py-2 hover:bg-[#23272a] transition-colors flex items-center gap-2 text-sm"
                >
                  {user.avatar && (
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      width={24}
                      height={24}
                      className="rounded-full"
                      unoptimized
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{user.nickname || user.username}</p>
                    {user.nickname && <p className="text-xs text-gray-400 truncate">{user.username}</p>}
                  </div>
                </button>
              ))}

              {activeTab === 'roles' && filteredData.roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleInsert(`<@&${role.id}>`)}
                  className="w-full text-left px-3 py-2 hover:bg-[#23272a] transition-colors text-sm"
                >
                  <p className="font-medium truncate" style={{ color: role.color || '#b3bac1' }}>
                    @{role.name}
                  </p>
                </button>
              ))}

              {activeTab === 'channels' && filteredData.channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => handleInsert(`<#${channel.id}>`)}
                  className="w-full text-left px-3 py-2 hover:bg-[#23272a] transition-colors text-sm"
                >
                  <p className="text-[#949ba4] font-medium truncate">#{channel.name}</p>
                </button>
              ))}

              {activeTab === 'emojis' && filteredData.emojis.map((emoji) => (
                <button
                  key={emoji.id}
                  onClick={() => {
                    const prefix = emoji.animated ? 'a' : '';
                    handleInsert(`<${prefix}:${emoji.name}:${emoji.id}>`);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#23272a] transition-colors flex items-center gap-2 text-sm"
                >
                  <Image
                    src={`https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`}
                    alt={emoji.name}
                    width={24}
                    height={24}
                    unoptimized
                  />
                  <p className="text-white font-medium truncate">:{emoji.name}:</p>
                </button>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </>,
    portalElement!
  ) : null;
};

export default MentionPopover;
