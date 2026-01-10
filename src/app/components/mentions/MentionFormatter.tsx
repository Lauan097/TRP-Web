'use client';

import React from 'react';
import Image from 'next/image';
import { useServerData, type ServerData } from '@/app/hooks/useServerData';

const parseMarkdownInline = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  const segments = text.split(/(\*\*.*?\*\*|__.*?__|~~.*?~~|\|\|.*?\|\||`.*?`|\[.*?\]\(.*?\))/g);
  
  segments.forEach((segment, index) => {
    if (!segment) return;
    
    if (segment.startsWith('**') && segment.endsWith('**')) {
      parts.push(<strong key={index} className="font-bold">{segment.slice(2, -2)}</strong>);
    } else if (segment.startsWith('__') && segment.endsWith('__')) {
      parts.push(<u key={index} className="underline">{segment.slice(2, -2)}</u>);
    } else if (segment.startsWith('~~') && segment.endsWith('~~')) {
      parts.push(<s key={index} className="line-through">{segment.slice(2, -2)}</s>);
    } else if (segment.startsWith('*') && segment.endsWith('*') && !segment.startsWith('**')) {
      parts.push(<em key={index} className="italic">{segment.slice(1, -1)}</em>);
    } else if (segment.startsWith('||') && segment.endsWith('||')) {
      parts.push(<span key={index} className="bg-black text-black hover:text-white rounded px-1 cursor-pointer transition-colors select-none">{segment.slice(2, -2)}</span>);
    } else if (segment.startsWith('`') && segment.endsWith('`')) {
      parts.push(<code key={index} className="bg-[#1e1f20] px-1.5 py-0.5 rounded font-mono text-sm text-gray-100">{segment.slice(1, -1)}</code>);
    } else if (segment.startsWith('[') && segment.includes('](')) {
      const match = segment.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        parts.push(<a key={index} href={match[2]} className="text-[#00b0f4] hover:underline" target="_blank" rel="noopener noreferrer">{match[1]}</a>);
      } else {
        parts.push(segment);
      }
    } else {
      parts.push(segment);
    }
  });
  
  return parts;
};

const parseMarkdownBlock = (text: string, data: ServerData | null): React.ReactNode[] => {
  const lines = text.split('\n');
  const parts: React.ReactNode[] = [];
  let listItems: string[] = [];
  let blockquoteLines: string[] = [];
  let keyIndex = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      parts.push(
        <ul key={`list-${keyIndex++}`} className="list-disc list-inside my-1 text-gray-300">
          {listItems.map((item, i) => (
            <li key={i}>{parseContentWithMentions(item.replace(/^-\s*/, ''), data)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const flushBlockquote = () => {
    if (blockquoteLines.length > 0) {
      parts.push(
        <div key={`quote-${keyIndex++}`} className="border-l-4 border-[#949ba4] pl-3 my-1 text-gray-300 italic">
          {blockquoteLines.map((line, i) => (
            <div key={i}>{parseContentWithMentions(line.replace(/^>\s*/, ''), data)}</div>
          ))}
        </div>
      );
      blockquoteLines = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('- ')) {
      flushBlockquote();
      listItems.push(trimmed);
    } else if (trimmed.startsWith('> ')) {
      flushList();
      blockquoteLines.push(trimmed);
    } else if (trimmed.match(/^#{1,6}\s/)) {
      flushList();
      flushBlockquote();
      const match = trimmed.match(/^(#{1,6})\s(.+)$/);
      if (match) {
        const level = match[1].length;
        const headingClass = {
          1: 'text-2xl font-bold',
          2: 'text-xl font-bold',
          3: 'text-lg font-bold',
          4: 'text-base font-bold',
          5: 'text-sm font-bold',
          6: 'text-xs font-bold'
        }[level] || 'text-base font-bold';
        
        parts.push(
          <div key={`heading-${keyIndex++}`} className={`${headingClass} text-white my-1`}>
            {parseContentWithMentions(match[2], data)}
          </div>
        );
      }
    } else if (trimmed) {
      flushList();
      flushBlockquote();
      parts.push(
        <div key={`para-${keyIndex++}`}>{parseContentWithMentions(line, data)}</div>
      );
    } else {
      flushList();
      flushBlockquote();
      parts.push(<br key={`br-${keyIndex++}`} />);
    }
  });

  flushList();
  flushBlockquote();

  return parts;
};

function normalizeColor(color: string | number | undefined): string {
  if (!color) return '#b3bac1';

  if (typeof color === 'number') {
    return `#${color.toString(16).padStart(6, '0')}`;
  }

  if (color.startsWith('#')) {
    return color;
  }

  return '#b3bac1';
}

function colorToRgba(color: string | number | undefined, alpha: number = 0.5): string {
  if (!color) return `rgba(179, 186, 193, ${alpha})`;

  if (typeof color === 'number') {
    const r = (color >> 16) & 255;
    const g = (color >> 8) & 255;
    const b = color & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return `rgba(179, 186, 193, ${alpha})`;
}

const parseContentWithMentions = (text: string, data: ServerData | null): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const regex = /<@!?(\d+)>|<@&(\d+)>|<#(\d+)>|<a?:[\w]+:(\d+)>/g;
  let match;
  let matchCounter = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const before = text.substring(lastIndex, match.index);
      parts.push(...parseMarkdownInline(before));
    }

    const userId = match[1];
    const roleId = match[2];
    const channelId = match[3];
    const emojiId = match[4];
    const fullMatch = match[0];
    matchCounter++;

    if (userId && data) {
      const user = data.users.find(u => u.id === userId);
      const displayName = user ? (user.nickname || user.username) : 'user';
      parts.push(
        <span key={`user-${userId}-${matchCounter}`} className="text-[#ACBBFC] bg-[#3c425e] hover:bg-[#616ce9c2] transition-all duration-80 px-1 rounded-xs font-semibold cursor-pointer">
          @{displayName}
        </span>
      );
    } else if (roleId && data) {
      const role = data.roles.find(r => r.id === roleId);
      const displayName = role ? role.name : 'role';

      const baseColor = normalizeColor(role?.color);
      const backgroundColor = colorToRgba(role?.color, 0.1);

      parts.push(
        <span
          key={`role-${roleId}-${matchCounter}`}
          className="font-semibold cursor-pointer px-1 py-0.5 rounded-md"
          style={{
            color: baseColor,
            backgroundColor,
          }}
        >
          @{displayName}
        </span>
      );
    } else if (channelId && data) {
      const channel = data.channels.find(c => c.id === channelId);
      const displayName = channel ? channel.name : channelId;
      parts.push(
        <span key={`channel-${channelId}-${matchCounter}`} className="text-[#ACBBFC] bg-[#3c425e] hover:bg-[#616ce9c2] transition-all duration-80 px-1 rounded-xs font-semibold cursor-pointer">
          #{displayName}
        </span>
      );
    } else if (emojiId) {
      const isAnimated = fullMatch.startsWith('<a:');
      const emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}.${isAnimated ? 'gif' : 'png'}`;
      parts.push(
        <Image 
          key={`emoji-${emojiId}-${matchCounter}`}
          src={emojiUrl} 
          alt="emoji" 
          width={20}
          height={20}
          className="inline h-5 w-5 align-text-bottom"
          unoptimized
        />
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(...parseMarkdownInline(text.substring(lastIndex)));
  }

  return parts;
};

const MentionFormatter = ({ 
  content
}: { 
  content: string;
}) => {
  const { data } = useServerData();

  if (!content) return null;

  return <div className="space-y-1">{parseMarkdownBlock(content, data)}</div>;
};

export default MentionFormatter;
