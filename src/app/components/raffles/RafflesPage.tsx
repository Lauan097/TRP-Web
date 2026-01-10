'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ImageInput from '../embeds/ImageUploader';
import { 
  Trophy, 
  Users, 
  Plus, 
  Trash2, 
  Gift,
  X, 
  UserPlus, 
  Play,
  Dices,
  Settings2
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/app/components/ToastContext";

interface Raffle {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  max_participants?: number;
  auto_close_min?: number;
  auto_close_date?: string;
  status: 'active' | 'closed' | 'finished';
  participants: Participant[];
}

interface Participant {
  id: number;
  discord_id: string;
  discord_name: string;
  discord_tag: string;
  joined_at: string;
}

export default function RafflesPage() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInstantModal, setShowInstantModal] = useState(false);
  
  const [instantNames, setInstantNames] = useState('');
  const [instantWinner, setInstantWinner] = useState('');
  const [isRolling, setIsRolling] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [autoCloseEnabled, setAutoCloseEnabled] = useState(false);
  const [autoCloseType, setAutoCloseType] = useState<'min' | 'date'>('min');
  const [autoCloseMin, setAutoCloseMin] = useState('');
  const [autoCloseDate, setAutoCloseDate] = useState('');
  const [mounted, setMounted] = useState(false);

  const { addToast } = useToast();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500';

  const fetchRaffles = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/raffle/list`);
      if (!response.ok) return;
      const data = await response.json();
      setRaffles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar sorteios:', error);
      setRaffles([]);
    }
  }, [API_BASE]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMounted(true);
      fetchRaffles();
    }, 0);
    return () => clearTimeout(timeout);
  }, [fetchRaffles]);

  const createRaffle = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (imageUrl) formData.append('image_url', imageUrl);
    if (maxParticipants) formData.append('max_participants', maxParticipants);
    if (autoCloseEnabled) {
      if (autoCloseType === 'min') formData.append('auto_close_min', autoCloseMin);
      else formData.append('auto_close_date', autoCloseDate);
    }

    try {
      const response = await fetch(`${API_BASE}/api/raffle/create`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setShowCreateModal(false);
        resetForm();
        fetchRaffles();
        addToast('Sorteio criado com sucesso!', 'success');
      } else {
        addToast('Erro ao criar sorteio. Verifique os dados.', 'error');
      }
    } catch (error) {
      console.error('Erro ao criar sorteio:', error);
      addToast('Erro ao criar sorteio. Tente novamente.', 'error');
    }
  };

  const startRaffle = async (raffleId: number) => {
    try {
      await fetch(`${API_BASE}/api/raffle/${raffleId}/start`, { method: 'PUT' });
      fetchRaffles();
      addToast('Sorteio iniciado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao iniciar sorteio:', error);
      addToast('Erro ao iniciar sorteio. Tente novamente.', 'error');
    }
  };

  const addParticipant = async (raffleId: number, discordId: string, name: string, tag: string) => {
    try {
      await fetch(`${API_BASE}/api/raffle/${raffleId}/add-participant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discord_id: discordId, discord_name: name, discord_tag: tag }),
      });
      if (selectedRaffle && selectedRaffle.id === raffleId) {
        const updated = await fetch(`${API_BASE}/api/raffle/list`).then(r => r.json());
        const active = updated.find((r: Raffle) => r.id === raffleId);
        if (active) setSelectedRaffle(active);
        setRaffles(updated);
      } else {
        fetchRaffles();
      }
      addToast(`Participante ${name} adicionado com sucesso!`, 'success');
    } catch (error) {
      console.error('Erro ao adicionar participante:', error);
      addToast('Erro ao adicionar participante. Verifique os dados.', 'error');
    }
  };

  const removeParticipant = async (raffleId: number, participantId: number) => {
    try {
      await fetch(`${API_BASE}/api/raffle/${raffleId}/remove-participant/${participantId}`, { method: 'DELETE' });
      if (selectedRaffle && selectedRaffle.id === raffleId) {
        fetchRaffles();
        setSelectedRaffle(prev => prev ? {...prev, participants: prev.participants.filter(p => p.id !== participantId)} : null);
      }
      addToast('Participante removido com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao remover participante:', error);
      addToast('Erro ao remover participante. Tente novamente.', 'error');
    }
  };

  const instantRaffle = () => {
    const names = instantNames.split(', ').filter(n => n.trim());
    if (names.length === 0) return;
    
    setIsRolling(true);
    setInstantWinner('');
    
    setTimeout(() => {
      const winner = names[Math.floor(Math.random() * names.length)];
      setInstantWinner(winner);
      setIsRolling(false);
      addToast(`Sorteio realizado! Vencedor: ${winner}`, 'success');
    }, 1500);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImageUrl('');
    setMaxParticipants('');
    setAutoCloseEnabled(false);
    setAutoCloseMin('');
    setAutoCloseDate('');
  };

  const inputStyle = "w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all";
  const labelStyle = "block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1";
  const buttonPrimary = "bg-green-600 hover:bg-green-700 cursor-pointer text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2";
  const buttonSecondary = "bg-zinc-800 hover:bg-zinc-700 cursor-pointer text-zinc-200 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2";

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-zinc-100 p-6 font-sans rounded-2xl">
      
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
            <Gift className="text-yellow-500" size={32} />
            Máfia Trindade - Sorteios
          </h1>
          <p className="text-zinc-500 mt-2">Gerencie eventos e premiações da comunidade</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button onClick={() => setShowInstantModal(true)} className={buttonSecondary}>
            <Dices size={18} />
            Sorteio Rápido
          </button>
          <button onClick={() => setShowCreateModal(true)} className={buttonPrimary}>
            <Plus size={18} />
            Novo Sorteio
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between bg-[#2a2a2a] px-5 py-3 rounded-xl border border-zinc-700">
             <h2 className="text-xl font-semibold text-zinc-200 flex items-center gap-2">
               <Trophy size={20} className="text-yellow-500" />
               Sorteios
             </h2>
             <span className="text-xs bg-[#1a1a1a] px-2 py-1 rounded text-zinc-400">
               Total: {raffles.filter(r => r.status === 'active' || r.status === 'closed').length}
             </span>
          </div>

          {raffles.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/30 rounded-xl border border-zinc-800 border-dashed">
              <Gift size={48} className="mx-auto text-zinc-700 mb-4" />
              <p className="text-zinc-500">Nenhum sorteio ativo no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {raffles.filter(r => r.status === 'active' || r.status === 'closed').map(raffle => (
                <div
                  key={raffle.id}
                  onClick={() => setSelectedRaffle(raffle)}
                  className={`group relative p-5 rounded-xl border transition-all cursor-pointer overflow-hidden ${
                    selectedRaffle?.id === raffle.id 
                      ? 'bg-zinc-900 border-purple-500 ring-1 ring-purple-500/50' 
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
                      {raffle.title}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded border ${
                      raffle.status === 'active' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {raffle.status === 'active' ? 'Ativo' : 'Aguardando Sorteio'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-zinc-400 mb-4 line-clamp-2 min-h-10">
                    {raffle.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-zinc-500 mt-auto pt-4 border-t border-zinc-800">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Users size={14} /> {raffle.participants.length}
                      </span>
                      {raffle.auto_close_min && (
                        <span className="flex items-center gap-1" title="Meta de participantes">
                           Target: {raffle.auto_close_min}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); startRaffle(raffle.id); }}
                      className="cursor-pointer inline-flex items-center bg-yellow-600/80 hover:bg-yellow-600 text-white p-2 rounded-lg transition-all shadow-lg shadow-yellow-900/20"
                      title="Sortear agora"
                    >
                      <Play size={16} fill="currentColor" className="mr-1" />
                      Sortear
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Management */}
        <div className="lg:col-span-1">
          {selectedRaffle ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden sticky top-6 shadow-2xl shadow-black/50">
              <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">{selectedRaffle.title}</h2>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest">Painel de Controle</p>
                  </div>
                  <button onClick={() => setSelectedRaffle(null)} className="text-zinc-500 hover:bg-zinc-800 hover:text-red-400 p-2 rounded-lg transition-all cursor-pointer">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/50">
                  <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                    <UserPlus size={16} className="text-purple-400" /> Adicionar Manualmente
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input type="text" placeholder="ID Discord" id="add-discord-id" className={inputStyle} />
                    <input type="text" placeholder="Nome" id="add-name" className={inputStyle} />
                  </div>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Tag (ex: marcos_apenas.)" id="add-tag" className={`${inputStyle} w-24`} />
                    <button
                      onClick={() => {
                         const id = (document.getElementById('add-discord-id') as HTMLInputElement).value;
                         const name = (document.getElementById('add-name') as HTMLInputElement).value;
                         const tag = (document.getElementById('add-tag') as HTMLInputElement).value;
                         if(id && name && tag) addParticipant(selectedRaffle.id, id, name, tag);
                      }}
                      className="flex-1 px-2 cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-3 flex justify-between items-center">
                    <span>Participantes</span>
                    <span className="bg-zinc-800 text-zinc-300 px-2 rounded text-xs">{selectedRaffle.participants.length}</span>
                  </h3>
                  <div className="max-h-[400px] overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    {selectedRaffle.participants.map(p => (
                      <div key={p.id} className="group flex justify-between items-center p-2 rounded hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-900 to-indigo-900 flex items-center justify-center text-xs font-bold text-purple-200">
                            {p.discord_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm text-zinc-200">{p.discord_name}</span>
                             <span className="text-xs text-zinc-600">#{p.discord_tag}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeParticipant(selectedRaffle.id, p.id)}
                          className="opacity-0 cursor-pointer group-hover:opacity-100 text-red-500 hover:bg-red-500/10 p-1.5 rounded transition-all"
                          title="Remover"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {selectedRaffle.participants.length === 0 && (
                      <p className="text-sm text-zinc-600 text-center py-4 italic">Nenhum participante ainda.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border border-zinc-800 border-dashed rounded-xl p-10 text-zinc-600">
              <div className="text-center">
                <Users size={48} className="mx-auto mb-4 opacity-20" />
                <p>Selecione um sorteio ao lado para gerenciar.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800 bg-zinc-900 z-10">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400">
                  <Gift size={20} /> 
                </div>
                <h2 className="text-lg font-bold text-white">Criar Novo Sorteio</h2>
              </div>
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                }} 
                className="text-zinc-500 hover:bg-zinc-800 hover:text-red-400 p-2 rounded-lg transition-all cursor-pointer"
              >
                <X size={20}/>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
              
              <div className="space-y-4">
                <div>
                  <label className={labelStyle}>Título do Sorteio</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className={inputStyle} 
                    placeholder="Ex: VIP Ouro Permanente" 
                    autoFocus
                  />
                </div>

                <div>
                  <label className={labelStyle}>Descrição</label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className={`${inputStyle} min-h-[100px] resize-none leading-relaxed`} 
                    placeholder="Descreva os detalhes do prêmio ou regras..." 
                  />
                </div>
              </div>

              <div>
                <ImageInput 
                  value={imageUrl} 
                  onChange={setImageUrl} 
                  label="Thumbnail do Evento" 
                />
              </div>

              <div className="h-px bg-zinc-800/50 w-full" />

              <div>
                <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                  <Settings2 size={16} className="text-purple-500"/> Configurações do Sorteio
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-950/50 border border-zinc-800/60 p-4 rounded-lg hover:border-zinc-700 transition-colors">
                      <label className={labelStyle}>Limite de Participantes</label>
                      <div className="relative">
                          <input 
                            type="number" 
                            value={maxParticipants} 
                            onChange={(e) => setMaxParticipants(e.target.value)} 
                            className={`${inputStyle} pl-9`}
                            placeholder="Sem limite" 
                          />
                          <Users className="absolute left-3 top-2.5 text-zinc-600" size={16} />
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-2">Deixe vazio para ilimitado.</p>
                    </div>

                    <div className={`border p-4 rounded-lg transition-all ${autoCloseEnabled ? 'bg-purple-900/10 border-purple-500/30' : 'bg-zinc-950/50 border-zinc-800/60'}`}>
                      <label className="flex items-center justify-between cursor-pointer mb-3 select-none">
                        <span className="text-sm font-medium text-zinc-200">Fechamento Automático</span>
                        <Checkbox 
                          checked={autoCloseEnabled} 
                          onCheckedChange={(checked) => setAutoCloseEnabled(checked === true)} 
                          className="data-[state=checked]:bg-purple-600 border-zinc-600" 
                        />
                      </label>
                      
                      {autoCloseEnabled ? (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 pt-2 border-t border-purple-500/20">
                          <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                            <button 
                              onClick={() => setAutoCloseType('min')} 
                              className={`flex-1 text-xs py-1.5 rounded-md transition-all font-medium ${autoCloseType === 'min' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                              Por Pessoas
                            </button>
                            <button 
                              onClick={() => setAutoCloseType('date')} 
                              className={`flex-1 text-xs py-1.5 rounded-md transition-all font-medium ${autoCloseType === 'date' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                              Por Data
                            </button>
                          </div>
                          
                          {autoCloseType === 'min' ? (
                            <input type="number" placeholder="Qtd. mínima" value={autoCloseMin} onChange={(e) => setAutoCloseMin(e.target.value)} className={inputStyle} />
                          ) : (
                            <input type="datetime-local" value={autoCloseDate} onChange={(e) => setAutoCloseDate(e.target.value)} className={inputStyle} />
                          )}
                        </div>
                      ) : (
                        <p className="text-[10px] text-zinc-500">O sorteio precisará ser encerrado manualmente.</p>
                      )}
                    </div>
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur flex justify-end gap-3 z-10">
              <button onClick={() => {
                setShowCreateModal(false);
              }} className="px-4 py-2 text-sm font-medium text-zinc-400 cursor-pointer hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                Cancelar
              </button>
              <button onClick={createRaffle} className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-purple-900/20 transition-all active:scale-95">
                Confirmar Criação
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showInstantModal && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-lg">
             <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2"><Dices className="text-purple-500"/> Sorteio Rápido</h2>
                <button onClick={() => {
                  setShowInstantModal(false);
                }} className="text-zinc-500 hover:bg-zinc-800 hover:text-red-400 p-2 rounded-lg transition-all cursor-pointer"><X size={24}/></button>
             </div>
             
             <div className="p-6">
                {!instantWinner && !isRolling ? (
                  <>
                    <label className={labelStyle}>Lista de Nomes (Separados por vírgula)</label>
                    <textarea 
                      value={instantNames} 
                      onChange={(e) => setInstantNames(e.target.value)} 
                      className={`${inputStyle} h-40 resize-none font-mono text-sm`} 
                      placeholder="Pedro, Maria, João..."
                    />
                    <div className="mt-2 text-right text-xs text-zinc-500">
                       {instantNames.split(', ').filter(n => n.trim()).length} participantes identificados
                    </div>
                  </>
                ) : (
                  <div className="py-10 text-center">
                     {isRolling ? (
                       <div className="animate-pulse">
                         <Dices size={64} className="mx-auto text-purple-600 animate-spin mb-4" />
                         <h3 className="text-2xl font-bold text-white">Sorteando...</h3>
                       </div>
                     ) : (
                       <div className="animate-in zoom-in duration-300">
                         <Trophy size={64} className="mx-auto text-yellow-500 mb-4" />
                         <p className="text-zinc-400 uppercase tracking-widest text-sm mb-2">O vencedor é</p>
                         <h3 className="text-4xl font-black text-white bg-linear-to-r from-yellow-400 to-yellow-600 bg-clip-text">
                           {instantWinner}
                         </h3>
                         <button onClick={() => {
                           setInstantWinner('');
                         }} className="mt-8 text-sm text-zinc-500 hover:text-white underline">
                           Realizar novo sorteio
                         </button>
                       </div>
                     )}
                  </div>
                )}
             </div>
             
             {!instantWinner && !isRolling && (
               <div className="p-6 border-t border-zinc-800 flex justify-end">
                 <button onClick={instantRaffle} disabled={!instantNames.trim()} className={`${buttonPrimary} w-full justify-center ${!instantNames.trim() ? 'opacity-50 cursor-default' : ''}`}>
                   Sortear Agora
                 </button>
               </div>
             )}
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}