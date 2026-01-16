'use client';

import { useEffect, useState, ReactNode } from 'react';
import { Users, FileText, Gift, Activity, Signal, Info, Server, ShieldAlert, TrendingUp } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';


interface DashboardData {
  stats: {
    totalMembers: number;
    pendingApps: number;
    activeRaffles: number;
    recentBans: number;
  };
  recentApps: Array<{
    id: number;
    name: string;
    status: string;
    created_at: string;
  }>;
  services: Array<{
    service_name: string;
    status: 'online' | 'warning' | 'offline';
    latency: number;
  }>;
  growthStats: Array<{
    date: string;
    joined: string;
    left: string;
  }>;
  activeRaffle: {
    title: string;
    participants: number;
    auto_close_date?: string | null;
    participant_limit?: number | null;
  } | null;
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  description: string;
  sub?: string;
  alert?: boolean;
  trend?: string;
}

interface ServiceStatusProps {
  name: string;
  status: 'online' | 'warning' | 'offline' | string;
  ping: string;
}

export default function DashboardHome() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500';
    fetch(`${apiUrl}/api/site/dashboard`)
      .then(res => res.json())
      .then(fetchedData => {
        setData(fetchedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch dashboard data', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 animate-pulse">Carregando dados da Máfia...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-red-400 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
            <ShieldAlert className="w-10 h-10" />
            <p>Erro ao carregar dados do QG.</p>
        </div>
      </div>
    );
  }

  const chartData = data.growthStats.map(item => ({
    name: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    Entradas: parseInt(item.joined),
    Saídas: parseInt(item.left)
  }));

  function formatRaffleEnd(dateStr?: string | null) {
    if (!dateStr) return 'Data indefinida';
    const d = new Date(dateStr);
    if (isNaN(d.getTime()) || d.getTime() === 0) return 'Data indefinida';
    return d.toLocaleDateString('pt-BR');
  }

  function computeRaffleProgress(participants: number | string | undefined, limit?: number | string | null) {
    const p = Number(participants) || 0;
    const l = limit == null ? null : Number(limit);
    
    if (!l || isNaN(l) || l <= 0) {
        return { percent: null as number | null, label: null as string | null, participants: p, limit: l };
    }
    
    const percent = Math.min(100, Math.round((p / l) * 100));
    return { percent, label: `${percent}%`, participants: p, limit: l };
  }

  const activeRaffleProgress = data.activeRaffle 
    ? computeRaffleProgress(data.activeRaffle.participants, data.activeRaffle.participant_limit) 
    : { percent: null, label: null, participants: 0, limit: null };


  return (
    <div className="p-8 space-y-10 bg-[#0f0f0f] min-h-screen text-gray-100 font-sans rounded-2xl">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#2b2b2b] pb-6">
        <div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400 max-w-lg">
            Visão geral tática da <span className="text-purple-400 font-medium">Máfia Trindade Penumbra</span>.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3 bg-[#1a1a1a] px-4 py-2 rounded-lg border border-[#2b2b2b] shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest font-semibold">
            Sistema Online
          </span>
        </div>
      </header>

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-semibold text-gray-200">Métricas em Tempo Real</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Efetivo Total" 
            value={data.stats.totalMembers.toString()} 
            icon={<Users className="w-5 h-5 text-blue-400" />} 
            description="Número total de membros registrados no servidor."
          />
          <StatsCard 
            title="Recrutamento" 
            value={`${data.stats.pendingApps}`} 
            sub="Fichas pendentes"
            icon={<FileText className="w-5 h-5 text-yellow-400" />} 
            alert={data.stats.pendingApps > 0}
            description="Candidatos que enviaram o formulário e aguardam análise da Gerência."
          />
          <StatsCard 
            title="Sorteios" 
            value={data.stats.activeRaffles.toString()} 
            icon={<Gift className="w-5 h-5 text-purple-400" />} 
            sub={data.activeRaffle ? "Em andamento" : "Nenhum ativo"}
            description="Eventos de premiação ativos onde membros podem participar."
          />
          <StatsCard 
            title="Punições (24h)" 
            value={data.stats.recentBans.toString()} 
            icon={<ShieldAlert className="w-5 h-5 text-red-500" />}
            description="Membros que receberam banimento ou advertência grave nas últimas 24 horas."
          />
        </div>
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-200">Infraestrutura & Rede</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#1a1a1a] rounded-xl p-6 border border-[#2b2b2b] shadow-lg hover:border-[#3d3d3d] transition-colors">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-semibold text-gray-200">Fluxo de Membros</h3>
                <p className="text-xs text-gray-500 mt-1">Comparativo de entradas e saídas recentes.</p>
              </div>
              <TrendingUp className="w-5 h-5 text-gray-600" />
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2b2b2b" vertical={false} />
                  <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#2b2b2b', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#3d3d3d', borderRadius: '8px', color: '#F3F4F6' }}
                    itemStyle={{ color: '#F3F4F6' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="Entradas" name="Ganhos" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="Saídas" name="Baixas" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2b2b2b] shadow-lg flex flex-col h-full">
            <h3 className="font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <Signal className="w-4 h-4 text-emerald-500"/> Status da API
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {data.services.length === 0 ? (
                 <p className="text-gray-500 text-sm">Sem dados de telemetria.</p>
              ) : (
                data.services.map((service, idx) => (
                  <ServiceStatus 
                    key={idx} 
                    name={service.service_name} 
                    status={service.status} 
                    ping={`${service.latency}ms`} 
                  />
                ))
              )}
            </div>
            <div className="mt-6 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
              <p className="text-[11px] text-blue-400 leading-relaxed">
                <Info className="w-3 h-3 inline mr-1 mb-0.5"/>
                Monitoramento em tempo real da conexão entre Bot, Site e Banco de Dados PostgreSQL.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-gray-200">Gestão Comunitária</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#1a1a1a] rounded-xl p-6 border border-[#2b2b2b] shadow-lg">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-200">Últimas Candidaturas</h3>
            </div>
            
            <div className="space-y-3">
              {data.recentApps.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[#2b2b2b] rounded-xl">
                  <p className="text-gray-500 text-sm">Nenhuma candidatura aguardando análise.</p>
                </div>
              ) : (
                data.recentApps.map((app) => (
                  <div key={app.id} className="group flex items-center justify-between p-4 bg-[#212121] border border-transparent hover:border-[#3d3d3d] rounded-xl transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xs font-bold text-white shadow-inner border border-white/5">
                        {app.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-200 group-hover:text-white transition-colors">{app.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(app.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
          {data.activeRaffle ? (
            <div className="relative overflow-hidden bg-linear-to-br from-[#2a1b3d] to-[#151515] rounded-xl p-1 border border-purple-500/20 shadow-xl group">
              
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-purple-600/20 blur-3xl rounded-full group-hover:bg-purple-600/30 transition-all"></div>

              <div className="relative z-10 p-5 bg-[#1a1a1a]/40 backdrop-blur-sm rounded-lg h-full flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-1 rounded border border-purple-500/30">EVENTO ATIVO</span>
                    <Gift className="w-5 h-5 text-purple-400 animate-pulse" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{data.activeRaffle.title}</h3>
                    <p className="text-xs text-gray-400 mb-6">
                        Sorteio gerenciado automaticamente. O sistema selecionará um vencedor aleatório na data prevista.
                    </p>
                    
                    <div className="relative w-full bg-black/40 rounded-full h-2.5 mb-2 border border-white/5 overflow-hidden">
                    <div
                        className={`h-2.5 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-1000 ${activeRaffleProgress.percent != null && activeRaffleProgress.percent >= 100 ? 'bg-emerald-500' : 'bg-purple-600'}`}
                        style={{ width: activeRaffleProgress.percent != null ? `${activeRaffleProgress.percent}%` : '5%' }}
                    ></div>
                    </div>
                </div>
                
                <div className="flex justify-between items-end text-xs text-gray-400 mt-4 border-t border-white/5 pt-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-gray-500">Participantes</span>
                        <span className="font-mono text-purple-300">
                            {activeRaffleProgress.limit != null 
                            ? `${activeRaffleProgress.participants}/${activeRaffleProgress.limit}` 
                            : activeRaffleProgress.participants}
                        </span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] uppercase tracking-wider text-gray-500">Término</span>
                        <span className="font-mono text-gray-300">{formatRaffleEnd(data.activeRaffle.auto_close_date)}</span>
                    </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-[#1a1a1a] rounded-xl p-6 border border-[#2b2b2b] border-dashed flex flex-col items-center justify-center text-center">
                <Gift className="w-10 h-10 text-gray-600 mb-3" />
                <p className="text-gray-400 font-medium">Nenhum sorteio ativo</p>
                <p className="text-xs text-gray-600 mt-1 max-w-50">Novos eventos aparecerão aqui automaticamente quando criados.</p>
            </div>
          )}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatsCard({ title, value, icon, sub, alert, description }: StatsCardProps) {
  return (
    <div className={`
      relative bg-[#1a1a1a] p-5 rounded-xl border transition-all duration-300 group
      ${alert ? 'border-yellow-600/30 bg-yellow-900/5' : 'border-[#2b2b2b] hover:border-[#3d3d3d]'}
      hover:shadow-lg hover:-translate-y-1
    `}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 z-20">
            <span className="text-gray-400 text-sm font-medium tracking-wide">{title}</span>
            <div className="group/info relative">
                <Info className="w-3.5 h-3.5 text-gray-600 hover:text-gray-300 cursor-help transition-colors" />
                <div className="absolute left-0 bottom-6 w-52 p-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-xs text-gray-300 opacity-0 group-hover/info:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl z-50">
                    {description}
                    <div className="absolute -bottom-1 left-1.5 w-2 h-2 bg-[#0a0a0a] border-b border-l border-[#333] -rotate-45"></div>
                </div>
            </div>
        </div>
        <div className={`p-2 rounded-lg ${alert ? 'bg-yellow-500/10' : 'bg-[#252525] group-hover:bg-[#303030]'} transition-colors`}>
          {icon}
        </div>
      </div>

      <div className="text-3xl font-bold text-white tracking-tight mb-1">{value}</div>
      
      <div className="flex items-center justify-between min-h-5">
        {sub ? (
            <span className="text-xs text-gray-500 font-medium">{sub}</span>
        ) : (
            <span className="text-xs text-gray-600/50 italic select-none">&nbsp;</span>
        )}
      </div>
    </div>
  );
}

function ServiceStatus({ name, status, ping }: ServiceStatusProps) {
  const getStatusColor = (s: string) => {
    switch(s) {
      case 'online': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]';
      case 'warning': return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]';
      case 'offline': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex justify-between items-center p-3 rounded-lg bg-[#212121]/50 border border-transparent hover:border-[#333] transition-colors group cursor-default">
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></span>
        <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">{name}</span>
      </div>
      <span className="text-[10px] text-gray-500 font-mono bg-black/20 px-1.5 py-0.5 rounded border border-white/5">
        {ping}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; style: string }> = {
    'PENDING_SOLICITATION': { label: 'Solicitação Pendente', style: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    'APPROVED_SOLICITATION': { label: 'Solicitação Aprovada', style: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    'REJECTED_SOLICITATION': { label: 'Solicitação Rejeitada', style: 'bg-red-500/10 text-red-500 border-red-500/20' },
    
    'PENDING_FORM': { label: 'Aguardando Form', style: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    'SUBMITTED_FORM': { label: 'Form Enviado', style: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    'APPROVED_FORM': { label: 'Form Aprovado', style: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    'REJECTED_FORM': { label: 'Form Rejeitado', style: 'bg-red-500/10 text-red-500 border-red-500/20' },
    
    'PENDING_INTERVIEW': { label: 'Aguardando Entrevista', style: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
    'APPROVED_INTERVIEW': { label: 'Entrevista Aprovada', style: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    'REJECTED_INTERVIEW': { label: 'Entrevista Reprovada', style: 'bg-red-500/10 text-red-500 border-red-500/20' },
    
    'PENDING_PRACTICAL': { label: 'Aguardando Prático', style: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
    'APPROVED_PRACTICAL': { label: 'Aprovado', style: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    'REJECTED_PRACTICAL': { label: 'Reprovado', style: 'bg-red-500/10 text-red-500 border-red-500/20' },

    'APPROVED': { label: 'Aprovado', style: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    'REJECTED': { label: 'Reprovado', style: 'bg-red-500/10 text-red-500 border-red-500/20' },
    'PENDING': { label: 'Pendente', style: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  };

  const config = statusConfig[status] || { label: status, style: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };

  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${config.style} uppercase tracking-wider whitespace-nowrap`}>
      {config.label}
    </span>
  );
}