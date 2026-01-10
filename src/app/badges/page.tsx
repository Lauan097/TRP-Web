"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sprout, Swords, Target, Medal, Flag, Crown, Infinity, Plus, Lock } from 'lucide-react';

export default function BadgesPage() {

  const BADGES_DATA = [
    {
      id: 'NOVATO',
      name: 'Novato',
      time: '0-2 meses',
      color: 'text-blue-400',
      bgGradient: 'from-blue-500/20 to-blue-600/5',
      border: 'border-blue-500/20',
      icon: Sprout,
    },
    {
      id: 'INTERMEDIARIO',
      name: 'Intermediário',
      time: '2-4 meses',
      color: 'text-cyan-400',
      bgGradient: 'from-cyan-500/20 to-cyan-600/5',
      border: 'border-cyan-500/20',
      icon: Swords,
    },
    {
      id: 'AVANCADO',
      name: 'Avançado',
      time: '4-8 meses',
      color: 'text-purple-400',
      bgGradient: 'from-purple-500/20 to-purple-600/5',
      border: 'border-purple-500/20',
      icon: Target,
    },
    {
      id: 'VETERANO',
      name: 'Veterano',
      time: '8-12 meses',
      color: 'text-orange-400',
      bgGradient: 'from-orange-500/20 to-orange-600/5',
      border: 'border-orange-500/20',
      icon: Medal,
    },
    {
      id: 'PIONEIRO',
      name: 'Pioneiro',
      time: '12-18 meses',
      color: 'text-yellow-400',
      bgGradient: 'from-yellow-500/20 to-yellow-600/5',
      border: 'border-yellow-500/20',
      icon: Flag,
    },
    {
      id: 'LENDA',
      name: 'Lenda',
      time: '18-36 meses',
      color: 'text-pink-400',
      bgGradient: 'from-pink-500/20 to-pink-600/5',
      border: 'border-pink-500/20',
      icon: Crown,
    },
    {
      id: 'IMORTAL',
      name: 'Imortal',
      time: '36+ meses',
      color: 'text-white',
      bgGradient: 'from-purple-600/40 via-fuchsia-600/40 to-pink-600/40',
      border: 'border-purple-500/50',
      icon: Infinity,
      isSpecial: true
    }
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      
      <div className="max-w-5xl w-full bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-white/5 gap-4">
            <div>
                <Link href="/profile" className="inline-flex px-1.5 py-1.5 border border-white/10 rounded-md items-center gap-2 text-xs font-mono text-gray-400 hover:bg-[#2a2a2a]/80 mb-2 transition-colors uppercase tracking-wider">
                    <ArrowLeft size={14} /> Voltar
                </Link>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Mural de <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-200 to-gray-500">Insígnias</span>
                </h1>
            </div>
            <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-lg text-xs font-mono text-gray-400">
                Total Disponível: <span className="text-white font-bold">{BADGES_DATA.length}</span>
            </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            
            {BADGES_DATA.map((badge) => (
                <div 
                    key={badge.id} 
                    className={`group relative aspect-square flex flex-col items-center justify-center text-center p-4 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default
                    ${badge.isSpecial 
                        ? 'border-purple-500/40 hover:border-purple-400' 
                        : `border-white/5 hover:border-white/20 ${badge.border}`
                    }
                    bg-linear-to-br ${badge.bgGradient}
                    `}
                >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>

                    <div className={`mb-3 transition-transform duration-300 group-hover:-translate-y-1 ${badge.color}`}>
                        <badge.icon size={32} strokeWidth={1.5} className={badge.isSpecial ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : ""} />
                    </div>

                    <h3 className={`text-sm font-bold truncate w-full ${badge.isSpecial ? 'text-white' : 'text-gray-200'}`}>
                        {badge.name}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-mono mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        {badge.time}
                    </span>
                </div>
            ))}

            {[1, 2, 3].map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/20 opacity-30 group cursor-not-allowed">
                    <Lock size={20} className="text-gray-600 mb-2" />
                    <span className="text-[10px] text-gray-600 font-mono uppercase">Bloqueado</span>
                </div>
            ))}
        </div>

        <div className="mt-10 pt-6 border-t border-dashed border-white/5 text-center">
            <div className="inline-flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <Plus size={12} className="text-gray-400" />
                Novas insígnias de eventos e mérito serão adicionadas em breve.
            </div>
        </div>

      </div>
    </main>
  );
}