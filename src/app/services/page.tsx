'use client';

import React from 'react';
import { 
  Truck, 
  Briefcase, 
  Crosshair, 
  Skull, 
  Lock,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function ServicesPage() {

  const services = [
    {
      title: "Logística",
      sub: "Transporte de Risco",
      desc: "Transporte de cargas valiosas através de rotas seguras. Exige pilotagem de alta performance.",
      icon: Truck,
      status: "Indisponível"
    },
    {
      title: "Financeiro",
      sub: "Lavagem de Capital",
      desc: "Limpeza de dinheiro sujo através de comércios de fachada. Exige discrição total.",
      icon: Briefcase,
      status: "Indisponível"
    },
    {
      title: "Bélico",
      sub: "Tráfico de Munições",
      desc: "Controle de estoque e fornecimento de equipamento para aliados aprovados.",
      icon: Crosshair,
      status: "Em Estoque"
    },
    {
      title: "Operacional",
      sub: "Cobrança & Execução",
      desc: "Resolução definitiva de problemas. Apenas para alvos marcados pela liderança.",
      icon: Skull,
      status: "Indisponível"
    }
  ];

  return (
    <main className="min-h-screen w-full text-gray-200 p-6 md:p-12 font-sans flex flex-col items-center">
      
      <div className="max-w-5xl w-full">
        
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-neutral-600/30 pb-6 mb-20 mt-16 gap-6">
          <div className="space-y-2">
            <h4 className="text-red-600 font-bold text-xs tracking-[0.2em] uppercase">
              Trindade Penumbra
            </h4>
            <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter">
              Serviços <span className="text-red-600">Ilegais</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-red-950/10 border border-red-900/30 rounded backdrop-blur-md">
            <AlertTriangle size={18} className="text-red-600" />
            <div className="text-xs">
              <p className="text-red-500 font-bold uppercase">Status Operacional</p>
              <p className="text-red-400/60">Paralisado temporariamente</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className="group relative bg-[#0a0a0a] border border-zinc-900 p-6 hover:bg-[#0f0f0f] transition-all duration-300"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-800 group-hover:bg-red-600 transition-colors duration-300" />
              
              <div className="flex justify-between items-start mb-6 pl-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black border border-zinc-800 rounded group-hover:border-red-900/50 transition-colors">
                    <service.icon size={22} className="text-zinc-500 group-hover:text-red-500 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-0.5">
                      {service.title}
                    </h3>
                    <h2 className="text-lg font-bold text-white uppercase">
                      {service.sub}
                    </h2>
                  </div>
                </div>
              </div>
              
              <p className="text-zinc-500 text-sm leading-relaxed pl-2 mb-4 border-b border-zinc-900 pb-4 group-hover:border-zinc-800 transition-colors">
                {service.desc}
              </p>

              <div className="flex justify-between items-center pl-2">
                <span className="text-[10px] font-mono text-zinc-600 uppercase">
                  Classificação: <span className="text-zinc-400">Restrita</span>
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded bg-black border ${
                  service.status === "Em Estoque" ? "border-green-900/30 text-green-600" :
                  service.status === "Sob Demanda" ? "border-red-900/30 text-red-600" :
                  "border-zinc-800 text-zinc-500"
                }`}>
                  {service.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <hr className="border-zinc-900 mb-8" />

        <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 mb-30">
          <div className="flex gap-4 bg-red-950/10 p-6 border border-red-900/30 rounded-md backdrop-blur-md">
            <div className="mt-1">
              <Lock className="text-red-600" size={20} />
            </div>
            <div>
              <h4 className="text-white font-bold uppercase text-sm mb-1">Grupo de Elite</h4>
              <p className="text-zinc-500 text-xs leading-relaxed max-w-sm">
                Estes serviços não são abertos a todos. Apenas membros de extrema confiança e competência (Tier 1) terão acesso às operações.
              </p>
            </div>
          </div>

          <div className="flex gap-4 bg-neutral-900/20 p-6 border border-neutral-700/30 rounded-md backdrop-blur-md">
            <div className="mt-1">
              <Clock className="text-zinc-600" size={20} />
            </div>
            <div>
              <h4 className="text-zinc-300 font-bold uppercase text-sm mb-1">Previsão de Início</h4>
              <p className="text-zinc-500 text-xs leading-relaxed max-w-sm">
                As operações iniciarão assim que a estabilidade econômica da cidade permitir o fluxo seguro de capital e mercadorias.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}