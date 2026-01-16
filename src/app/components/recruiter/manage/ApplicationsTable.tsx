'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trash, 
  UserCheck, 
  Eye, 
  ThumbsUp, 
  MoreHorizontalIcon, 
  FileText,
  MicVocal,
  Sword,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
    answers?: Record<string, string>;
    scheduleDate?: string;
  };
  created_at: string;
}

interface ApplicationsTableProps {
  applications: Application[];
  onView: (app: Application, mode: 'solicitation' | 'quiz') => void;
  onUpdateStatus: (id: number, status: string) => void;
  onSchedule: (id: number, type: 'interview' | 'practical') => void;
  onBatchAction?: (action: 'release_form' | 'release_interview' | 'release_test') => void;
  onDelete?: (id: number) => void;
}

interface ActionsMenuProps {
  app: Application;
  onView: (app: Application, mode: 'solicitation' | 'quiz') => void;
  onDelete?: (id: number) => void;
}

function ActionsMenu({ app, onView, onDelete }: ActionsMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen} modal={false}>
      <Tooltip open={isTooltipOpen && !isMenuOpen}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button 
              size="icon-sm" 
              className='bg-transparent hover:bg-[#3d3d3d] border border-[#3d3d3d] cursor-pointer text-white/50 hover:text-white focus-visible:ring-0 focus-visible:ring-offset-0'
              onMouseEnter={() => setIsTooltipOpen(true)}
              onMouseLeave={() => setIsTooltipOpen(false)}
              onFocus={() => setIsTooltipOpen(false)}
              onClick={() => setIsTooltipOpen(false)}
            >
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ações</p>
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="center" className="bg-[#272727] border border-white/10 shadow-2xl min-w-47.5">
        
        <DropdownMenuItem onClick={() => onView(app, 'solicitation')}>
          Ver Solicitação
          <DropdownMenuShortcut><Eye /></DropdownMenuShortcut>
        </DropdownMenuItem>

        {(app.status === 'SUBMITTED_FORM' || app.status === 'APPROVED_FORM' || app.status === 'PENDING_INTERVIEW' || app.status === 'APPROVED_INTERVIEW' || app.status === 'PENDING_PRACTICAL' || app.status === 'APPROVED_PRACTICAL') && (
          <DropdownMenuItem onClick={() => onView(app, 'quiz')}>
            Ver Respostas do Quiz
            <DropdownMenuShortcut><FileText /></DropdownMenuShortcut>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className='bg-[#3d3d3d]' />

        <DropdownMenuItem 
          variant='destructive' 
          onClick={() => onDelete?.(app.id)}
          disabled={app.status === 'APPROVED_PRACTICAL' || app.status === 'REJECTED_FORM' || app.status === 'REJECTED_INTERVIEW' || app.status === 'REJECTED_PRACTICAL' || app.status === 'REJECTED_SOLICITATION'}
        >
          Deletar Candidato
          <DropdownMenuShortcut><Trash className='text-red-400'/></DropdownMenuShortcut>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ApplicationsTable({ applications, onView, onUpdateStatus, onSchedule, onBatchAction, onDelete }: ApplicationsTableProps) {
  const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = applications.slice(startIndex, endIndex);
  
  const getBatchActionState = () => {
    const activeApps = applications.filter(app => !app.status.startsWith('REJECTED_'));
    
    if (activeApps.length === 0) return null;

    const isSolicitationStage = activeApps.some(app => 
      ['PENDING_SOLICITATION', 'APPROVED_SOLICITATION'].includes(app.status)
    );

    if (isSolicitationStage) {
      const allApproved = activeApps.every(app => app.status === 'APPROVED_SOLICITATION');
      return {
        label: '',
        title: 'Liberar Formulário',
        action: 'release_form' as const,
        disabled: !allApproved,
        icon: FileText,
        color: 'text-blue-400 border-blue-400/20 bg-blue-900/40 hover:bg-blue-900'
      };
    }

    const isFormStage = activeApps.some(app => 
      ['PENDING_FORM', 'SUBMITTED_FORM', 'APPROVED_FORM'].includes(app.status)
    );

    if (isFormStage) {
      const allApproved = activeApps.every(app => app.status === 'APPROVED_FORM');
      return {
        label: '',
        title: 'Liberar Entrevista',
        action: 'release_interview' as const,
        disabled: !allApproved,
        icon: MicVocal,
        color: 'text-cyan-400 border-cyan-400/20 bg-cyan-900/40 hover:bg-cyan-900'
      };
    }

    const isInterviewStage = activeApps.some(app => 
      ['PENDING_INTERVIEW', 'APPROVED_INTERVIEW'].includes(app.status)
    );

    if (isInterviewStage) {
      const allApproved = activeApps.every(app => app.status === 'APPROVED_INTERVIEW');
      return {
        label: '',
        title: 'Liberar Teste',
        action: 'release_test' as const,
        disabled: !allApproved,
        icon: Sword,
        color: 'text-orange-400 border-orange-400/20 hover:bg-orange-400/10'
      };
    }

    return null;
  };

  const batchState = getBatchActionState();

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'PENDING_SOLICITATION': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
      'APPROVED_SOLICITATION': 'bg-blue-500/20 text-blue-500 border-blue-500/50',
      'REJECTED_SOLICITATION': 'bg-red-500/20 text-red-500 border-red-500/50',
      'PENDING_FORM': 'bg-purple-500/20 text-purple-500 border-purple-500/50',
      'SUBMITTED_FORM': 'bg-pink-500/20 text-pink-500 border-pink-500/50',
      'APPROVED_FORM': 'bg-indigo-500/20 text-indigo-500 border-indigo-500/50',
      'REJECTED_FORM': 'bg-red-500/20 text-red-500 border-red-500/50',
      'PENDING_INTERVIEW': 'bg-cyan-500/20 text-cyan-500 border-cyan-500/50',
      'APPROVED_INTERVIEW': 'bg-teal-500/20 text-teal-500 border-teal-500/50',
      'REJECTED_INTERVIEW': 'bg-red-500/20 text-red-500 border-red-500/50',
      'PENDING_PRACTICAL': 'bg-orange-500/20 text-orange-500 border-orange-500/50',
      'APPROVED_PRACTICAL': 'bg-green-500/20 text-green-500 border-green-500/50',
      'REJECTED_PRACTICAL': 'bg-red-500/20 text-red-500 border-red-500/50',
    };
    
    const labels: Record<string, string> = {
      'PENDING_SOLICITATION': 'Aguardando Solicitação',
      'APPROVED_SOLICITATION': 'Solicitação Aprovada',
      'REJECTED_SOLICITATION': 'Solicitação Reprovada',
      'PENDING_FORM': 'Aguardando Formulário',
      'SUBMITTED_FORM': 'Formulário Enviado',
      'APPROVED_FORM': 'Formulário Aprovado',
      'REJECTED_FORM': 'Formulário Reprovado',
      'PENDING_INTERVIEW': 'Aguardando Entrevista',
      'APPROVED_INTERVIEW': 'Entrevista Aprovada',
      'REJECTED_INTERVIEW': 'Reprovado na Entrevista',
      'PENDING_PRACTICAL': 'Aguardando Teste Prático',
      'APPROVED_PRACTICAL': 'Aprovado Final',
      'REJECTED_PRACTICAL': 'Reprovado no Teste',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-bold border ${styles[status] || 'bg-gray-500/20 text-gray-500'}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        <Users size={18} />
        Candidaturas Recebidas
      </h2>

      <div className="overflow-x-auto rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#242424] border-b border-white/10">
            <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
              <th className="p-4 text-sm">Candidato</th>
              <th className="p-4 text-sm">Info</th>
              <th className="p-4 text-sm">Status</th>
              <th className="p-4 text-right">
                {batchState && (
                  <Button 
                    size="icon-sm" 
                    disabled={batchState.disabled}
                    onClick={() => {
                      if (batchState.action === 'release_test') {
                        onSchedule(-1, 'practical');
                      } else {
                        onBatchAction?.(batchState.action);
                      }
                    }}
                    title={batchState.title}
                    className={`bg-transparent border cursor-pointer transition-all ${
                      batchState.disabled 
                        ? 'opacity-50 border-white/10 text-white/30 cursor-not-allowed!' 
                        : batchState.color
                    }`}
                  >
                    <batchState.icon />
                  </Button>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="text-white/80 text-sm">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-white/30 italic">
                  Nenhuma candidatura encontrada.
                </td>
              </tr>
            ) : (
              currentApplications.map((app) => (
                <tr key={app.id} className="border-b border-white/5 hover:bg-[#242424] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white">{capitalize(app.data.nomeJogo)}</div>
                    <div className="text-xs text-white/50">ID: {app.data.identificacao}</div>
                    <div className="text-xs text-white/50">Discord: {app.user_id}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="flex items-center gap-1"><ThumbsUp size={14}/>{capitalize(app.data.nomeMembro) || '-'} ({app.data.idMembro})</span>
                      <span className="flex items-center gap-1"><Clock size={14}/> {new Date(app.created_at).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">

                      {app.status === 'PENDING_SOLICITATION' && (
                        <>
                          <Button size="sm" onClick={() => onUpdateStatus(app.id, 'APPROVED_SOLICITATION')} className="bg-green-500/20 hover:bg-green-500/40 text-green-500 h-8 w-8 p-0 cursor-pointer"><CheckCircle size={16}/></Button>
                          <Button size="sm" onClick={() => onUpdateStatus(app.id, 'REJECTED_SOLICITATION')} className="bg-red-500/20 hover:bg-red-500/40 text-red-500 h-8 w-8 p-0 cursor-pointer"><XCircle size={16}/></Button>
                        </>
                      )}

                      {app.status === 'SUBMITTED_FORM' && (
                        <>
                          <Button size="sm" onClick={() => onUpdateStatus(app.id, 'APPROVED_FORM')} className="bg-green-500/20 hover:bg-green-500/40 text-green-500 h-8 w-8 p-0 cursor-pointer"><CheckCircle size={16}/></Button>
                          <Button size="sm" onClick={() => onUpdateStatus(app.id, 'REJECTED_FORM')} className="bg-red-500/20 hover:bg-red-500/40 text-red-500 h-8 w-8 p-0 cursor-pointer"><XCircle size={16}/></Button>
                        </>
                      )}

                      {app.status === 'PENDING_INTERVIEW' && (
                        <>
                          <Button size="sm" onClick={() => onUpdateStatus(app.id, 'APPROVED_INTERVIEW')} className="bg-green-500/20 hover:bg-green-500/40 text-green-500 h-8 w-8 p-0 cursor-pointer"><CheckCircle size={16}/></Button>
                          <Button size="sm" onClick={() => onUpdateStatus(app.id, 'REJECTED_INTERVIEW')} className="bg-red-500/20 hover:bg-red-500/40 text-red-500 h-8 w-8 p-0 cursor-pointer"><XCircle size={16}/></Button>
                        </>
                      )}

                      {app.status === 'PENDING_PRACTICAL' && (
                        <>
                          <Button size="sm" onClick={() => onUpdateStatus(app.id, 'APPROVED_PRACTICAL')} className="bg-green-500/20 hover:bg-green-500/40 text-green-500 h-8 w-8 p-0 cursor-pointer"><UserCheck size={16}/></Button>
                          <Button size="sm" onClick={() => onUpdateStatus(app.id, 'REJECTED_PRACTICAL')} className="bg-red-500/20 hover:bg-red-500/40 text-red-500 h-8 w-8 p-0 cursor-pointer"><XCircle size={16}/></Button>
                        </>
                      )}

                      <ActionsMenu app={app} onView={onView} onDelete={onDelete} />

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-4 border-t border-white/5">
          <div className="text-sm text-white/40">
            Mostrando {startIndex + 1} a {Math.min(endIndex, applications.length)} de {applications.length} candidatos
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 border-white/10 bg-transparent hover:bg-white/5 text-white disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="text-sm font-medium text-white min-w-25 text-center">
              Página {currentPage} de {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 border-white/10 bg-transparent hover:bg-white/5 text-white disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
