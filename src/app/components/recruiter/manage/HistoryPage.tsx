'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {  
  Users, 
  XCircle, 
  Clock, 
  ChevronRight, 
  Search,
  Trophy,
  X,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ViewApplicationModal } from './ViewApplicationModal';

interface ApplicationData {
  nomeJogo: string;
  identificacao: string;
  telefone: string;
  nomeMembro: string;
  idMembro: string;
  answers?: Record<string, string>;
  scheduleDate?: string;
}

interface Candidate {
  id: number;
  name: string;
  discord_id: string;
  status: string;
  joined_at: string;
  original_status: string;
  data: ApplicationData;
}

interface Application {
  id: number;
  user_id: string;
  status: string;
  data: ApplicationData;
  created_at: string;
}

interface RecruitmentCycle {
  id: number;
  opened_at: string;
  closed_at: string;
  slots_offered: number;
  is_fully_closed: boolean;
  stats: {
    total: number;
    approved: number;
    rejected: number;
  };
  candidates: Candidate[];
}

const getStatusInfo = (status: string) => {
  const map: Record<string, { label: string, color: string }> = {
    'PENDING_SOLICITATION': { label: 'Aguardando Solicitação', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    'APPROVED_SOLICITATION': { label: 'Solicitação Aprovada', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    'REJECTED_SOLICITATION': { label: 'Solicitação Reprovada', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    'PENDING_FORM': { label: 'Aguardando Formulário', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    'SUBMITTED_FORM': { label: 'Formulário Enviado', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    'APPROVED_FORM': { label: 'Formulário Aprovado', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    'REJECTED_FORM': { label: 'Formulário Reprovado', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    'PENDING_INTERVIEW': { label: 'Aguardando Entrevista', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    'APPROVED_INTERVIEW': { label: 'Entrevista Aprovada', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    'REJECTED_INTERVIEW': { label: 'Entrevista Reprovada', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    'PENDING_PRACTICAL': { label: 'Aguardando Teste', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    'APPROVED_PRACTICAL': { label: 'Aprovado Final', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
    'REJECTED_PRACTICAL': { label: 'Reprovado Teste', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  };
  return map[status] || { label: status, color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
};

function CycleDetailsModal({ cycle, onClose, onCandidateClick }: { cycle: RecruitmentCycle | null, onClose: () => void, onCandidateClick: (candidate: Candidate) => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!cycle || !mounted) return null;

  const startDate = new Date(cycle.opened_at);
  const endDate = new Date(cycle.closed_at);
  const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-start bg-[#202020] rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="text-blue-500" />
              Ciclo de Recrutamento #{cycle.id}
            </h2>
            <p className="text-white/50 text-sm mt-1">
              Realizado de {startDate.toLocaleDateString()} até {endDate.toLocaleDateString()} • Duração de {durationDays} dias
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10 text-white/50 hover:text-white cursor-pointer">
            <X />
          </Button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Sidebar de Estatísticas */}
          <div className="w-full md:w-64 bg-[#151515] border-r border-white/10 p-6 space-y-6 rounded-bl-2xl">
            <div>
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Estatísticas Gerais</h3>
              
              <div className="space-y-3">
                <div className="bg-[#252525] p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                    <Users size={14} /> Participantes
                  </div>
                  <div className="text-2xl font-bold text-white">{cycle.stats.total}</div>
                </div>

                <div className="bg-green-900/20 p-3 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 text-green-400/80 text-xs mb-1">
                    <Trophy size={14} /> Aprovados
                  </div>
                  <div className="text-2xl font-bold text-green-400">{cycle.stats.approved}</div>
                </div>

                <div className="bg-red-900/20 p-3 rounded-lg border border-red-500/20">
                  <div className="flex items-center gap-2 text-red-400/80 text-xs mb-1">
                    <XCircle size={14} /> Reprovados
                  </div>
                  <div className="text-2xl font-bold text-red-400">{cycle.stats.rejected}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Taxa de Aprovação</h3>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${(cycle.stats.approved / cycle.stats.total) * 100}%` }}
                />
              </div>
              <div className="text-right text-xs text-white/40 mt-1">
                {((cycle.stats.approved / cycle.stats.total) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-[#1a1a1a] rounded-br-2xl">
            <div className="p-4 border-b border-white/10 bg-[#202020]">
              <h3 className="font-semibold text-white">Lista de Participantes</h3>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="grid grid-cols-1 gap-2">
                {cycle.candidates.map((candidate) => (
                  <div 
                    key={candidate.id} 
                    onClick={() => onCandidateClick(candidate)}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#252525] border border-white/5 hover:border-white/10 hover:bg-[#2a2a2a] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${candidate.status === 'APPROVED_PRACTICAL' ? 'bg-green-500' : candidate.status.includes('REJECTED') ? 'bg-red-500' : 'bg-yellow-500'}`} />
                      <div>
                        <div className="font-medium text-white text-sm">{candidate.name}</div>
                        <div className="text-xs text-white/40">{candidate.discord_id}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusInfo(candidate.status).color}>
                      {getStatusInfo(candidate.status).label}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}

export function HistoryPage() {
  const [cycles, setCycles] = useState<RecruitmentCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCycle, setSelectedCycle] = useState<RecruitmentCycle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [viewCandidate, setViewCandidate] = useState<Application | null>(null);
  const [viewMode, setViewMode] = useState<'solicitation' | 'quiz'>('solicitation');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500';

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/site/recruitment/history`);
        if (res.ok) {
          const data = await res.json();
          setCycles(data);
        } else {
          console.error('Erro ao buscar histórico:', res.statusText);
        }
      } catch (error) {
        console.error('Erro de conexão ao buscar histórico:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [apiUrl]);

  const handleCandidateClick = (candidate: Candidate) => {
    const app = {
      id: candidate.id,
      user_id: candidate.discord_id,
      status: candidate.original_status,
      data: candidate.data,
      created_at: candidate.joined_at
    };
    
    setViewCandidate(app);
    setViewMode('solicitation');
  };

  const filteredCycles = cycles.filter(cycle => 
    cycle.id.toString().includes(searchTerm) || 
    new Date(cycle.opened_at).toLocaleDateString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      
      <CycleDetailsModal 
        cycle={selectedCycle} 
        onClose={() => setSelectedCycle(null)} 
        onCandidateClick={handleCandidateClick}
      />

      <ViewApplicationModal
        application={viewCandidate}
        viewMode={viewMode}
        onClose={() => setViewCandidate(null)}
      />

      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <h1 className='text-3xl font-bold'>
          <History className="text-blue-400 inline-block mr-2" />
          Histórico
        </h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <Input 
            placeholder="Buscar por ID ou data..." 
            className="pl-9 bg-[#1a1a1a] border-white/10 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border-b border-white/10 mt-6 mb-8" />

      {loading ? (
        <div className="text-white/50 text-center py-12">Carregando histórico...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCycles.map((cycle) => (
            <div 
              key={cycle.id}
              onClick={() => setSelectedCycle(cycle)}
              className="group bg-[#1a1a1a] border border-white/10 hover:border-white/20 rounded-xl p-5 cursor-pointer transition-all hover:bg-[#202020] relative overflow-hidden"
            >

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Ciclo #{cycle.id}</h3>
                    <p className="text-xs text-white/40">
                      {new Date(cycle.opened_at).toLocaleDateString()} - {new Date(cycle.closed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className={cycle.is_fully_closed 
                    ? "bg-red-900/20 text-red-400 border-red-500/20" 
                    : "bg-yellow-900/20 text-yellow-400 border-yellow-500/20"
                  }>
                    {cycle.is_fully_closed ? 'Finalizado' : 'Em Andamento'}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-black/20 rounded-lg p-2 text-center">
                    <div className="text-xs text-white/40 mb-1">Total</div>
                    <div className="font-bold text-white">{cycle.stats.total}</div>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-2 text-center border border-green-500/10">
                    <div className="text-xs text-green-400/70 mb-1">Aprov.</div>
                    <div className="font-bold text-green-400">{cycle.stats.approved}</div>
                  </div>
                  <div className="bg-red-500/10 rounded-lg p-2 text-center border border-red-500/10">
                    <div className="text-xs text-red-400/70 mb-1">Reprov.</div>
                    <div className="font-bold text-red-400">{cycle.stats.rejected}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-white/30 group-hover:text-white/60 transition-colors pt-2 border-t border-white/5">
                  <span>Ver detalhes completos</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
