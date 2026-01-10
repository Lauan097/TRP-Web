'use client';

import { 
  ClipboardList, 
  FileQuestion, 
  MessageCircle,
  Check, 
  X,
  Clock,
  Lock,
  Skull
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecruitmentStepperProps {
  currentStatus: string;
}

export default function RecruitmentStepper({ currentStatus }: RecruitmentStepperProps) {
  
  const getStepInfo = (stepId: number) => {
    // Step 1: Solicitação
    if (stepId === 1) {
      if (currentStatus === 'PENDING_SOLICITATION') return { state: 'current', label: 'Em Análise' };
      if (currentStatus.includes('REJECTED_SOLICITATION')) return { state: 'rejected', label: 'Reprovado' };
      return { state: 'completed', label: 'Aprovada' };
    }

    // Step 2: Formulário
    if (stepId === 2) {
      if (currentStatus === 'PENDING_SOLICITATION' || currentStatus.includes('REJECTED_SOLICITATION')) return { state: 'waiting' };
      if (currentStatus === 'APPROVED_SOLICITATION') return { state: 'pending_release', label: 'Aguardando Liberação' };
      if (currentStatus === 'PENDING_FORM') return { state: 'current', label: 'Pendente' };
      if (currentStatus === 'SUBMITTED_FORM') return { state: 'current', label: 'Em Análise' };
      if (currentStatus.includes('REJECTED_FORM')) return { state: 'rejected', label: 'Reprovado' };
      return { state: 'completed', label: 'Aprovado' };
    }

    // Step 3: Entrevista
    if (stepId === 3) {
      const previousSteps = ['PENDING_SOLICITATION', 'APPROVED_SOLICITATION', 'REJECTED_SOLICITATION', 'PENDING_FORM', 'SUBMITTED_FORM', 'REJECTED_FORM'];
      if (previousSteps.includes(currentStatus)) return { state: 'waiting' };
      
      if (currentStatus === 'APPROVED_FORM') return { state: 'pending_release', label: 'Aguardando Agendamento' };
      if (currentStatus === 'PENDING_INTERVIEW') return { state: 'current', label: 'Agendado' };
      if (currentStatus.includes('REJECTED_INTERVIEW')) return { state: 'rejected', label: 'Reprovado' };
      return { state: 'completed', label: 'Concluído' };
    }

    // Step 4: Teste Prático
    if (stepId === 4) {
      const previousSteps = [
        'PENDING_SOLICITATION', 'APPROVED_SOLICITATION', 'REJECTED_SOLICITATION', 
        'PENDING_FORM', 'SUBMITTED_FORM', 'APPROVED_FORM', 'REJECTED_FORM',
        'PENDING_INTERVIEW', 'REJECTED_INTERVIEW'
      ];
      if (previousSteps.includes(currentStatus)) return { state: 'waiting' };

      if (currentStatus === 'APPROVED_INTERVIEW') return { state: 'pending_release', label: 'Aguardando Agendamento' };
      if (currentStatus === 'PENDING_PRACTICAL') return { state: 'current', label: 'Agendado' };
      if (currentStatus.includes('REJECTED_PRACTICAL')) return { state: 'rejected', label: 'Reprovado' };
      if (currentStatus === 'APPROVED_PRACTICAL') return { state: 'completed', label: 'Aprovado' };
      return { state: 'waiting' };
    }

    return { state: 'waiting' };
  };

  const steps = [
    { id: 1, label: 'Solicitação', icon: ClipboardList },
    { id: 2, label: 'Formulário', icon: FileQuestion },
    { id: 3, label: 'Entrevista', icon: MessageCircle },
    { id: 4, label: 'Etapa Final', icon: Skull },
  ];

  return (
    // Removido mt-2 para colar no topo. Adicionado w-full.
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 rounded-2xl bg-[#0f0f0f]/60 backdrop-blur-xl border border-white/5 shadow-2xl mb-16">
      
      <div className="flex items-start w-full relative">
        
        {steps.map((step, index) => {
          const { state, label } = getStepInfo(step.id);
          const isLast = index === steps.length - 1;
          const isLineActive = state === 'completed';
          
          const styles = {
            completed: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]",
            current: "border-amber-500 bg-amber-500/10 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] ring-2 ring-amber-500/20",
            rejected: "border-red-500/50 bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]",
            pending_release: "border-blue-400/30 bg-blue-500/10 text-blue-300",
            waiting: "border-white/5 bg-white/[0.02] text-white/20"
          };

          const activeStyle = styles[state as keyof typeof styles] || styles.waiting;

          return (
            <div key={step.id} className="flex-1 flex flex-col items-center relative group">
              
              {/* BARRA DE CONEXÃO (CORRIGIDA) */}
              {/* A mágica está aqui: left-[calc(50%+30px)] e w-[calc(100%-60px)] */}
              {/* O círculo tem ~56px (w-14). Metade é 28px. Coloquei 30px para dar 2px de folga e não tocar no círculo. */}
              {!isLast && (
                <div className="absolute top-7 left-[calc(50%+30px)] w-[calc(100%-60px)] h-[3px] -z-10 bg-white/5 rounded-full">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-700 ease-out origin-left",
                      isLineActive 
                        ? "w-full bg-linear-to-r from-emerald-500 to-emerald-900/50 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                        : "w-0"
                    )} 
                  />
                </div>
              )}

              {/* CÍRCULO DO ÍCONE */}
              <div className={cn(
                "relative w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-500 z-10 backdrop-blur-md bg-black/20", 
                activeStyle,
                state === 'current' && "scale-110 -translate-y-1"
              )}>
                
                {state === 'completed' ? <Check size={24} className="animate-in zoom-in duration-300" /> :
                 state === 'rejected' ? <X size={24} className="animate-in zoom-in duration-300" /> :
                 state === 'current' ? <step.icon size={24} className="animate-pulse" /> :
                 state === 'pending_release' ? <Clock size={22} className="opacity-80" /> :
                 state === 'waiting' ? <Lock size={18} className="opacity-40" /> :
                 <step.icon size={22} />}

                {/* Efeito Ping */}
                {state === 'current' && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-20 animate-ping duration-1000" />
                )}
              </div>

              {/* TEXTOS */}
              <div className="mt-4 flex flex-col items-center text-center space-y-1 min-h-[50px]">
                <span className={cn(
                  "text-xs md:text-sm font-bold uppercase tracking-wider transition-colors duration-300",
                  state === 'completed' ? "text-emerald-400" :
                  state === 'current' ? "text-amber-400" :
                  state === 'rejected' ? "text-red-500" :
                  state === 'pending_release' ? "text-blue-300" :
                  "text-zinc-600"
                )}>
                  {step.label}
                </span>
                
                <div className={cn(
                  "text-[10px] md:text-[11px] font-medium px-2 py-0.5 rounded-full border transition-all duration-300",
                  state === 'completed' ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300/70" :
                  state === 'current' ? "border-amber-500/20 bg-amber-500/10 text-amber-200" :
                  state === 'rejected' ? "border-red-500/20 bg-red-500/10 text-red-400" :
                  state === 'pending_release' ? "border-blue-500/20 bg-blue-500/10 text-blue-300" :
                  "border-transparent text-transparent select-none"
                )}>
                  {label || "-"}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}