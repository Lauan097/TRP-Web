"use client";

import { 
  AlertCircle, 
  ShieldAlert, 
  XOctagon, 
  Skull,
  FileWarning,
  CheckCircle2
} from 'lucide-react';

export default function RulesPage() {

  const categories = [
    {
      id: 'adv-verbal',
      title: 'I — ADVERTÊNCIA VERBAL',
      subtitle: 'Falhas leves, Primeiro sinal.',
      description: 'O aviso antes da cobrança.',
      icon: AlertCircle,
      color: 'text-gray-200',
      border: 'border-l-gray-500',
      rules: [
        { title: '1.1', desc: 'É proibido falar assuntos desnecessários no rádio.' },
        { title: '1.2', desc: 'Veículos da família devem permanecer sempre com o tanque cheio.' },
        { title: '1.3', desc: 'Evitar circular sozinho utilizando a roupa da família sem necessidade.' },
        { title: '1.4', desc: 'Sempre que estiver em jogo, entrar na call in-game para controle interno.' },
      ]
    },
    {
      id: 'adv-nv1',
      title: 'II — ADVERTÊNCIA NÍVEL 1',
      subtitle: 'Mancha na disciplina.',
      description: 'Condutas que começam a manchar a disciplina da família.',
      icon: FileWarning,
      color: 'text-red-300',
      border: 'border-l-red-800',
      rules: [
        { title: '2.1', desc: 'É obrigatório o uso do rádio sempre que estiver na cidade.' },
        { title: '2.2', desc: 'É terminantemente proibido ofender qualquer membro da família.' },
        { title: '2.3', desc: 'Ajudar membros da família não é favor — é obrigação.' }, 
        { title: '2.4', desc: 'Cada membro deve cumprir rigorosamente as funções do seu cargo.' },
        { title: '2.5', desc: 'Reuniões são obrigatórias. Ausência será cobrada.' },
        { title: '2.6', desc: 'O uso da roupa da família é obrigatório quando exigido pela liderança.' },
        { title: '2.7', desc: 'A imagem da família é sagrada e deve ser preservada a qualquer custo.' }
      ]
    },
    {
      id: 'adv-nv2',
      title: 'III — ADVERTÊNCIA NÍVEL 2',
      subtitle: 'Quebra de hierarquia.',
      description: 'Quebra de hierarquia, postura ou confiança.',
      icon: ShieldAlert,
      color: 'text-red-500',
      border: 'border-l-red-600',
      rules: [
        { title: '3.1', desc: 'Nunca pedir cargo. Cargo se conquista — ou nunca vem.' },
        { title: '3.2', desc: 'O respeito à hierarquia é absoluto e inegociável.' },
        { title: '3.3', desc: 'Nada acontece sem autorização direta da liderança.' },
        { title: '3.4', desc: 'Conflitos internos são proibidos e considerados fraqueza.' },
        { title: '3.5', desc: 'Alianças não autorizadas são vistas como ameaça.' },
        { title: '3.6', desc: 'A palavra do Don é final. Questionar ordens é desobediência grave.' },
        { title: '3.7', desc: 'A família vem antes de qualquer interesse pessoal.' },
        { title: '3.8', desc: 'Negócios devem ser tratados com seriedade, postura e discrição.' }
      ]
    },
    {
      id: 'exoneracao',
      title: 'IV — EXONERAÇÃO',
      subtitle: 'Perda de Cargo / Expulsão',
      description: 'Quebra total de confiança. Não há retorno.',
      icon: XOctagon,
      color: 'text-red-600',
      border: 'border-l-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]',
      rules: [
        { title: '4.1', desc: 'Ficar off por mais de 3 dias sem aviso prévio.' },
        { title: '4.2', desc: 'Ajudar policiais direta ou indiretamente.' },
        { title: '4.3', desc: 'Descumprir ordens diretas da liderança de forma consciente.' },
        { title: '4.4', desc: 'Atitudes que prejudiquem a estrutura, imagem ou segurança da família.' },
        { title: '4.5', desc: 'Traição, delação ou vazamento de informações internas.' },
        { title: '4.6', desc: 'Cooperação direta ou indireta com autoridades.' },
        { title: '4.7', desc: 'Qualquer ação intencional que coloque a família em risco.' }
      ]
    },
    {
      id: 'banimento',
      title: 'V — BANIMENTO PERMANENTE',
      subtitle: 'Sentença Final',
      description: 'Punição final. Sem perdão.',
      icon: Skull,
      color: 'text-red-700',
      border: 'border-l-red-700 animate-pulse',
      rules: [
        { 
          title: '5.1', 
          desc: 'CAIXA 2: Qualquer esquema financeiro paralelo, desvio, ocultação ou movimentação de dinheiro fora do controle da liderança.' 
        }
      ]
    }
  ];

  return (
    <main className="min-h-screen text-white p-4 md:p-12 font-sans selection:bg-red-900 selection:text-white">
      
      <div className="max-w-4xl mx-auto">
        <header className="mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
            
            <div className="relative">
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
                    Código de<span className="text-red-600"> Honra </span>
                </h1>
                
                <div className="flex items-center gap-4 mt-4">
                    <div className="h-0.5 w-12 bg-red-600"></div>
                    <p className="text-gray-400 font-medium tracking-wide uppercase text-sm">
                        Diretrizes da Máfia Trindade Penumbra
                    </p>
                </div>
            </div>
        </header>

        <div className="flex flex-col gap-16">
            {categories.map((category, idx) => (
                <section 
                    key={category.id} 
                    className="relative pl-8 md:pl-12 group animate-in fade-in slide-in-from-bottom-8 duration-700"
                    style={{ animationDelay: `${idx * 100}ms` }}
                >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 md:w-0.5 ${category.border} bg-white/5 transition-all group-hover:bg-red-900/50`}></div>
                    
                    <div className="absolute -left-3 md:left-[-19px] top-0 bg-black p-1 md:p-2 rounded-full border border-red-900/30 group-hover:border-red-600 transition-colors">
                        <category.icon size={16} className={category.color} />
                    </div>

                    <div className="mb-6">
                        <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-3 ${category.color}`}>
                            {category.title}
                        </h2>
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-gray-500 mt-1">
                            <span className="uppercase text-xs font-bold tracking-wider text-red-500/70">{category.subtitle}</span>
                            <span className="hidden md:inline w-1 h-1 rounded-full bg-gray-600"></span>
                            <p className="text-sm italic">{category.description}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        {category.rules.map((rule, ruleIdx) => (
                            <div 
                                key={ruleIdx}
                                className="relative p-4 rounded-lg hover:bg-black/60 backdrop-blur-md border border-transparent hover:border-white/5 transition-all duration-200 group/rule"
                            >
                                <div className="flex items-start gap-4">
                                    <span className="font-mono text-red-600 font-bold text-lg min-w-12">
                                        {rule.title}
                                    </span>
                                    <p className="text-gray-300 leading-relaxed text-sm md:text-base group-hover/rule:text-white">
                                        {rule.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>

        <div className="mt-24 pt-12 border-t border-white/10 pb-20">
            <div className="bg-black/40 backdrop-blur-sm border border-red-900/30 p-8 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                
                <h3 className="text-red-500 font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Disposição Final
                </h3>
                
                <p className="text-xl md:text-2xl font-bold text-white max-w-2xl leading-tight">
                  A liderança observa. As punições são aplicadas sem aviso, conforme gravidade, intenção e histórico.
                </p>
                
                <div className="mt-6 flex items-center gap-2 opacity-50">
                    <Skull size={14} className="text-red-500" />
                    <span className="text-xs font-mono uppercase text-gray-400">Trindade Penumbra • Última Atualização: 07/01/2026</span>
                </div>
            </div>
        </div>

      </div>
    </main>
  );
}