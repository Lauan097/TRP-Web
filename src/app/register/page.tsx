'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import CustomBorderInput from '../components/CustomBorderInput';
import QuizForm from '../components/recruitment/QuizForm';
import RecruitmentStepper from '../components/recruitment/RecruitmentStepper';
import StatusDisplay from '../components/recruitment/StatusDisplay';
import CustomSelectMenu from '@/app/components/embeds/CustomSelectMenu';
import { Button } from '@/components/ui/button';
import { Shield, Users, Loader2, FileText, Brain, Swords, Crosshair } from 'lucide-react';
import { useToast } from "@/app/components/ToastContext";
import { FaSun, FaMoon, FaCloudSun } from "react-icons/fa";

interface RecruitmentStatus {
  cycle: {
    id: number;
    is_open: boolean;
    slots: number;
    created_at: string;
    closed_at: string | null;
  } | null;
  slotsLeft: number;
  userStatus: {
    id: number;
    user_id: string;
    cycle_id: number;
    status: string;
    data: {
      scheduleDate?: string;
      [key: string]: unknown;
    };
    created_at: string;
    updated_at: string;
  } | null;
}

export default function RegisterLayout() {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [nomeJogo, setNomeJogo] = useState('');
  const [identificacao, setIdentificacao] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nomeMembro, setNomeMembro] = useState('');
  const [idMembro, setIdMembro] = useState('');
  const [turnos, setTurnos] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<RecruitmentStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500';

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/site/recruitment/status?user_id=${session?.user?.id || ''}`);
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error(error);
      addToast('Erro ao carregar status do recrutamento', 'error');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, addToast, apiUrl]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchStatus();
    } else {
      setLoading(false);
    }
  }, [session?.user?.id, fetchStatus]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && session?.user?.id && status?.userStatus) {
        fetchStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [session?.user?.id, status?.userStatus, fetchStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      addToast('Você precisa estar logado!', 'error');
      return;
    }

    setSubmitting(true);
    console.log('Enviando solicitação. Token:', session?.accessToken ? 'Presente' : 'Ausente');
    try {
      const res = await fetch(`${apiUrl}/api/site/recruitment/solicitation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          accessToken: session.accessToken,
          nomeJogo,
          identificacao,
          telefone,
          nomeMembro,
          idMembro,
          turnos
        })
      });

      const data = await res.json();
      if (res.ok) {
        addToast('Solicitação enviada com sucesso!', 'success');
        fetchStatus();
      } else {
        addToast(data.error || 'Erro ao enviar solicitação', 'error');
      }
    } catch (error) {
      console.error(error);
      addToast('Erro de conexão', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black/40 relative">
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,#000000_90%]"></div>
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-red-900/40 rounded-full blur-[100px] animate-pulse"></div>
      </div>
      <div className="flex flex-col items-center gap-3 rounded-md bg-white/10 px-6 py-5 backdrop-blur-md">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <span className="text-sm text-white/90">Carregando...</span>
      </div>
    </div>
  );

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,#000000_90%]"></div>
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-red-900/40 rounded-full blur-[100px] animate-pulse"></div>
        </div>

        <div className="relative text-center text-white bg-neutral-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 max-w-md w-full shadow-2xl shadow-black/50">
          <div className="relative inline-block mb-6 group">
            <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-full group-hover:bg-red-600/30 transition-all duration-500" />
            <Shield size={64} className="relative z-10 text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] mx-auto" />
          </div>

          <h1 className="text-3xl font-bold mb-3 tracking-wide">
            Acesso Restrito
          </h1>
          
          <p className="text-neutral-400 mb-8 leading-relaxed">
            Esta área é exclusiva para o recrutamento. <br />
            Faça Login para continuar.
          </p>

          <p className="mt-6 text-xs text-neutral-600 uppercase tracking-widest">
            Máfia Trindade Penumbra
          </p>
        </div>
      </main>
    );
  }

  if (status?.userStatus) {
    const s = status.userStatus.status;

    if (s === 'PENDING_FORM') {
      return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 max-w-7xl mx-auto">
          <RecruitmentStepper currentStatus={s} />
          {session.user?.id && <QuizForm userId={session.user.id} onSuccess={fetchStatus} />}
        </main>
      );
    }

    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 max-w-7xl mx-auto relative">
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,#000000_90%]"></div>
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-red-900/40 rounded-full blur-[100px] animate-pulse"></div>
        </div>
        
        <RecruitmentStepper currentStatus={s} />
        
        <div className="w-full max-w-6xl p-8 md:p-12 text-center rounded-3xl shadow-2xl mt-8">
          
          <StatusDisplay status={s} data={status.userStatus.data} />
        </div>
      </main>
    );
  }

  if (!status?.cycle || status.slotsLeft <= 0) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,#000000_90%]"></div>
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-red-900/40 rounded-full blur-[100px] animate-pulse"></div>
        </div>
        <div className="relative z-10 max-w-lg w-full">
          <div className="bg-neutral-900/60 backdrop-blur-2xl border border-white/5 border-t-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl shadow-black/50 ring-1 ring-white/5">
            <div className="relative inline-flex mb-8 group">
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full group-hover:bg-red-500/30 transition-all duration-500" />
              <Shield size={64} className="relative text-red-500/80 drop-shadow-lg" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-b from-white to-white/60 mb-4 tracking-widest uppercase font-serif">
              Recrutamento <span className="text-red-500/90">Fechado</span>
            </h1>
            <hr className="border-white/10 mb-6" />
            <p className="text-neutral-400 text-lg leading-relaxed mb-8 font-light">
              No momento todas as vagas foram preenchidas ou o ciclo foi encerrado.
            </p>
            <p className="text-neutral-500 text-sm italic leading-relaxed">
              Aguarde o início do proximo ciclo. Procure as respostas onde a cidade evita olhar.
            </p>
          </div>
          <div className="mt-8 text-center">
            <p className="text-xs text-neutral-600 tracking-[0.2em] uppercase">Máfia Trindade Penumbra</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8 max-w-7xl mx-auto">
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,#000000_90%]"></div>
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-red-900/40 rounded-full blur-[100px] animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 w-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/10 bg-neutral-900/20">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wider uppercase font-serif">
              Alistamento
            </h1>
            <p className="text-white/50 text-sm mt-2 tracking-widest uppercase">Máfia Trindade Penumbra</p>
            <div className="mt-4 inline-block bg-red-900/20 border border-red-900/30 rounded px-3 py-1">
              <span className="text-red-400 text-xs font-bold uppercase tracking-wider">
                Vagas Disponíveis: {status.slotsLeft}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#1a1a1a] px-2 rounded-sm text-xs font-semibold uppercase text-red-500 tracking-widest">
                  Identificação do Personagem
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <div className='grid grid-cols-2 gap-4'>
              <CustomBorderInput
                label="Nome no Jogo"
                maxLength={50}
                placeholder="Ex: Tony Montana"
                value={nomeJogo}
                onChange={(e) => setNomeJogo(e.target.value)}
                required
              />
              <CustomSelectMenu 
                label="Turnos de Jogo"
                options={[
                  { 
                    name: 'Jogo apenas pela Manhã', 
                    description: 'Disponível das 6h às 12h',
                    icon: FaSun,
                    iconColor: '#FBBF24',
                    value: 'manha' 
                  },
                  { 
                    name: 'Jogo apenas pela Tarde', 
                    description: 'Disponível das 12h às 18h',
                    icon: FaCloudSun,
                    iconColor: '#F97316',
                    value: 'tarde' 
                  },
                  { 
                    name: 'Jogo apenas pela Noite', 
                    description: 'Disponível das 18h às 24h',
                    icon: FaMoon,
                    iconColor: '#6366F1',
                    value: 'noite' 
                  },
                ]}
                multiSelect={true}
                value={turnos}
                onChange={(val) => setTurnos(val as string[])}
              />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <CustomBorderInput
                  label="Passaporte (ID)"
                  maxLength={4}
                  placeholder="Ex: 1234"
                  value={identificacao}
                  onChange={(e) => setIdentificacao(e.target.value)}
                  required
                />
                <CustomBorderInput
                  label="Telefone"
                  maxLength={6}
                  placeholder="Ex: 555-100"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="relative py-8 mt-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#1a1a1a] px-2 rounded-sm text-xs font-semibold uppercase text-red-500 tracking-widest">
                  Padrinho (Indicação)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomBorderInput
                label="Nome do Membro"
                maxLength={50}
                placeholder="Quem te indicou?"
                value={nomeMembro}
                onChange={(e) => setNomeMembro(e.target.value)}
                required
              />
              <CustomBorderInput
                label="ID do Membro"
                maxLength={4}
                placeholder="ID do Padrinho"
                value={idMembro}
                onChange={(e) => setIdMembro(e.target.value)}
                required
              />
            </div>

            <div className="pt-8">
              <Button 
                type="submit" 
                disabled={submitting}
                size="lg" 
                className="cursor-pointer w-full bg-red-900/80 hover:bg-red-800 text-white font-bold py-6 uppercase tracking-widest border border-red-900/50 hover:border-red-500 transition-all duration-300 shadow-[0_0_15px_rgba(153,27,27,0.3)] hover:shadow-[0_0_25px_rgba(153,27,27,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Enviando...' : 'Enviar Solicitação'}
              </Button>
            </div>
          </form>
        </div>
        <div className="relative p-8 md:p-12 flex flex-col bg-neutral-900/50">
          <div className="absolute inset-0 bg-linear-to-br from-black via-transparent to-red-950/20 pointer-events-none" />
          <div className="relative z-10 h-full flex flex-col">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 font-serif">
                <Crosshair className="text-red-600" />
                Processo de Seleção
              </h2>
              <p className="text-neutral-400 text-sm mt-2 font-light">
                Sua jornada para integrar a família consiste em 4 etapas obrigatórias.
              </p>
            </div>
            <div className="flex-1 relative pl-4">
              <div className="absolute left-[27px] top-2 bottom-10 w-0.5 bg-linear-to-b from-red-900 via-red-900/30 to-transparent" />
              <div className="space-y-10">
                <div className="relative flex gap-6 group">
                  <div className="relative z-10 shrink-0 w-14 h-14 rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center group-hover:border-red-500/50 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all duration-300">
                    <FileText size={24} className="text-white group-hover:text-red-500 transition-colors" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-white text-lg">Solicitação</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-400 border border-white/5 uppercase tracking-wider">
                        Teórico
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Checagem de informações iniciais.
                    </p>
                  </div>
                </div>
                <div className="relative flex gap-6 group">
                  <div className="relative z-10 shrink-0 w-14 h-14 rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center group-hover:border-red-500/50 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all duration-300">
                    <Brain size={24} className="text-white group-hover:text-red-500 transition-colors" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-white text-lg">Formulário</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-400 border border-white/5 uppercase tracking-wider">
                        Teórico
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Avaliação de conduta ética da organização.
                    </p>
                  </div>
                </div>
                <div className="relative flex gap-6 group">
                  <div className="relative z-10 shrink-0 w-14 h-14 rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center group-hover:border-red-500/50 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all duration-300">
                    <Users size={24} className="text-white group-hover:text-red-500 transition-colors" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-white text-lg">Entrevista</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-900/20 text-red-400 border border-red-900/30 uppercase tracking-wider">
                        In-Game
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Um encontro especial dentro do game.
                    </p>
                  </div>
                </div>
                <div className="relative flex gap-6 group">
                  <div className="relative z-10 shrink-0 w-14 h-14 rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center group-hover:border-red-500/50 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all duration-300">
                    <Swords size={24} className="text-white group-hover:text-red-500 transition-colors" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-white text-lg">Última Etapa</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-900/20 text-red-400 border border-red-900/30 uppercase tracking-wider">
                        In-Game
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      A etapa final para se tornar um de nós...
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-auto pt-8 border-t border-white/5">
               <p className="text-xs text-center text-neutral-500 italic tracking-widest font-serif">
                 Omertà: O silêncio é a nossa maior arma.
               </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}