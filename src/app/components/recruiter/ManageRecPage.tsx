'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Shield, RefreshCw, Trash } from 'lucide-react';
import { useToast } from "@/app/components/ToastContext";
import { NumberInput } from "@/app/components/NumberInput";
import { IoLockClosedOutline, IoLockOpenOutline } from "react-icons/io5";
import { ScheduleModal } from './manage/ScheduleModal';
import { ApplicationsTable } from './manage/ApplicationsTable';
import { ViewApplicationModal } from './manage/ViewApplicationModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HistoryPage } from './manage/HistoryPage';

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

interface Cycle {
  id: number;
  is_open: boolean;
  slots: number;
  created_at: string;
}

export default function ManageRecPage() {
  const [loading, setLoading] = useState(true);
  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [slotsInput, setSlotsInput] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [viewMode, setViewMode] = useState<'solicitation' | 'quiz'>('solicitation');
  const { addToast } = useToast();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500';
  
  const [scheduleModal, setScheduleModal] = useState<{
    isOpen: boolean;
    type: 'interview' | 'practical';
    appId: number | null;
  }>({ isOpen: false, type: 'interview', appId: null });
  const [scheduleDate, setScheduleDate] = useState('');
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteAppId, setDeleteAppId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setRefreshing(true);
    try {
      const statusRes = await fetch(`${apiUrl}/api/site/recruitment/status`);
      const statusData = await statusRes.json();
      setCycle(statusData.cycle);

      const appsRes = await fetch(`${apiUrl}/api/site/recruitment/applications`);
      const appsData = await appsRes.json();
      
      if (Array.isArray(appsData)) {
        setApplications(appsData);
      } else {
        console.error('Invalid applications data:', appsData);
        setApplications([]);
      }

    } catch (error) {
      console.error(error);
      addToast('Erro ao carregar dados.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [addToast, apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCycle = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/site/recruitment/cycle/open`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots: slotsInput })
      });
      if (res.ok) {
        addToast('Recrutamento aberto com sucesso!', 'success');
        fetchData();
      } else {
        addToast('Erro ao abrir recrutamento!', 'error');
      }
    } catch (error) {
      console.error(error);
      addToast('Erro de conexão.', 'error');
    }
  };

  const handleCloseCycle = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/site/recruitment/cycle/close`, {
        method: 'POST'
      });
      if (res.ok) {
        addToast('Recrutamento fechado!', 'success');
        fetchData();
      } else {
        addToast('Erro ao fechar recrutamento!', 'error');
      }
    } catch (error) {
      console.error(error);
      addToast('Erro de conexão.', 'error');
    }
  };

  const updateStatus = async (id: number, newStatus: string, scheduleDate?: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/site/recruitment/application/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, scheduleDate })
      });
      if (res.ok) {
        return true;
      } else {
        addToast(`Erro ao atualizar status do ID ${id}!`, 'error');
        return false;
      }
    } catch (error) {
      console.error(error);
      addToast('Erro de conexão.', 'error');
      return false;
    }
  };

  const handleDeleteApplication = async (id: number) => {
    setDeleteAppId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDeleteApplication = async () => {
    if (!deleteAppId) return;

    try {
      const res = await fetch(`${apiUrl}/api/site/recruitment/application/${deleteAppId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        addToast('Candidato deletado com sucesso!', 'success');
        fetchData();
      } else {
        addToast('Erro ao deletar candidato!', 'error');
      }
    } catch (error) {
      console.error(error);
      addToast('Erro de conexão.', 'error');
    } finally {
      setConfirmDeleteOpen(false);
      setDeleteAppId(null);
    }
  };

  const handleBatchAction = async (action: 'release_form' | 'release_interview' | 'release_test') => {
    let targetApps: Application[] = [];
    let newStatus = '';

    if (action === 'release_form') {
      targetApps = applications.filter(app => app.status === 'APPROVED_SOLICITATION');
      newStatus = 'PENDING_FORM';
    } else if (action === 'release_interview') {
      targetApps = applications.filter(app => app.status === 'APPROVED_FORM');
      newStatus = 'PENDING_INTERVIEW';
    }

    if (targetApps.length === 0) return;

    setLoading(true);
    await Promise.all(targetApps.map(app => updateStatus(app.id, newStatus)));
    addToast('Ação Tipo 0 realizada com sucesso!', 'success');
    fetchData();
  };

  const handleScheduleSubmit = async () => {
    if ((!scheduleModal.appId && scheduleModal.appId !== -1) || !scheduleDate) {
      addToast('Selecione uma data e horário.', 'error');
      return;
    }

    const newStatus = scheduleModal.type === 'interview' ? 'PENDING_INTERVIEW' : 'PENDING_PRACTICAL';

    if (scheduleModal.appId === -1) {
      const targetApps = applications.filter(app => app.status === 'APPROVED_INTERVIEW');
      
      if (targetApps.length === 0) {
        addToast('Nenhum candidato elegível para agendamento.', 'warning');
        return;
      }

      setLoading(true);
      await Promise.all(targetApps.map(app => updateStatus(app.id, newStatus, scheduleDate)));
      addToast('Ação Tipo 0 realizada com sucesso!', 'success');
      fetchData();

    } else {
      const success = await updateStatus(scheduleModal.appId!, newStatus, scheduleDate);
      if (success) {
        addToast(`Status atualizado com sucesso!`, 'success');
        fetchData();
      }
    }
    
    setScheduleModal({ isOpen: false, type: 'interview', appId: null });
    setScheduleDate('');
  };

  const openScheduleModal = (appId: number, type: 'interview' | 'practical') => {
    setScheduleModal({ isOpen: true, type, appId });
    setScheduleDate('');
  };

  if (loading) return <div className="p-8 text-white">Carregando painel...</div>;

  return (
    <div>
      <div className="space-y-8 p-6 bg-[#1a1a1a] border border-white/10 rounded-3xl relative">
        
        <ScheduleModal
          isOpen={scheduleModal.isOpen}
          type={scheduleModal.type}
          scheduleDate={scheduleDate}
          onDateChange={setScheduleDate}
          onClose={() => setScheduleModal({ ...scheduleModal, isOpen: false })}
          onSubmit={handleScheduleSubmit}
        />

        {confirmDeleteOpen && createPortal(
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Trash className="text-red-500" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Confirmar Exclusão</h3>
                    <p className="text-white/60 text-sm">Esta ação não pode ser desfeita</p>
                  </div>
                </div>
                <p className="text-white/80 mb-6">
                  Tem certeza que deseja deletar este candidato? Todos os dados serão perdidos permanentemente.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent hover:bg-white/10 border border-white/20 text-white hover:text-white cursor-pointer"
                    onClick={() => {
                      setConfirmDeleteOpen(false);
                      setDeleteAppId(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 bg-red-900/50 hover:bg-red-900/90 border border-red-500/30 cursor-pointer"
                    onClick={confirmDeleteApplication}
                  >
                    Deletar
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

        <ViewApplicationModal
          application={selectedApp}
          viewMode={viewMode}
          onClose={() => setSelectedApp(null)}
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="text-red-600" />
              Gestão de Recrutamento
            </h1>
            <p className="text-white/50 text-sm mt-1">Gerenciar ciclos de recrutamento.</p>
          </div>

          <div className="flex items-center gap-2 bg-black/20 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${cycle?.is_open ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-white font-semibold uppercase text-sm">
                {cycle?.is_open ? 'Aberto' : 'Fechado'}
              </span>
            </div>

            <div className="w-px mr-2 ml-2 h-6 bg-white/10" />

            {cycle?.is_open ? (
              <DropdownMenu open={confirmCloseOpen} onOpenChange={setConfirmCloseOpen} modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="destructive" 
                    className="bg-red-900/50 hover:bg-red-900/90 border border-red-500/30 cursor-pointer"
                  >
                    <IoLockClosedOutline size={16} className="mr-1" /> Fechar Ciclo
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-[#272727] border border-white/10 shadow-2xl" align="center">
                  <DropdownMenuLabel className="text-white/50">Confirmar Fechamento</DropdownMenuLabel>
                  <div className="px-2 py-1.5 text-sm text-white/80">
                    Tem certeza que deseja fechar o recrutamento atual?
                  </div>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <div className="flex gap-2 p-2">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="flex-1 bg-red-900/50 hover:bg-red-900/90 border border-red-500/30 cursor-pointer"
                      onClick={() => {
                        handleCloseCycle();
                        setConfirmCloseOpen(false);
                      }}
                    >
                      Sim
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 bg-transparent hover:bg-white/10 border border-white/20 text-white hover:text-white cursor-pointer"
                      onClick={() => setConfirmCloseOpen(false)}
                    >
                      Não
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <NumberInput
                  value={slotsInput} 
                  onChange={setSlotsInput}
                  className="w-20 bg-black/50 border-white/10 text-white"
                  min={1} 
                  max={50}
                />
                <Button 
                  onClick={handleOpenCycle}
                  className="bg-green-900/50 hover:bg-green-900 text-green-100 border border-green-500/30 cursor-pointer"
                >
                  <IoLockOpenOutline size={16} className="mr-1" /> Abrir Vagas
                </Button>
              </div>
            )}
            
            <Button variant="ghost" size="icon" onClick={fetchData} disabled={refreshing} className='cursor-pointer bg-[#2a2a2a] hover:bg-[#414141]'>
              <RefreshCw size={18} className={`text-white/70 hover:text-white ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Total de Vagas</div>
            <div className="text-2xl font-bold text-white">{cycle?.slots || 0}</div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Candidatos Ativos</div>
            <div className="text-2xl font-bold text-white">
              {applications.filter(a => !a.status.includes('REJECTED')).length}
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Aprovados Final</div>
            <div className="text-2xl font-bold text-green-500">
              {applications.filter(a => a.status === 'APPROVED_PRACTICAL').length}
            </div>
          </div>
        </div>

        <div className='border-b border-white/10'></div>

        <div className="space-y-4">
          <ApplicationsTable
            applications={applications}
            onView={(app, mode) => { setSelectedApp(app); setViewMode(mode); }}
            onUpdateStatus={(id, status) => updateStatus(id, status).then(() => fetchData())}
            onSchedule={openScheduleModal}
            onBatchAction={handleBatchAction}
            onDelete={handleDeleteApplication}
          />
        </div>

      </div>

      <div className="space-y-8 p-6 mt-20 bg-[#1a1a1a] border border-white/10 rounded-3xl relative">

        <HistoryPage />

      </div>

    </div>
  );
}