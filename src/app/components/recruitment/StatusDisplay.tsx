'use client';

import { 
  CheckCircle,
  XCircle, 
  Clock, 
  Calendar,
  Sparkles,
  TimerReset, 
  Hourglass, 
  FileText,
  ClipboardCheck, 
  CalendarClock, 
  UserCheck, 
  Target,
  Crosshair,
  Skull,
  Bot,
  Shield,
  UserCog, 
  Server, 
  Ban,
  TriangleAlert, 
  ServerCrash, 
  Hammer, 
  Activity
} from 'lucide-react';
import Image from 'next/image';
import { FaGun } from "react-icons/fa6";

interface StatusData {
  scheduleDate?: string;
  [key: string]: unknown;
}

interface StatusDisplayProps {
  status: string;
  data: StatusData;
}

export default function StatusDisplay({ status, data }: StatusDisplayProps) {
  const renderStatusContent = () => {
    switch (status) {
      case 'PENDING_SOLICITATION':
        return (
          <div className="relative overflow-hidden bg-amber-900/10 backdrop-blur-xl border border-amber-500/10 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto w-full shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-linear-to-r from-transparent via-amber-500/50 to-transparent blur-lg" />
            <div className="absolute inset-0 bg-linear-to-b from-amber-500/5 via-transparent to-transparent opacity-50 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="relative">
                <div className="absolute -inset-3 border border-dashed border-amber-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="relative w-24 h-24 bg-linear-to-b from-amber-900/20 to-black rounded-full flex items-center justify-center border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                  <Clock size={48} className="text-amber-500 drop-shadow-md" strokeWidth={1.5} />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-b from-amber-200 to-amber-600 tracking-[0.2em] uppercase font-serif">
                    Sob Análise
                  </h2>
                  <p className="text-amber-500/40 text-xs font-mono mt-2 tracking-widest uppercase">
                    Protocolo Pendente
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4 opacity-30">
                  <div className="h-px w-12 bg-amber-500" />
                  <div className="h-1 w-1 rounded-full bg-amber-500" />
                  <div className="h-px w-12 bg-amber-500" />
                </div>
                <p className="text-neutral-400 max-w-md mx-auto leading-relaxed text-lg font-light">
                  Seu dossiê está na mesa da hierarquia. <br/>
                  <span className="text-amber-500/80">A paciência é a primeira virtude de um soldado.</span>
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-950/20 border border-amber-500/10 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs text-amber-500/80 uppercase tracking-widest font-semibold">Aguarde Atualizações</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'APPROVED_SOLICITATION':
        return (
          <div className="relative overflow-hidden bg-emerald-900/15 backdrop-blur-xl border border-emerald-500/10 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto w-full shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-linear-to-r from-transparent via-emerald-500/40 to-transparent blur-lg" />
            <div className="absolute inset-0 bg-linear-to-b from-emerald-900/10 via-transparent to-transparent opacity-30 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-emerald-600/30 blur-2xl rounded-full" />
                <div className="relative w-28 h-28 bg-linear-to-b from-emerald-950 to-black rounded-full flex items-center justify-center border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)] group">
                  <CheckCircle size={56} className="text-emerald-400 drop-shadow-[0_2px_10px_rgba(52,211,153,0.5)] transition-transform group-hover:scale-105 duration-300" strokeWidth={1.5} />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-b from-emerald-200 to-emerald-600 tracking-[0.2em] uppercase font-serif">
                    Aprovado
                  </h2>
                  <p className="text-emerald-500/60 text-xs font-mono mt-2 tracking-widest uppercase">
                    Etapa 1: Concluída
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4 opacity-30">
                  <div className="h-px w-16 bg-linear-to-r from-transparent to-emerald-500" />
                  <div className="rotate-45 border border-emerald-500 w-2 h-2" />
                  <div className="h-px w-16 bg-linear-to-l from-transparent to-emerald-500" />
                </div>
                <p className="text-neutral-300 max-w-md mx-auto leading-relaxed text-lg font-light">
                  Você deu o primeiro passo. A família está observando. <br/>
                  <span className="text-emerald-400/90 font-medium">Aguarde a liberação do formulário.</span>
                </p>
                <div className="mt-6 bg-black/40 border border-white/5 rounded-xl p-4 flex items-center gap-4 max-w-md mx-auto">
                  <div className="bg-emerald-900/30 p-2 rounded-lg text-emerald-400">
                    <TimerReset size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Próxima Etapa</p>
                    <p className="text-sm text-white font-semibold">Liberação do Formulário (Etapa 2)</p>
                    <p className="text-[10px] text-emerald-500/80 mt-1">Liberado no prazo máximo de 24 horas.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'SUBMITTED_FORM':
        return (
          <div className="relative overflow-hidden bg-purple-900/10 backdrop-blur-xl border border-violet-500/10 rounded-3xl p-8 md:p-12 text-center max-w-3xl w-full mx-auto shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-linear-to-r from-transparent via-violet-600/50 to-transparent blur-lg" />
            <div className="absolute inset-0 bg-linear-to-b from-violet-900/10 via-transparent to-transparent opacity-40 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="relative">
                <div className="relative w-28 h-28 bg-linear-to-br from-violet-950 to-black rounded-2xl rotate-3 flex items-center justify-center border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.15)] group">
                  <FileText size={52} className="text-violet-400 drop-shadow-md -rotate-3 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-violet-400 shadow-[0_0_15px_rgba(167,139,250,0.8)] animate-[scan_3s_ease-in-out_infinite]" />
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 bg-neutral-900 border border-violet-500/30 p-2 rounded-full shadow-lg">
                  <Hourglass size={18} className="text-violet-400 animate-spin-slow" /> 
                </div>
              </div>
              <div className="space-y-6 mt-2">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-b from-violet-200 to-violet-600 tracking-[0.2em] uppercase font-serif">
                    Sob Análise
                  </h2>
                  <p className="text-violet-400/50 text-xs font-mono mt-2 tracking-widest uppercase">
                    Aguardando julgamento do Conselho
                  </p>
                </div>
                <div className="w-full max-w-[120px] h-px bg-linear-to-r from-transparent via-violet-500/50 to-transparent mx-auto" />
                <p className="text-neutral-400 max-w-md mx-auto leading-relaxed text-lg font-light">
                  Suas respostas foram registradas no sistema. <br/>
                  <span className="text-violet-400/90">O conselho está avaliando seu perfil.</span>
                </p>
                <div className="mt-4 flex flex-col items-center gap-2">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
                    Status Atual
                  </p>
                  <div className="px-4 py-1.5 bg-violet-900/20 border border-violet-500/20 rounded text-xs text-violet-300 font-semibold flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                    </span>
                    Aguardando Veredito
                  </div>
                </div>
              </div>
            </div>
            <style jsx global>{`
              @keyframes scan {
                0%, 100% { top: 10%; opacity: 0; }
                50% { top: 90%; opacity: 1; }
              }
              .animate-spin-slow {
                animation: spin 4s linear infinite;
              }
            `}</style>
          </div>
        );

      case 'APPROVED_FORM':
        return (
          <div className="relative overflow-hidden bg-blue-900/10 backdrop-blur-xl border border-blue-500/10 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto w-full shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-linear-to-r from-transparent via-blue-500/60 to-transparent blur-lg" />
            <div className="absolute inset-0 bg-linear-to-b from-blue-900/10 via-transparent to-transparent opacity-40 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="relative mb-2">
                <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-full" />
                <div className="relative w-28 h-28 bg-linear-to-tr from-blue-950 to-black rounded-2xl flex items-center justify-center border border-blue-400/30 shadow-[0_0_25px_rgba(59,130,246,0.2)] group">
                  <ClipboardCheck size={52} className="text-blue-400 drop-shadow-md group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                  <div className="absolute top-0 right-0 p-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-b from-blue-200 to-blue-700 tracking-[0.2em] uppercase font-serif">
                    Fase Teórica
                  </h2>
                  <p className="text-blue-400 font-bold text-xl mt-1 tracking-widest uppercase glow-text">
                    CONCLUÍDA
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 opacity-50">
                  <div className="h-px w-10 bg-blue-500" />
                  <div className="text-[10px] text-blue-400 tracking-widest uppercase">Próximo Passo</div>
                  <div className="h-px w-10 bg-blue-500" />
                </div>
                <p className="text-neutral-300 max-w-md mx-auto leading-relaxed text-lg font-light">
                  Sua mente provou ser afiada. Agora, queremos conhecer seu caráter. <br/>
                  <span className="text-blue-300/80">Aguarde o agendamento da entrevista.</span>
                </p>
                <p className='text-xs text-neutral-400'>Prazo máximo de 24 horas.</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                    <div className="flex items-center gap-3 bg-blue-950/20 border border-blue-500/20 px-4 py-3 rounded-xl">
                      <div className="p-2 rounded-lg text-blue-400">
                        <CalendarClock size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-blue-100 font-semibold">Aguardando Agendamento</p>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'PENDING_INTERVIEW':
        return (
          <div className="bg-neutral-900/35 backdrop-blur-xl border border-gray-500/20 rounded-3xl overflow-hidden w-full max-w-5xl shadow-2xl">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-8 md:p-12">
                <div className="flex flex-col items-center text-center mb-10 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/10 rounded-full blur-[60px] pointer-events-none" />
                  <div className="relative mb-8 group">
                    <div className="absolute -inset-3 border border-dashed border-red-500/20 rounded-full animate-[spin_12s_linear_infinite]" />
                    <div className="relative w-24 h-24 bg-linear-to-b from-red-950 to-black rounded-full flex items-center justify-center border border-red-500/30 shadow-[0_0_25px_rgba(34,211,238,0.15)] backdrop-blur-md">
                      <Clock size={40} className="text-red-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" strokeWidth={1.5} />
                      <div className="absolute bottom-0 right-0 p-1 bg-black rounded-full border border-red-900">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-center gap-2 text-red-500/50 text-[10px] font-bold uppercase tracking-[0.4em]">
                      <span className="w-2 h-px bg-red-500/50" />
                      Etapa 3
                      <span className="w-2 h-px bg-red-500/50" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-b from-white via-red-100 to-red-600 tracking-wider uppercase font-serif drop-shadow-sm">
                      Entrevista Agendada
                    </h2>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-6 opacity-80">
                    <div className="h-px w-16 bg-linear-to-r from-transparent to-red-500/50" />
                    <div className="w-2 h-2 rotate-45 border border-red-400 bg-red-950 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    <div className="h-px w-16 bg-linear-to-l from-transparent to-red-500/50" />
                  </div>
                </div>
                <div className="space-y-4 text-red-100/80 text-sm md:text-base leading-relaxed font-light border-l-2 border-red-500/20 pl-6 text-left">
                  <p>
                    <strong className="text-red-400">Você avançou.</strong> E isso não passou despercebido.
                  </p>
                  <p>
                    Antes mesmo de ser indicado, cada passo, cada atitude e cada conversa já vinham sendo observados.
                    Nada foi por acaso. Nada foi ignorado. 
                    A partir de agora, o peso dessa observação aumenta — e não diminui.
                  </p>
                  <p>
                    Amanhã, a qualquer momento, o seu telefone irá tocar. Do outro lado, um desconhecido irá informar um local
                    e um horário, e em seguida a ligação será encerrada. <span className="text-gray-300 font-semibold">Compareça ao local indicado no mesmo instante e aguarde.</span>
                  </p>
                  <p>
                    Um veículo preto com 3 individuos dentro irá encostar, o vidro irá abaixar e uma única pergunta será feita. 
                    <span className="text-gray-300 font-semibold"> Sua resposta deve ser exatamente o código informado no card acima da imagem.</span>
                  </p>
                  <p>
                    Se o veículo destrancar, entre no banco traseiro, lado direito, e permaneça em silêncio. Não faça perguntas e nem
                    olhe para trás.
                  </p>
                  <p className="text-xs text-red-500 italic mt-4">
                    Na nossa família, nada começa no convite — tudo começa na vigilância.
                  </p>
                </div>
              </div>
              <div className="w-full md:w-[350px] bg-black/20 border-l border-gray-500/10 p-4 flex flex-col justify-center">
                <div className="mt-2 mb-6 bg-neutral-950/20 border border-gray-500/20 rounded-xl p-4 flex flex-col gap-3">
                  <div>
                    <span className="text-[10px] text-red-500/50 uppercase tracking-widest font-bold block mb-1">
                      Pergunta
                    </span>
                    <p className="text-neutral-400 text-sm">
                      Qual movimento de xadrez?
                    </p>
                  </div>
                  <div className="h-px w-full bg-gray-500/20" />
                  <div>
                    <span className="text-[10px] text-red-500/50 uppercase tracking-widest font-bold block mb-1">
                      Código
                    </span>
                    <p className="text-red-400 font-serif text-xl font-bold tracking-wide">
                      Defesa Siciliana
                    </p>
                  </div>
                </div>
                <div className="relative h-full max-h-[600px] w-full rounded-2xl overflow-hidden border border-gray-500/20 shadow-lg group">
                  <Image 
                    src="https://i.imgur.com/zjo4P1d.png" 
                    alt="Carro Preto na Neblina" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                    width={1024}
                    height={1536}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#000000]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="text-xs text-gray-300 font-bold mb-1">Eu vi. Um carro preto parou, um homem entrou e o carro saiu. Nunca mais tive notícias dele.</div>
                    <div className="text-gray-400 text-xs leading-none">Morador de Legacy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'APPROVED_INTERVIEW':
        return (
          <div className="relative overflow-hidden bg-green-900/10 backdrop-blur-xl border border-teal-500/10 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto w-full shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-linear-to-r from-transparent via-teal-500/60 to-transparent blur-lg" />
            <div className="absolute inset-0 bg-linear-to-b from-teal-900/10 via-transparent to-transparent opacity-40 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-teal-600/20 blur-2xl rounded-full" />
                <div className="relative w-28 h-28 bg-linear-to-tr from-teal-950 to-black rounded-full flex items-center justify-center border border-teal-400/30 shadow-[0_0_25px_rgba(45,212,191,0.2)] group">
                  <UserCheck size={52} className="text-teal-400 drop-shadow-md group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                  
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-b from-teal-200 to-teal-700 tracking-[0.2em] uppercase font-serif">
                    Entrevista Aprovada
                  </h2>
                  <p className="text-teal-500/60 text-xs font-mono mt-2 tracking-widest uppercase">
                    Etapa 3: Concluída
                  </p>
                </div>
                <div className="w-16 h-0.5 bg-linear-to-r from-transparent via-teal-500/50 to-transparent mx-auto" />
                <p className="text-neutral-300 max-w-md mx-auto leading-relaxed text-lg font-light">
                  Sua postura e suas palavras convenceram a hierarquia. <br/>
                  <span className="text-teal-400 font-medium">Mas palavras não ganham guerras.</span>
                </p>
                <div className="mt-4 bg-teal-950/20 border border-teal-500/20 rounded-xl p-4 flex items-center gap-4 max-w-md mx-auto text-left transition-colors hover:bg-teal-950/30">
                  <div className="bg-teal-500/10 p-3 rounded-lg border border-teal-500/20 text-teal-400">
                    <Target size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-teal-500/70 uppercase font-bold tracking-wider">Próxima Etapa</span>
                        <Hourglass size={12} className="text-teal-500/50 animate-spin-slow" />
                    </div>
                    <p className="text-white font-serif text-sm tracking-wide">Etapa Final</p>
                    <p className="text-xs text-neutral-400 mt-0.5">Aguarde a definição da data.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'PENDING_PRACTICAL':
        return (
          <div className="bg-linear-to-br from-orange-500/10 via-orange-600/5 to-orange-700/10 backdrop-blur-xl border border-orange-500/20 rounded-3xl overflow-hidden w-full max-w-5xl shadow-2xl">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-8 md:p-12">
                <div className="flex flex-col items-center text-center mb-10 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-500/10 rounded-full blur-[60px] pointer-events-none" />
                  <div className="relative mb-6 group">
                      <div className="absolute -inset-3 border border-dashed border-orange-500/20 rounded-full animate-[spin_15s_linear_infinite]" />
                      <div className="relative w-24 h-24 bg-linear-to-b from-orange-950 to-black rounded-full flex items-center justify-center border border-orange-500/30 shadow-[0_0_25px_rgba(249,115,22,0.15)]">
                        <Crosshair size={40} className="text-orange-500 drop-shadow-md" strokeWidth={1.5} />
                      </div>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-b from-orange-100 to-orange-600 tracking-wider uppercase font-serif">
                    Etapa Final
                  </h2>
                  <div className="flex items-center justify-center gap-4 mt-4 opacity-60">
                      <div className="h-px w-12 bg-orange-500" />
                      <span className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Últimos Passos</span>
                      <div className="h-px w-12 bg-orange-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-neutral-950/60 border border-orange-500/20 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-50 transition-opacity">
                      <Calendar size={40} className="text-orange-500" />
                    </div>
                    <span className="text-xs text-orange-400/60 uppercase font-bold tracking-wider mb-1">Horário de Início</span>
                    {data?.scheduleDate ? (
                      <>
                        <span className="text-white font-serif text-2xl font-bold">
                          {new Date(data.scheduleDate).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-sm text-neutral-400 uppercase">
                          {new Date(data.scheduleDate).toLocaleString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                        </span>
                        <p className="text-xs text-neutral-200 mt-6">Entre com 30 minutos de antecedência</p>
                      </>
                    ) : (
                      <span className="text-neutral-500 text-sm">Aguardando comando...</span>
                    )}
                  </div>
                  <div className="relative h-24 md:h-auto bg-neutral-950/60 border border-orange-500/20 rounded-xl overflow-hidden group cursor-default">
                    <div className="p-4 text-white text-xs">
                      <div className="font-bold text-orange-400 mb-2">Terno:</div>
                      <ul className="space-y-1">
                        <li>Camisa 13 - Número 24</li>
                        <li>Jaqueta 2 - Número 9</li>
                        <li>Calça 3 - Número 9</li>
                        <li>Sapato 8 - Número 1</li>
                        <li>Máscara 1</li>
                        <li>Mochila 1</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 text-left border-l-2 border-orange-500/30 pl-6 py-2">
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    Chegou a hora da verdade. Você está na etapa final para se tornar um de nós!
                  </p>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    A partir do horário informado acima, você deve estar disponível in-game para a realização da etapa final. 
                    Lembre-se de entrar com 30 minutos de antecedência, ir a loja de roupas, comprar e vestir exatamente as 
                    peças do terno informadas no card ao lado da data. Após isso, aguarde uma ligação.
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-orange-500 text-xs font-bold uppercase tracking-widest">
                    Siga todas as instruções corretamente, sem perguntas!
                  </div>
                </div>
              </div>
              <div className="w-full md:w-[320px] bg-black/40 border-l border-orange-500/10 relative group overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=2070&auto=format&fit=crop"
                  alt="Operador Tático"
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-all duration-700 scale-105 group-hover:scale-100"
                  width={1920}
                  height={1080}
                />
                <div className="absolute inset-0 bg-linear-to-t from-orange-950/90 via-transparent to-black/50" />
                <div className="absolute bottom-8 left-8 right-8 text-center">
                  <Skull size={48} className="text-orange-500/50 mx-auto mb-4" />
                  <div className="text-white font-serif text-2xl tracking-wide uppercase">Kill or Die</div>
                  <p className="text-orange-400/60 text-xs mt-2 uppercase tracking-[0.2em]">Etapa Final</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'APPROVED_PRACTICAL':
        return (
          <div className="bg-linear-to-br from-emerald-500/10 via-emerald-600/5 to-emerald-700/10 backdrop-blur-xl border border-emerald-500/20 rounded-3xl overflow-hidden w-full max-w-5xl shadow-2xl relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-8 md:p-12 relative z-10">
                <div className="flex flex-col items-center text-center mb-10 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />
                  <div className="relative mb-6 group">
                      <div className="absolute -inset-3 border border-dashed border-emerald-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
                      <div className="relative w-24 h-24 bg-linear-to-b from-emerald-950 to-black rounded-full flex items-center justify-center border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <CheckCircle size={40} className="text-emerald-400 drop-shadow-md" strokeWidth={1.5} />
                        <Sparkles size={20} className="absolute top-2 right-3 text-emerald-200 animate-pulse" />
                      </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-b from-emerald-100 to-emerald-600 tracking-wider uppercase font-serif">
                      Aprovado
                    </h2>
                    <p className="text-emerald-500/60 text-xs font-bold uppercase tracking-[0.3em]">
                      Recrutamento Concluído
                    </p>
                  </div>
                </div>
                <div className="space-y-6 text-center md:text-left border-t border-emerald-500/10 pt-8">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                    <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                      <FaGun size={20} className="text-emerald-400 rotate-340" />
                    </div>
                    <span className="text-emerald-400 font-bold text-xl">Siete i Benvenuti</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed font-light">
                    Parabéns. Você provou seu valor, sua lealdade e sua capacidade. 
                    Todas as barreiras foram removidas.
                  </p>
                  <p className="text-neutral-300 leading-relaxed font-light">
                    A partir de agora, você tem acesso total às ferramentas da organização. 
                    Bem-vindo à <span className="text-white font-medium">Máfia Trindade Penumbra</span>.
                  </p>
                </div>
              </div>

              <div className="w-full md:w-[380px] bg-black/40 border-l border-emerald-500/10 p-8 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-emerald-950/20 to-black/80" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-emerald-900/30 p-2.5 rounded-xl border border-emerald-500/20">
                      <Bot size={24} className="text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white text-start font-bold text-sm uppercase tracking-wider">Próximas Etapas</h3>
                      <p className="text-xs text-gray-400 font-semibold">Não se preocupe, elas são automatizadas!</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-center p-3 rounded-lg bg-emerald-950/10 border border-emerald-500/10">
                      <div className="bg-emerald-500/5 p-2 rounded-full">
                        <Server size={16} className="text-emerald-400/80" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-emerald-100 font-medium">Acesso ao Servidor</p>
                        <p className="text-xs text-emerald-500/80 font-semibold">Você será adicionado automaticamente.</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="flex gap-4 items-center p-3 rounded-lg bg-emerald-950/10 border border-emerald-500/10">
                      <div className="bg-emerald-500/5 p-2 rounded-full">
                        <Shield size={16} className="text-emerald-400/80" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-emerald-100 font-medium">Setagem de Cargos</p>
                        <p className="text-xs text-emerald-500/80 font-semibold">Feita após você ser adicionado.</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                    </div>
                    <div className="flex gap-4 items-center p-3 rounded-lg bg-emerald-950/10 border border-emerald-500/10">
                      <div className="bg-emerald-500/5 p-2 rounded-full">
                        <UserCog size={16} className="text-emerald-400/80" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-emerald-100 font-medium">Alteração de Apelido</p>
                        <p className="text-xs text-emerald-500/80 font-semibold">Feita depois da setagem de cargos.</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-emerald-500/10 text-center">
                    <p className="text-sm text-neutral-400 font-semibold">
                      Não é necessário realizar nenhuma ação.
                      <br />
                      <span className="text-emerald-400 font-medium text-xs">Apenas aguarde, o processo é automático.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'REJECTED_SOLICITATION':
      case 'REJECTED_FORM':
      case 'REJECTED_INTERVIEW':
      case 'REJECTED_PRACTICAL':
        return (
          <div className="relative overflow-hidden bg-red-900/10 backdrop-blur-xl border border-red-900/30 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto w-full shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-linear-to-r from-transparent via-red-600/50 to-transparent blur-lg" />
            <div className="absolute inset-0 bg-linear-to-b from-red-950/20 via-transparent to-transparent opacity-60 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-8">
              <div className="relative">
                <div className="absolute inset-0 bg-red-600/10 blur-2xl rounded-full animate-pulse" />
                <div className="relative w-28 h-28 bg-linear-to-b from-red-950 to-black rounded-full flex items-center justify-center border border-red-500/20 shadow-[0_0_30px_rgba(220,38,38,0.15)] group">
                  <XCircle size={56} className="text-red-500 drop-shadow-[0_2px_10px_rgba(220,38,38,0.4)] group-hover:scale-105 transition-transform duration-300" strokeWidth={1.5} />
                  <div className="absolute -bottom-2 -right-2 bg-black border border-red-900/50 p-2 rounded-full shadow-lg">
                    <Ban size={20} className="text-red-600" />
                  </div>
                </div>
              </div>
              <div className="space-y-6 w-full">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-b from-red-200 to-red-800 tracking-[0.2em] uppercase font-serif">
                    Reprovado
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="h-px w-8 bg-red-900/50" />
                    <p className="text-red-500/50 text-[10px] font-mono tracking-widest uppercase">
                      Processo Encerrado
                    </p>
                    <div className="h-px w-8 bg-red-900/50" />
                  </div>
                </div>
                <p className="text-neutral-400 max-w-md mx-auto leading-relaxed text-lg font-light">
                  Infelizmente seu perfil não atendeu aos critérios da organização neste momento. <br/>
                  <span className="text-red-400/80 font-medium">Não encare como um fim, mas como uma pausa.</span>
                </p>
                <div className="mt-6 bg-red-950/10 border border-red-900/20 rounded-xl p-5 flex flex-col gap-3 max-w-md mx-auto relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-900/50" />
                  <div className="flex items-start gap-3 text-left">
                    <Clock size={20} className="text-red-500/60 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-red-100 font-semibold mb-1">Ciclo de Espera</p>
                      <p className="text-xs text-red-200/50 leading-relaxed">
                        Use este tempo para estudar as regras da cidade e melhorar seu RP. 
                        Você poderá tentar novamente no próximo ciclo de recrutamento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="relative overflow-hidden bg-[#0a0a0a] backdrop-blur-3xl border border-neutral-800 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto w-full shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-800/20 via-black to-black opacity-50" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent blur-sm" />
            <div className="relative z-10 flex flex-col items-center gap-8">
              <div className="relative mb-2">
                <div className="absolute inset-0 bg-neutral-500/10 blur-3xl rounded-full" />
                <div className="relative w-28 h-28 bg-neutral-900/80 rounded-2xl rotate-45 flex items-center justify-center border border-neutral-700 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                  <div className="-rotate-45 relative">
                    <TriangleAlert size={56} className="text-neutral-400 drop-shadow-lg" strokeWidth={1.5} />
                    <div className="absolute -bottom-2 -right-3 bg-black border border-neutral-800 p-1.5 rounded-lg">
                        <ServerCrash size={18} className="text-red-500/80" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-b from-white via-neutral-400 to-neutral-700 tracking-[0.2em] uppercase font-serif">
                    Erro de Sistema
                  </h2>
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                    <p className="text-neutral-500 font-mono text-xs tracking-widest uppercase">
                      Código: STATUS_UNKNOWN
                    </p>
                  </div>
                </div>
                <div className="w-full max-w-[200px] mx-auto h-px bg-linear-to-r from-transparent via-neutral-700 to-transparent my-2" />
                <p className="text-neutral-400 max-w-md mx-auto leading-relaxed text-lg font-light">
                  Houve uma interferência na comunicação com o servidor. <br />
                  <span className="text-neutral-200">Não se preocupe, nossos dados estão seguros.</span>
                </p>
                <div className="mt-6 bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-4 max-w-md mx-auto relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 h-0.5 bg-neutral-700 w-full animate-pulse" />
                  <div className="bg-neutral-800 p-3 rounded-lg text-neutral-300">
                    <Hammer size={20} className="animate-bounce" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-0.5">Equipe Técnica</p>
                    <p className="text-sm text-neutral-300 font-medium">Manutenção em andamento</p>
                    <p className="text-[10px] text-neutral-600 mt-1 flex items-center gap-1">
                      <Activity size={10} /> Tentando reconexão automática...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderStatusContent();
}