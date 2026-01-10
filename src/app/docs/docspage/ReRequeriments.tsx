import { IoIosArrowForward } from "react-icons/io";
import { Mic, Clock, BookOpen, UserCheck, ShieldAlert } from 'lucide-react';
import { FaCheckCircle, FaThumbsUp } from "react-icons/fa";

export default function RecruitmentRequirementsPage() {
  return (
    <section className="relative rounded-2xl min-h-screen bg-neutral-950 text-gray-300 font-sans selection:bg-red-900 selection:text-white overflow-hidden flex flex-col">
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20 md:px-12 w-full">

        <div className="items-center gap-2 text-xs text-red-500 font-medium mb-6 bg-[#0a0a0a]/50 inline-flex px-3 py-1 rounded-full border border-red-500/20">
          <span>Docs</span>
          <span><IoIosArrowForward /></span>
          <span>Recrutamento</span>
          <span><IoIosArrowForward /></span>
          <span className="text-gray-400">Requisitos</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 mt-6">
          Requisitos - 2026
        </h1>
        <p className="mb-12 text-lg text-gray-400">
          Antes de iniciar o processo seletivo para a <span className="text-red-500 font-semibold">Trindade Penumbra</span>, 
          certifique-se de atender a todos os critérios listados abaixo. O não cumprimento resultará em reprovação imediata.
        </p>

        <hr className='bg-gray-600/40 border-0 h-px mb-12' />

        <h2 className="text-3xl font-bold text-white mb-8">
          Essenciais
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 hover:border-red-500/30 transition-colors group">
            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 text-red-500 group-hover:bg-red-500/10 transition-colors">
              <UserCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Idade Mínima</h3>
            <p className="text-gray-400 text-sm">
              É necessário ter no mínimo <span className="text-white font-semibold">16 anos</span> (OOC) para fazer parte da organização. Maturidade é indispensável.
            </p>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 hover:border-red-500/30 transition-colors group">
            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 text-red-500 group-hover:bg-red-500/10 transition-colors">
              <Mic size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Comunicação</h3>
            <p className="text-gray-400 text-sm">
              Possuir um <span className="text-white font-semibold">microfone de boa qualidade</span>, sem ruídos excessivos, e estar presente no Discord sempre que estiver online.
            </p>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 hover:border-red-500/30 transition-colors group">
            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 text-red-500 group-hover:bg-red-500/10 transition-colors">
              <Clock size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Disponibilidade</h3>
            <p className="text-gray-400 text-sm">
              Ter disponibilidade para cumprir a carga horária mínima da organização e participar de ações obrigatórias.
            </p>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 hover:border-red-500/30 transition-colors group">
            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 text-red-500 group-hover:bg-red-500/10 transition-colors">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Conhecimento das Regras</h3>
            <p className="text-gray-400 text-sm">
              Dominar as regras do servidor (Legacy Roleplay) e as regras internas da ilegalidade.
            </p>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 hover:border-red-500/30 transition-colors group">
            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 text-red-500 group-hover:bg-red-500/10 transition-colors">
              <FaThumbsUp size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Respeito</h3>
            <p className="text-gray-400 text-sm">
              Tratar todos os membros com respeito, independentemente do cargo ou função. Assédio e discriminação não serão tolerados.
            </p>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 hover:border-red-500/30 transition-colors group">
            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 text-red-500 group-hover:bg-red-500/10 transition-colors">
              <FaCheckCircle size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Obediência</h3>
            <p className="text-gray-400 text-sm">
              Seguir as ordens dos superiores e respeitar a hierarquia interna da organização é fundamental para o bom funcionamento da Trindade Penumbra.
            </p>
          </div>
        </div>

        <hr className='bg-gray-600/40 border-0 h-px mb-12' />

        <h2 className="text-3xl font-bold text-white mb-6">
          Critérios In-Game
        </h2>
        <p className="mb-6 text-gray-400">
          Além dos requisitos pessoais, seu personagem deve cumprir as seguintes condições:
        </p>

        <div className="bg-zinc-900 rounded-lg p-6 border-l-4 border-red-600 mb-12">
            <ul className="space-y-4">
                <li className="flex items-start gap-3">
                    <div className="min-w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5"></div>
                    <span>Não possuir histórico recente de advertências graves ou banimentos no servidor.</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="min-w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5"></div>
                    <span>Não ter vínculo ativo com nenhuma outra organização criminosa ou legal (Polícia/Médico).</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="min-w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5"></div>
                    <span>Estar disposto a passar por um período de experiência (recruta) sob avaliação constante.</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="min-w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5"></div>
                    <span>Estar sempre em silêncio, longe de farras e presente nas reuniões da família.</span>
                </li>
            </ul>
        </div>

        <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-xl flex gap-4 mb-12">
           <ShieldAlert className="text-red-500 min-w-6" size={24} />
           <div>
             <h3 className="text-white font-bold mb-1">Blacklist e Punições</h3>
             <p className="text-sm text-red-200/70">
                Mentir sobre qualquer informação durante o processo de recrutamento (idade, histórico, etc.) resultará em 
                <span className="text-white font-semibold"> Blacklist permanente</span> da Trindade Penumbra. Seja honesto.
             </p>
           </div>
        </div>

        <hr className='bg-gray-600/40 border-0 h-px mb-12' />

        <div className="mt-4 p-8 rounded-2xl bg-linear-to-r from-green-900/10 to-transparent border border-white/5">
          <p className="text-sm text-green-400">
            Os requisitos para recrutamento podem ser alterados a qualquer momento. Última atualização: 06/01/2026.
          </p>
        </div>

      </div>
    </section>
  );
}