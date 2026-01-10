'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import CustomBorderInput from '../CustomBorderInput';
import CustomBorderTextarea from '../CustomBorderTextarea';
import EmbedFields from './EmbedFields';
import ImageUploader from './ImageUploader';
import { useServerData } from '@/app/hooks/useServerData';
import TextChannelSelect from './ChannelSelect';
import { useToast } from '../ToastContext';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import MentionFormatter from '../mentions/MentionFormatter';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { 
  Trash2, ChevronDown, ChevronUp, Link as LinkIcon, 
  Palette, Send, Plus, X, Copy
} from 'lucide-react';

const isValidUrl = (string) => {
  if (!string) return true;
  try {
    new URL(string);
    return true;
  } catch (err) {
    console.log('Invalid URL:', string, err);
    return false;
  }
};

function normalizeColor(color) {
  if (!color) return '#b3bac1';

  if (typeof color === 'number') {
    return `#${color.toString(16).padStart(6, '0')}`;
  }

  if (color.startsWith('#')) {
    return color;
  }

  return '#b3bac1';
}

function colorToRgba(color, alpha = 0.5) {
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

const DiscordMarkdown = ({ content, data }) => {
  if (!content) return null;

  const parseInline = (text, lineIndex = 0) => {
    const markdownRegex = /(\*\*.*?\*\*|__.*?__|~~.*?~~|\|\|.*?\|\||`.*?`|\[.*?\]\(.*?\))/g;

    return text.split(markdownRegex).map((part, index) => {
      if (!part) return null;
      
      const uniqueKey = `line-${lineIndex}-part-${index}`;
      
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={uniqueKey} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('__') && part.endsWith('__')) {
        return <u key={uniqueKey} className="underline">{part.slice(2, -2)}</u>;
      }
      if (part.startsWith('~~') && part.endsWith('~~')) {
        return <s key={uniqueKey} className="line-through">{part.slice(2, -2)}</s>;
      }
      if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
        return <em key={uniqueKey} className="italic">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('||') && part.endsWith('||')) {
        return <span key={uniqueKey} className="bg-black text-black hover:text-white rounded px-1 cursor-pointer transition-colors select-none">{part.slice(2, -2)}</span>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={uniqueKey} className="bg-[#1e1f20] px-1.5 py-0.5 rounded font-mono text-sm text-gray-100">{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('```') && part.endsWith('```')) {
        return <code key={uniqueKey} className="bg-[#1e1f20] px-2.5 py-1.5 rounded font-mono text-sm text-gray-100">{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('[') && part.includes('](')) {
        const matches = part.match(/\[(.*?)\]\((.*?)\)/);
        if (matches) {
          return <a key={uniqueKey} href={matches[2]} className="text-[#00b0f4] hover:underline" target="_blank" rel="noopener noreferrer">{matches[1]}</a>;
        }
      }
      
      if (!part.startsWith('**') && !part.startsWith('__') && !part.startsWith('~~') && !part.startsWith('||') && !part.startsWith('`') && !part.startsWith('[')) {
        const mentionParts = [];
        let textLastIndex = 0;
        const textMentionRegex = /<@!?(\d+)>|<@&(\d+)>|<#(\d+)>|<a?:[\w]+:(\d+)>/g;
        let textMatch;
        let matchCounter = 0;

        while ((textMatch = textMentionRegex.exec(part)) !== null) {
          if (textMatch.index > textLastIndex) {
            mentionParts.push(part.substring(textLastIndex, textMatch.index));
          }

          const userId = textMatch[1];
          const roleId = textMatch[2];
          const channelId = textMatch[3];
          const emojiId = textMatch[4];
          const fullMatch = textMatch[0];
          matchCounter++;

          if (userId && data) {
            const user = data.users.find(u => u.id === userId);
            const displayName = user ? (user.nickname || user.username) : 'user';
            mentionParts.push(
              <span key={`user-${userId}-${matchCounter}-${index}`} className="text-[#ACBBFC] bg-[#3c425e] hover:bg-[#616ce9c2] transition-all duration-80 px-1 rounded-xs font-semibold hover:underline cursor-pointer">
                @{displayName}
              </span>
            );
          } else if (roleId && data) {
            const role = data.roles.find(r => r.id === roleId);
            const displayName = role ? role.name : 'role';

            const baseColor = normalizeColor(role?.color);
            const backgroundColor = colorToRgba(role?.color, 0.1);

            mentionParts.push(
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
            mentionParts.push(
              <span key={`channel-${channelId}-${matchCounter}-${index}`} className="text-[#ACBBFC] bg-[#3c425e] hover:bg-[#616ce9c2] transition-all duration-80 px-1 rounded-xs font-semibold cursor-pointer">
                #{displayName}
              </span>
            );
          } else if (emojiId) {
            const isAnimated = fullMatch.startsWith('<a:');
            const emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}.${isAnimated ? 'gif' : 'png'}`;
            mentionParts.push(
              <Image 
                key={`emoji-${emojiId}-${matchCounter}-${index}`}
                src={emojiUrl} 
                alt="emoji" 
                width={20}
                height={20}
                className="inline h-5 w-5 align-text-bottom"
                unoptimized
              />
            );
          }

          textLastIndex = textMatch.index + textMatch[0].length;
        }

        if (textLastIndex < part.length) {
          mentionParts.push(part.substring(textLastIndex));
        }

        return mentionParts.length > 0 ? <span key={uniqueKey}>{mentionParts}</span> : part;
      }

      return part;
    });
  };

  const renderLines = () => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold mb-2 text-white">{parseInline(line.slice(2), i)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold mb-2 text-white">{parseInline(line.slice(3), i)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold mb-2 text-white">{parseInline(line.slice(4), i)}</h3>;
      if (line.startsWith('-# ')) return <p key={i} className="text-xs text-gray-400 mb-1">{parseInline(line.slice(3), i)}</p>;
      if (line.startsWith('> ')) {
        return (
          <div key={i} className="flex mb-2 gap-2">
            <div className="w-1 bg-gray-500 opacity-40 rounded"></div>
            <div className="text-gray-300">{parseInline(line.slice(2), i)}</div>
          </div>
        );
      }
      if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-gray-300">{parseInline(line.slice(2), i)}</li>;
      if (line.startsWith('```')) return <code key={i} className="bg-[#1e1f20] px-2 py-2 rounded w-full font-mono text-sm text-gray-100">{parseInline(line.slice(2), i)}</code>;;
      
      return <div key={i} className="text-gray-300 mb-1 min-h-[1.2em]">{parseInline(line, i)}</div>;
    });
  };

  return <div className="whitespace-pre-wrap wrap-break-word text-gray-200">{renderLines()}</div>;
};

const ValidatedInput = ({ label, value, onChange, placeholder, ...props }) => {
  const isError = value && (label.toLowerCase().includes('url') || label.toLowerCase().includes('ícone')) && !isValidUrl(value);
  
  return (
    <div className="space-y-1">
      <CustomBorderInput
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={isError ? "border-red-500/50 focus:border-red-500" : ""}
        {...props}
      />
      {isError && (
        <div className="flex items-center text-xs text-red-400 mt-1">
          <AlertCircle className="w-3 h-3 mr-1" />
          URL inválida
        </div>
      )}
    </div>
  );
};

const EditorSection = ({ title, isOpen, onToggle, children }) => (
  <div className="bg-[#161616] backdrop-blur-md border border-[#2e2e2e] rounded-xl overflow-hidden transition-all duration-300">
    <button 
      onClick={onToggle}
      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
    >
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
    </button>
    
    {isOpen && (
      <div className="p-6 border-t border-[#2e2e2e] space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
        {children}
      </div>
    )}
  </div>
);

export default function EmbedEditor({ 
  title: editorTitle = 'Editor de Embed',
  description: editorDescription = 'Configure e envie sua mensagem'
}) {
  const { data: serverData } = useServerData();
  
  const defaultEmbed = {
    title: '',
    description: '',
    url: '',
    color: '#7c0e0e',
    author: { name: '', iconUrl: '', url: '' },
    thumbnail: '',
    image: '',
    footer: { text: '', iconUrl: '' },
    timestamp: false,
    fields: []
  };

  const [messageContent, setMessageContent] = useState('');
  const [embeds, setEmbeds] = useState([]);
  const [activeEmbedIndex, setActiveEmbedIndex] = useState(0);

  const [openSections, setOpenSections] = useState({
    messageContent: true,
    content: true,
    author: false,
    images: false,
    fields: false,
    footer: false
  });

  const [showTitleUrl, setShowTitleUrl] = useState(false);
  const colorInputRef = useRef(null);
  const [collapsedFields, setCollapsedFields] = useState(new Set());
  const [selectedChannel, setSelectedChannel] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [editLastMessage, setEditLastMessage] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const savedData = localStorage.getItem('embedEditorData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        
        if (parsed.embedData && !parsed.embeds) {
            setMessageContent(parsed.embedData.content || '');
            if (parsed.hasEmbed) {
                const { ...embedFields } = parsed.embedData;
                setEmbeds([embedFields]);
            } else {
                setEmbeds([]);
            }
        } else {
            if (parsed.messageContent !== undefined) setMessageContent(parsed.messageContent);
            if (parsed.embeds) setEmbeds(parsed.embeds);
        }

        if (parsed.selectedChannel) setSelectedChannel(parsed.selectedChannel);
      } catch (e) {
        console.error('Falha ao carregar dados salvos do embed', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    
    const dataToSave = {
      messageContent,
      embeds,
      selectedChannel
    };
    localStorage.setItem('embedEditorData', JSON.stringify(dataToSave));
  }, [messageContent, embeds, selectedChannel, isLoaded]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const addEmbed = () => {
    if (embeds.length >= 4) {
        addToast('Limite de 4 embeds atingido', 'error');
        return;
    }
    setEmbeds(prev => [...prev, { ...defaultEmbed }]);
    setActiveEmbedIndex(embeds.length);
    setOpenSections(prev => ({ ...prev, content: true }));
  };

  const removeEmbed = (index) => {
    setEmbeds(prev => {
        const newEmbeds = prev.filter((_, i) => i !== index);
        return newEmbeds;
    });
    if (activeEmbedIndex >= index && activeEmbedIndex > 0) {
        setActiveEmbedIndex(prev => prev - 1);
    }
  };

  const duplicateEmbed = (index) => {
      if (embeds.length >= 4) {
          addToast('Limite de 4 embeds atingido', 'error');
          return;
      }
      const embedToCopy = JSON.parse(JSON.stringify(embeds[index]));
      if (embedToCopy.fields) {
          embedToCopy.fields = embedToCopy.fields.map(f => ({
              ...f,
              id: crypto.randomUUID()
          }));
      }

      setEmbeds(prev => [...prev, embedToCopy]);
      setActiveEmbedIndex(embeds.length);
  };

  const updateEmbed = (path, value) => {
    setEmbeds(prev => {
      const newEmbeds = [...prev];
      const currentEmbed = { ...newEmbeds[activeEmbedIndex] };
      
      const keys = path.split('.');
      let current = currentEmbed;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      newEmbeds[activeEmbedIndex] = currentEmbed;
      return newEmbeds;
    });
  };

  const resetAll = () => {
    setMessageContent('');
    setEmbeds([]);
    setCollapsedFields(new Set());
    setShowTitleUrl(false);
  };

  const handleSendEmbed = async () => {
    if (!selectedChannel) {
      addToast('Selecione um canal para enviar', 'error');
      return;
    }

    if (!messageContent && embeds.length === 0) {
      addToast('Digite uma mensagem ou adicione uma embed', 'error');
      return;
    }

    for (let i = 0; i < embeds.length; i++) {
        const emb = embeds[i];
        if (!emb.title && !emb.description && !emb.image && !emb.thumbnail) {
             if (emb.fields.length === 0) {
                 addToast(`A Embed ${i + 1} está vazia (precisa de título, descrição ou imagem)`, 'error');
                 return;
             }
        }
    }

    setIsSending(true);

    try {
      const payload = {
        channelId: selectedChannel,
        content: messageContent,
        editLastMessage,
        embeds: embeds.map(emb => ({
          title: emb.title,
          description: emb.description,
          url: emb.url,
          color: emb.color.replace('#', ''),
          author: emb.author.name ? {
            name: emb.author.name,
            icon_url: emb.author.iconUrl,
            url: emb.author.url
          } : undefined,
          thumbnail: emb.thumbnail ? { url: emb.thumbnail } : undefined,
          image: emb.image ? { url: emb.image } : undefined,
          fields: emb.fields.map(f => ({
            name: f.name,
            value: f.value,
            inline: f.inline
          })),
          footer: emb.footer.text ? {
            text: emb.footer.text,
            icon_url: emb.footer.iconUrl
          } : undefined,
          timestamp: emb.timestamp ? new Date().toISOString() : undefined
        }))
      };

      const response = await fetch('/api/site/send-embed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar mensagem');
      }

      addToast('Mensagem enviada com sucesso!', 'success');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Erro ao enviar mensagem', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const currentEmbed = embeds[activeEmbedIndex];

  return (
    <div className="min-h-screen " suppressHydrationWarning>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 bg-[#0f0f0f] border border-white/10 rounded-2xl p-4 md:p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            <div className="flex-1">
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes bg-flow-animation {
                  0% { background-position: 0% 50%; }
                  100% { background-position: 200% 50%; }
                }
              `}} />

              <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
                {editorTitle}
                
                <Badge 
                  variant="outline" 
                  className="
                      border-0 text-white px-3 py-0.5 text-xs md:text-sm rounded-full font-extrabold tracking-wider shadow-lg shadow-purple-500/20
                      bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500
                  "
                  style={{
                      backgroundSize: '200% auto',
                      animation: 'bg-flow-animation 3s linear infinite'
                  }}
                >
                  V2
                </Badge>
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {editorDescription}
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center w-full md:w-auto bg-[#161616] border border-[#2e2e2e] rounded-xl p-2 md:p-4">

              <div className="flex flex-col w-full md:w-68">
                <TextChannelSelect
                  channels={serverData?.channels || []}
                  value={selectedChannel}
                  onChange={setSelectedChannel}
                  placeholder="Selecione um canal..."
                  selectType={0}
                  className="w-full" 
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSendEmbed}
                  disabled={isSending || !selectedChannel}
                  className="cursor-pointer bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-md shadow-indigo-500/20 flex-1 md:flex-none transition-all h-10 flex items-center justify-center px-4" // Adicionei h-10 (altura fixa) ou use classes de py que combinem com o Select
                >
                  {isSending ? (
                      <>
                        <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Enviando...
                      </>
                  ) : (
                      <>
                        <Send className="w-4 h-4 mr-1" />
                        Enviar
                      </>
                  )}
                </Button>
                
                <div className='w-px h-8 bg-[#3d3d3d] hidden md:block' /> 

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <Checkbox 
                        className='font-bold bg-[#3d3d3d] data-[state=checked]:bg-gray-50 w-6 h-6 text-black data-[state=checked]:text-black cursor-pointer transition-colors' 
                        checked={editLastMessage}
                        onCheckedChange={(checked) => setEditLastMessage(!!checked)}
                        onFocus={(e) => e.stopPropagation()}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar Mensagem?</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            
            <EditorSection 
              title="Conteúdo da Mensagem" 
              isOpen={openSections.messageContent} 
              onToggle={() => toggleSection('messageContent')}
            >
              <CustomBorderTextarea
                label="Mensagem"
                maxLength={2000}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onMentionInsert={(newValue) => setMessageContent(newValue)}
                placeholder="@everyone ou qualquer mensagem que apareça acima do embed"
                className="min-h-24 text-sm"
                menuMention={true}
              />
            </EditorSection>

            {embeds.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto bg-[#0f0f0f] rounded-xl border border-white/10 p-2">
              {embeds.map((_, idx) => (
                <div 
                    key={idx}
                    onClick={() => setActiveEmbedIndex(idx)}
                    role="button"
                    tabIndex={0}
                    className={`
                        flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all whitespace-nowrap
                        borderSelect-none outline-none focus:outline-none focus:ring-0 select-none border 
                        ${activeEmbedIndex === idx 
                            ? 'bg-[#3d3d3d] border-[#4d4d4d] text-white shadow-lg shadow-gray-500/20'
                            : 'bg-[#161616] border-[#2e2e2e] text-gray-400 hover:bg-[#202020]'}
                    `}
                >
                    <span className="text-sm font-medium">Embed {idx + 1}</span>
                    <button 
                        onClick={(e) => { e.stopPropagation(); removeEmbed(idx); }}
                        className="flex justify-end cursor-pointer p-1 hover:bg-white/20 rounded-full transition-colors outline-none focus:outline-none items-end"
                        title="Remover Embed"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
              ))}
              
              {embeds.length < 4 && (
                  <Button
                      size="icon-sm"
                      onClick={addEmbed}
                      title='Adicionar Embed'
                      className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg bg-[#161616] text-gray-400 hover:bg-[#202020] border border-[#2e2e2e] border-dashed transition-all"
                  >
                      <Plus />
                  </Button>
              )}
            </div>
            )}

            {embeds.length > 0 && currentEmbed ? (
              <>
                <div className="flex mb-4 mt-16">
                    <div className='flex justify-start bg-[#0f0f0f] border border-white/10 rounded-sm px-3 py-2 text-xs text-gray-400 font-medium'>
                      Editor
                    </div>

                    <hr className="flex-1 mx-4 border-t border-gray-600 mt-4" />

                    <div className='flex justify-end'>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => duplicateEmbed(activeEmbedIndex)}
                        className="text-xs bg-[#161616] border border-[#2e2e2e] text-gray-400 hover:text-white hover:bg-[#3d3d3d] transition-all cursor-pointer"
                    >
                        <Copy className="w-3 h-3 mr-1" /> Duplicar
                    </Button>
                    </div>
                </div>

                <EditorSection 
                title="Autor" 
                isOpen={openSections.author} 
                onToggle={() => toggleSection('author')}
                >
                <ValidatedInput
                    label="Nome do Autor"
                    maxLength={256}
                    value={currentEmbed.author.name}
                    onChange={(e) => updateEmbed('author.name', e.target.value)}
                    placeholder="Nome do autor"
                />
                <div className="grid grid-cols-2 gap-4">
                    <ValidatedInput
                    label="Ícone do Autor (URL)"
                    value={currentEmbed.author.iconUrl}
                    onChange={(e) => updateEmbed('author.iconUrl', e.target.value)}
                    placeholder="https://..."
                    />
                    <ValidatedInput
                    label="URL do Link"
                    value={currentEmbed.author.url}
                    onChange={(e) => updateEmbed('author.url', e.target.value)}
                    placeholder="https://..."
                    />
                </div>
                </EditorSection>

                <EditorSection 
                    title="Conteúdo Principal" 
                    isOpen={openSections.content} 
                    onToggle={() => toggleSection('content')}
                >
                <div className="flex items-end gap-3">
                    <div className="flex-1">
                    <CustomBorderInput
                        label="Título"
                        maxLength={256}
                        value={currentEmbed.title}
                        onChange={(e) => updateEmbed('title', e.target.value)}
                        placeholder="Título do embed"
                    />
                    </div>
                    
                    <Button 
                    variant="outline" 
                    size="icon"
                    className={`mb-2px border-slate-700 ${showTitleUrl ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-slate-800 text-gray-400'}`}
                    onClick={() => setShowTitleUrl(!showTitleUrl)}
                    title="Adicionar URL ao título"
                    >
                    <LinkIcon className="w-4 h-4" />
                    </Button>

                    <div className="relative mb-2px">
                    <input
                        ref={colorInputRef}
                        type="color"
                        value={currentEmbed.color}
                        onChange={(e) => updateEmbed('color', e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Button 
                        variant="outline" 
                        size="icon"
                        className="border-slate-700 w-10 h-10 overflow-hidden"
                        style={{ backgroundColor: currentEmbed.color }}
                        onClick={() => colorInputRef.current?.click()}
                    >
                        <Palette className="w-4 h-4 text-white mix-blend-difference" />
                    </Button>
                    </div>
                </div>

                {showTitleUrl && (
                    <div className="animate-in fade-in slide-in-from-top-1">
                    <ValidatedInput
                        label="URL do Título"
                        value={currentEmbed.url}
                        onChange={(e) => updateEmbed('url', e.target.value)}
                        placeholder="[https://example.com](https://example.com)"
                    />
                    </div>
                )}

                <CustomBorderTextarea
                    label="Descrição"
                    maxLength={4096}
                    value={currentEmbed.description}
                    onChange={(e) => updateEmbed('description', e.target.value)}
                    placeholder="Suporta Markdown"
                    className="min-h-32 text-sm"
                    onMentionInsert={(newValue) => updateEmbed('description', newValue)}
                    menuMention={true}
                />
                </EditorSection>

                <EditorSection 
                    title="Imagens" 
                    isOpen={openSections.images} 
                    onToggle={() => toggleSection('images')}
                    >
                    <div className="space-y-6">
                    <ImageUploader
                        label="Thumbnail (Miniatura)"
                        value={currentEmbed.thumbnail}
                        onChange={(url) => updateEmbed('thumbnail', url)}
                        isOptional
                    />

                    <ImageUploader
                        label="Imagem Principal"
                        value={currentEmbed.image}
                        onChange={(url) => updateEmbed('image', url)}
                        isOptional
                    />
                    </div>
                </EditorSection>

                <EditorSection 
                title={`Campos (${currentEmbed.fields.length})`} 
                isOpen={openSections.fields} 
                onToggle={() => toggleSection('fields')}
                >
                <EmbedFields
                    value={currentEmbed.fields}
                    onChange={(fields) => updateEmbed('fields', fields)}
                    limits={{ maxCount: 25, name: 256, value: 1024 }}
                    collapsedFields={collapsedFields}
                    onToggleCollapse={setCollapsedFields}
                />
                </EditorSection>

                <EditorSection 
                title="Rodapé" 
                isOpen={openSections.footer} 
                onToggle={() => toggleSection('footer')}
                >
                <ValidatedInput
                    label="Texto do Rodapé"
                    maxLength={2048}
                    value={currentEmbed.footer.text}
                    onChange={(e) => updateEmbed('footer.text', e.target.value)}
                    placeholder="Texto do rodapé"
                />

                <ValidatedInput
                    label="Ícone do Rodapé (URL)"
                    value={currentEmbed.footer.iconUrl}
                    onChange={(e) => updateEmbed('footer.iconUrl', e.target.value)}
                    placeholder="https://..."
                />

                <div className="flex items-center gap-2 pt-2">
                    <input
                    type="checkbox"
                    id="timestamp"
                    checked={currentEmbed.timestamp}
                    onChange={(e) => updateEmbed('timestamp', e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer accent-[#5865F2]"
                    />
                    <label htmlFor="timestamp" className="text-sm text-gray-300 cursor-pointer select-none">
                    Exibir timestamp (Hoje às {new Date().getHours()}:{new Date().getMinutes().toString().padStart(2, '0')})
                    </label>
                </div>
                </EditorSection>
              </>
            ) : (
                <div className="p-8 border border-dashed border-[#2e2e2e] rounded-xl flex flex-col items-center justify-center text-center bg-[#161616]">
                    <p className="text-gray-400 mb-4">Nenhuma embed selecionada.</p>
                    <button
                        onClick={addEmbed}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
                    >
                        Criar Primeira Embed
                    </button>
                </div>
            )}
          </div>

          <div className="lg:sticky lg:top-18 h-fit">
            <div className="bg-[#161616] backdrop-blur-md border border-slate-700/50 rounded-xl p-6">

              <div className="inline-flex items-center justify-between w-full mb-4">

                <h2 className="text-xl font-semibold text-white mt-1">Prévia no Discord</h2>

                <div className="flex justify-end">
                  <Button
                    onClick={resetAll}
                    variant="outline"
                    className="bg-red-500/5 cursor-pointer hover:bg-red-500/10 border-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="ml-1">Resetar</span>
                  </Button>
                </div>
              </div>
              
              <div className="bg-[#313338] rounded-md p-4 pt-3 font-sans relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 pointer-events-none transition-colors" />

                <div className="flex gap-4 relative z-10">
                  <div className="mt-1 shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-bold text-lg">
                      <Image
                        src="/logo_trindade.png"
                        width={40}
                        height={40}
                        alt="Avatar do Bot"
                        className='rounded-full'
                       />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium hover:underline cursor-pointer">ᴛʀᴘ - ᴏꜰɪᴄɪᴀʟ</span>
                      <span className="bg-[#5865F2] text-white text-[10px] px-1.5 py-1px rounded-[3px] flex items-center gap-1">
                        <span className="mt-1px font-extrabold">APP</span>
                      </span>
                      <span className="text-xs text-gray-400 ml-1">Hoje às {new Date().getHours()}:{new Date().getMinutes().toString().padStart(2, '0')}</span>
                    </div>

                    {messageContent && (
                      <div className="text-gray-200 text-sm mb-2 wrap-break-word">
                        <MentionFormatter content={messageContent} />
                      </div>
                    )}

                    {/* LISTA DE EMBEDS */}
                    <div className="space-y-2">
                    {embeds.map((emb, idx) => (
                      <div key={idx} className="flex max-w-full">
                      <div
                        className="w-1 rounded-l-md shrink-0"
                        style={{ backgroundColor: emb.color }}
                      />
                
                      <div className="bg-[#2b2d31] rounded-r-md p-4 max-w-full flex-1 border border-[#2b2d31]">
                        {/* Conteúdo Principal + Thumbnail (lado a lado) */}
                        <div className="flex gap-4">
                          {/* Lado Esquerdo: Autor + Título + Descrição + Fields + Imagem */}
                          <div className="flex-1 min-w-0 space-y-4">
                            
                            {/* 1. Autor + Título + Descrição */}
                            <div className="space-y-2 min-w-0">
                              {/* Autor */}
                              {emb.author.name && (
                                <div className="flex items-center gap-2">
                                  {emb.author.iconUrl && (
                                    <Image
                                      src={emb.author.iconUrl}
                                      width={24}
                                      height={24}
                                      alt="Author"
                                      className="w-6 h-6 rounded-full object-cover"
                                      unoptimized
                                      onError={(e) => e.target.style.display = 'none'}
                                    />
                                  )}
                                  <span className="text-sm font-bold text-white">
                                    {emb.author.url ? (
                                      <a href={emb.author.url} className="hover:underline" target="_blank">{emb.author.name}</a>
                                    ) : emb.author.name}
                                  </span>
                                </div>
                              )}

                              {/* Título */}
                              {emb.title && (
                                <div className="text-base font-bold text-white wrap-break-words">
                                  {emb.url ? (
                                    <a href={emb.url} className="text-[#00b0f4] hover:underline" target="_blank">{emb.title}</a>
                                  ) : emb.title}
                                </div>
                              )}

                              {/* Descrição com Markdown e Menções */}
                              {emb.description && (
                                <div className="text-sm text-gray-300">
                                  <DiscordMarkdown content={emb.description} data={serverData} />
                                </div>
                              )}
                            </div>

                            {/* 2. Fields */}
                            {emb.fields.length > 0 && (
                              <div className="flex flex-wrap gap-3">
                                {emb.fields.map((field) => (
                                  <div
                                    key={field.id}
                                    className={`${field.inline ? 'flex-1 min-w-[30%]' : 'w-full'}`}
                                  >
                                    <div className="text-sm font-bold text-white mb-1">
                                      {field.name}
                                    </div>
                                    <div className="text-sm text-gray-300">
                                      <DiscordMarkdown content={field.value} data={serverData} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* 3. Imagem Grande */}
                            {emb.image && (
                              <div>
                                <Image
                                  src={emb.image}
                                  alt="Embed Main"
                                  width={500}
                                  height={400}
                                  className="max-w-full max-h-[300px] rounded-md object-cover"
                                  onError={(e) => e.target.style.display = 'none'}
                                />
                              </div>
                            )}

                            {/* 4. Rodapé + Timestamp (Parte inferior interna) */}
                            {(emb.footer.text || emb.timestamp) && (
                              <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                                {emb.footer.iconUrl && (
                                  <Image
                                    src={emb.footer.iconUrl}
                                    alt="Footer"
                                    width={25}
                                    height={25}
                                    className="rounded-full object-cover"
                                    onError={(e) => e.target.style.display = 'none'}
                                  />
                                )}
                                <span>  
                                  {emb.footer.text}
                                  {emb.footer.text && emb.timestamp && ' • '}
                                  {emb.timestamp && 'Hoje às ' + new Date().getHours() + ':' + new Date().getMinutes().toString().padStart(2, '0')}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Lado Direito: Thumbnail (fixa em uma coluna) */}
                          {emb.thumbnail && (
                            <div className="hidden sm:flex flex-col justify-start shrink-0">
                              <Image
                                src={emb.thumbnail}
                                alt="Thumbnail"
                                width={80}
                                height={80}
                                className="rounded-md object-cover"
                                onError={(e) => e.target.style.display = 'none'}
                              />
                            </div>
                          )}
                        </div>

                        {/* Thumbnail Mobile (Aparece embaixo se não couber) */}
                        {emb.thumbnail && (
                          <div className="sm:hidden mt-4">
                            <Image
                              src={emb.thumbnail}
                              alt="Thumbnail"
                              width={80}
                              height={80}
                              className="rounded-md object-cover"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                <span>Total de caracteres (Todas as embeds)</span>
                <span className={`${
                  (messageContent.length + embeds.reduce((acc, emb) => acc + emb.title.length + emb.description.length + emb.fields.reduce((a, b) => a + b.name.length + b.value.length, 0) + emb.author.name.length + emb.footer.text.length, 0)) > 6000 
                  ? 'text-red-400 font-bold' 
                  : ''
                }`}>
                  {messageContent.length + embeds.reduce((acc, emb) => acc + emb.title.length + emb.description.length + emb.fields.reduce((a, b) => a + b.name.length + b.value.length, 0) + emb.author.name.length + emb.footer.text.length, 0)} / 6000
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}