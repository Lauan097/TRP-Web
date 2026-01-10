'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';

interface Application {
  id: number;
  user_id: string;
  status: string;
  data: {
    nomeJogo: string;
    identificacao: string;
    telefone: string;
    nomeMembro: string;
    idMembro: string;
    turnos?: string[];
    answers?: Record<string, string>;
    scheduleDate?: string;
  };
  created_at: string;
}

interface ViewApplicationModalProps {
  application: Application | null;
  viewMode: 'solicitation' | 'quiz';
  onClose: () => void;
}

const questionsMap = [
  { id: 'nomePersonagem', label: '1 - Nome do personagem' },
  { id: 'idadePersonagem', label: '2 - Idade real' },
  { id: 'historiaPersonagem', label: '3 - Tempo de RP' },
  { id: 'motivoEntrada', label: '4 - Histórico em organizações' },
  { id: 'pg', label: '5 - Reação a consequências' },
  { id: 'mg', label: '6 - Motivação' },
  { id: 'cl', label: '7 - Hierarquia' },
  { id: 'rdmVdm', label: '8 - Ação sob pressão' },
  { id: 'amorVida', label: '9 - Diferencial' },
  { id: 'crash', label: '10 - Confiança' },
];

export function ViewApplicationModal({ application, viewMode, onClose }: ViewApplicationModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!application || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col custom-scrollbar">
        <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#242424] z-10">
          <div>
            <h2 className="text-xl font-bold text-white">
              {viewMode === 'solicitation' ? 'Dados da Solicitação' : 'Respostas do Formulário'}
            </h2>
            <p className="text-white/50 text-sm">Candidato: {application.data.nomeJogo} (ID: {application.data.identificacao})</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="bg-[#353535b0] hover:bg-[#444444] transition-colors cursor-pointer">
            <X className="text-white/60 hover:text-white" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {viewMode === 'solicitation' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs uppercase text-white/40 font-bold">Nome no Jogo</label>
                <div className="text-white p-3 bg-white/5 rounded border border-white/5">{application.data.nomeJogo}</div>
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase text-white/40 font-bold">Passaporte (ID)</label>
                <div className="text-white p-3 bg-white/5 rounded border border-white/5">{application.data.identificacao}</div>
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase text-white/40 font-bold">Telefone</label>
                <div className="text-white p-3 bg-white/5 rounded border border-white/5">{application.data.telefone}</div>
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase text-white/40 font-bold">Indicação (Padrinho)</label>
                <div className="text-white p-3 bg-white/5 rounded border border-white/5">
                  {application.data.nomeMembro} (ID: {application.data.idMembro})
                </div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs uppercase text-white/40 font-bold">Turnos de Jogo</label>
                <div className="text-white p-3 bg-white/5 rounded border border-white/5 flex gap-2 flex-wrap">
                  {application.data.turnos && application.data.turnos.length > 0 ? (
                    application.data.turnos.map(t => (
                      <span key={t} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30 capitalize">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-white/30 italic">Nenhum turno selecionado</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {application.data.answers ? (
                questionsMap.map((q) => (
                  <div key={q.id} className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400">{q.label}</label>
                    <div className="text-white/90 p-4 bg-white/5 rounded border border-white/5 text-sm leading-relaxed whitespace-pre-wrap wrap-break-words">
                      {application.data.answers?.[q.id] || <span className="text-white/20 italic">Sem resposta</span>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-white/30">
                  <AlertTriangle className="mx-auto mb-2" size={32} />
                  <p>Este candidato ainda não enviou o formulário.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/10 bg-[#242424] flex justify-end gap-3 sticky bottom-0"></div>
      </div>
    </div>,
    document.body
  );
}
