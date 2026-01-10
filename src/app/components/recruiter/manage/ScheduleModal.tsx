'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, X, Clock, Info } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  type: 'interview' | 'practical';
  scheduleDate: string;
  onDateChange: (date: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function ScheduleModal({ 
  isOpen, 
  type, 
  scheduleDate, 
  onDateChange, 
  onClose, 
  onSubmit 
}: ScheduleModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className={`p-6 border-b border-white/10 flex justify-between items-start ${
          type === 'interview' ? 'bg-linear-to-r from-blue-500/10 to-transparent' : 'bg-linear-to-r from-orange-500/10 to-transparent'
        }`}>
          <div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
              type === 'interview' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'
            }`}>
              <Calendar size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">
              Agendar {type === 'interview' ? 'Entrevista' : 'Teste Prático'}
            </h2>
            <p className="text-white/50 text-sm mt-1">Defina a data e horário para o candidato.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10 -mt-2 -mr-2 cursor-pointer">
            <X className="text-white/50 hover:text-white" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <Clock size={14} className="text-white/50" />
              Data e Horário
            </label>
            <div className="relative">
              <Input 
                type="datetime-local" 
                value={scheduleDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-[#0f0f0f] border-white/10 text-white scheme-dark h-12 text-lg focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4 flex gap-3">
            <Info className="text-blue-400 shrink-0 mt-0.5" size={16} />
            <div className="text-xs text-blue-200/70 leading-relaxed">
              Ao confirmar, a data será exibida no card para o candidato.
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-[#151515] flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="text-white/50 hover:text-white hover:bg-white/5 cursor-pointer">
            Cancelar
          </Button>
          <Button 
            onClick={onSubmit} 
            className={`${
              type === 'interview' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700 cursor-pointer'
            } text-white min-w-[140px]`}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
