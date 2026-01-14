"use client";

import React from 'react';
import { useEffect, useState } from "react";
import { FaGithub, FaTag, FaCalendarAlt } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Release {
  id: number;
  version: string;
  title: string;
  date: string;
  updatedAt?: string | null;
  description: string;
  url: string;
  author: {
    name: string;
    avatar: string;
  };
}

export default function ChangelogPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const res = await fetch('/api/changelog');
        if (res.ok) {
          const data = await res.json();
          setReleases(data);
        }
      } catch (error) {
        console.error("Failed to fetch changelog", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChangelog();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-[#05050500] text-white pb-20">
      <div className="relative h-[300px] w-full overflow-hidden">
        <div className="absolute inset-0 z-10"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Changelog</h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            Acompanhe todas as atualizações, melhorias e correções do nosso sistema.
          </p>
          <Link 
            href="/" 
            className="mt-8 flex items-center gap-2 text-sm text-gray-200 hover:text-white transition-colors bg-[#2a2a2a] hover:bg-[#1d1d1d] px-4 py-2 rounded-full border border-white/10"
          >
            <FaArrowLeft /> Voltar para o Início
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-4xl mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Carregando atualizações...</p>
          </div>
        ) : releases.length === 0 ? (
          <div className="text-center py-20 bg-[#0f0f0f] rounded-3xl border border-white/5">
            <FaGithub className="text-6xl text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-300">Nenhuma atualização encontrada</h2>
            <p className="text-gray-500 mt-2">Parece que ainda não publicamos nenhuma nota de atualização.</p>
          </div>
        ) : (
          <div className="space-y-12 relative">
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-linear-to-b from-blue-500/50 via-white/10 to-transparent"></div>

            {releases.map((release, index) => (
              <div key={release.id} className="relative pl-12 md:pl-20 fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>

                <div className="absolute left-0 md:left-4 top-0 w-8 h-8 md:w-8 md:h-8 bg-[#050505] border-2 border-blue-500 rounded-full flex items-center justify-center z-10">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>

                <div className="bg-[#13191f] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 transition-all duration-300 group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-bold border border-blue-500/20 flex items-center gap-2">
                          <FaTag className="text-xs" /> {release.version}
                        </span>
                        <span className="text-gray-500 text-sm flex items-center gap-2">
                          <FaCalendarAlt className="text-xs" /> {formatDate(release.date)}
                          {release.updatedAt && release.updatedAt !== release.date && (
                            <span className="text-gray-400 text-sm flex items-center gap-2"> • Editado em {formatDate(release.updatedAt)}</span>
                          )}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        <a href={release.url} target='_blank' className='hover:underline'>{release.title || release.version}</a>
                      </h2>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-neutral-800 px-4 py-2 rounded-xl border border-white/5">
                      <Image 
                        src={release.author.avatar} 
                        alt={release.author.name} 
                        width={32} 
                        height={32} 
                        className="rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Publicado por</span>
                        <span className="text-sm font-medium text-gray-300">{release.author.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({...props}) => <h1 className="text-xl md:text-2xl font-bold text-white mb-4 mt-2 border-b border-white/10 pb-2" {...props} />,
                        h2: ({...props}) => <h2 className="text-lg md:text-xl font-semibold text-white mb-2 mt-2" {...props} />,
                        h3: ({...props}) => <h3 className="text-base md:text-lg font-medium text-white mb-2 mt-2" {...props} />,
                        h4: ({...props}) => <h4 className="text-base font-medium text-white mb-2 mt-2" {...props} />,
                        h5: ({...props}) => <h5 className="text-sm font-medium text-white mb-2 mt-2" {...props} />,
                        h6: ({...props}) => <h6 className="text-sm font-medium text-white mb-2 mt-2" {...props} />,
                        p: ({ children, ...props }: { node?: unknown; children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) => {
                          return React.createElement('div', { className: 'mb-4 leading-7', ...props }, children as React.ReactNode);
                        },
                        a: ({...props}) => <a className="text-blue-400 hover:underline" {...props} />,
                        em: ({...props}) => <em className="italic" {...props} />,
                        strong: ({...props}) => <strong className="font-semibold" {...props} />,
                        code: ({ inline, className, children, ...props }: { node?: unknown; inline?: boolean; className?: string; children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) => {
                          return inline ? (
                            <code className="bg-neutral-950 px-1.5 py-0.5 rounded-sm text-sm font-mono w-fit" {...props}>{children}</code>
                          ) : (
                            <pre className="bg-neutral-950 px-1.5 py-0.5 rounded-sm text-sm font-mono w-fit"><code className={className} {...props}>{children}</code></pre>
                          );
                        },
                        ul: ({...props}) => <ul className="list-disc list-inside ml-4" {...props} />,
                        ol: ({...props}) => <ol className="list-decimal list-inside ml-4" {...props} />,
                        blockquote: ({...props}) => <blockquote className="border-l-4 border-white/10 pl-4 text-gray-400 mt-4" {...props} />,
                        table: ({...props}) => <div className="overflow-auto"><table className="w-full table-auto text-sm" {...props} /></div>,
                        hr: ({ ...props }) => (
                          <hr
                            className="my-6 border-0 h-px bg-white/15 p-0.5"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {release.description}
                    </ReactMarkdown>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                    <a 
                      href={release.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <FaGithub /> Ver no GitHub
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}