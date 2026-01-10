'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Server, Database, Globe, Music, RefreshCw, 
  CheckCircle2, XCircle, AlertTriangle, Activity, Wifi, Cpu 
} from 'lucide-react';
import { fetchSystemStatus, fetchHistoryStats, ServiceStatus, HistoryStat } from '@/utils/apiClient';
import { FaDiscord } from "react-icons/fa";

function ServiceCard({ initialData }: { initialData: ServiceStatus }) {
  const [data, setData] = useState<ServiceStatus>(initialData);
  const [loading, setLoading] = useState(false);

  const getIcon = (name: string) => {
    if (name.includes('Database')) return <Database className="w-5 h-5" />;
    if (name.includes('Bot')) return <FaDiscord className="w-5 h-5" />;
    if (name.includes('Lavalink')) return <Music className="w-5 h-5" />;
    if (name.includes('API')) return <Server className="w-5 h-5" />;
    return <Globe className="w-5 h-5" />;
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const update = async () => {
      setLoading(true);
      try {
        await new Promise(r => setTimeout(r, Math.random() * 2000 + 500));
        const response = await fetch('/api/status');
        if (!response.ok) throw new Error('Failed to fetch status');
        const allServices = await response.json();
        
        const myService = allServices.find((s: ServiceStatus) => s.id === initialData.id);
        
        if (myService) {
          setData(myService);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        timeoutId = setTimeout(update, Math.random() * 10000 + 10000);
      }
    };

    timeoutId = setTimeout(update, Math.random() * 5000 + 2000);

    return () => clearTimeout(timeoutId);
  }, [initialData.id]);

  return (
    <div 
      className="group relative overflow-hidden p-6 rounded-xl bg-[#111]/80 border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-2xl backdrop-blur-md"
    >
      <div className={`absolute top-0 left-0 w-full h-0.5 
        ${data.status === 'online' ? 'bg-emerald-500' : data.status === 'issue' ? 'bg-yellow-500' : 'bg-red-500'}
      `} />

      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-gray-400 transition-colors">
            {getIcon(data.name)}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-200 group-hover:text-white transition-colors flex items-center gap-2">
              {data.name}
            </h3>
            <p className="text-xs text-gray-500">{data.description}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className={`
            flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
            ${data.status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
            ${data.status === 'issue' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : ''}
            ${data.status === 'offline' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
          `}>
            <span className={`w-1.5 h-1.5 rounded-full ${data.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-current'}`} />
            {data.status.toUpperCase()}
          </div>
          
          <RefreshCw className={`w-3 h-3 text-purple-300 transition-opacity duration-300 ${loading ? 'opacity-100 animate-spin' : 'opacity-0'}`} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
        <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold" title="Tempo de resposta (Ping)">Latência</span>
            <div className="flex items-center gap-2 mt-1">
              <Wifi className="w-3 h-3 text-gray-600" />
              <span className={`font-mono text-sm ${data.latency > 100 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                {data.latency}ms
              </span>
            </div>
        </div>
        <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Uptime (24h)</span>
            <div className="flex items-center gap-2 mt-1">
              <Activity className="w-3 h-3 text-gray-600" />
              <span className="font-mono text-sm text-gray-300">
                {data.uptime}%
              </span>
            </div>
        </div>
        <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Memória</span>
            <div className="flex items-center gap-2 mt-1">
              <Cpu className="w-3 h-3 text-gray-600" />
              <span className="font-mono text-sm text-gray-300">
                {data.memory || 'N/A'}
              </span>
            </div>
        </div>
      </div>
    </div>
  );
}

function UptimeHistory() {
  const [history, setHistory] = useState<HistoryStat[]>([]);

  useEffect(() => {
    fetchHistoryStats().then(setHistory);
  }, []);

  const displayHistory = useMemo(() => {
    const days = 20;
    const result = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const found = history.find(h => h.date === dateStr);
      
      result.push({
        date: dateStr,
        uptime: found ? found.uptime : 100,
        hasData: !!found
      });
    }
    return result;
  }, [history]);

  const averageUptime = useMemo(() => {
    if (history.length === 0) return 100;
    const sum = history.reduce((acc, curr) => acc + curr.uptime, 0);
    return (sum / history.length).toFixed(2);
  }, [history]);

  return (
    <div className="mt-12 p-6 rounded-xl bg-[#111]/80 border border-white/5 backdrop-blur-md">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            System Uptime
            <span className="text-xs font-normal text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">Last 20 Days</span>
          </h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-400">{averageUptime}%</div>
          <div className="text-xs text-gray-500">Average Uptime</div>
        </div>
      </div>

      <div className="flex gap-1 h-12 items-end">
        {displayHistory.map((day) => (
          <div 
            key={day.date}
            className="group relative flex-1 h-full bg-white/5 rounded-sm hover:bg-white/10 transition-colors cursor-help"
          >
            <div 
              className={`w-full rounded-sm transition-all duration-500 ${
                day.uptime >= 99 ? 'bg-emerald-500' : 
                day.uptime >= 90 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ height: '100%' }}
            />
            
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 w-max">
              <div className="bg-black/90 border border-white/10 text-xs rounded px-2 py-1 text-white shadow-xl">
                <div className="font-bold">{day.date}</div>
                <div className={day.uptime >= 99 ? 'text-emerald-400' : 'text-yellow-400'}>
                  {day.uptime.toFixed(2)}% Uptime
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono">
        <span>20 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

export default function StatusPage() {
  const [initialServices, setInitialServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const systemHealth = useMemo(() => {
    if (initialServices.length === 0) return 'loading';
    const down = initialServices.filter(s => s.status === 'offline');
    const issues = initialServices.filter(s => s.status === 'issue');
    
    if (down.length > 0) return 'critical';
    if (issues.length > 0) return 'degraded';
    return 'healthy';
  }, [initialServices]);

  useEffect(() => {
    fetchSystemStatus().then(data => {
      setInitialServices(data);
      setLoading(false);
      setLastUpdated(new Date());
    });
  }, []);

  return (
    <div className="min-h-screen text-white font-sans relative overflow-hidden">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10 space-y-10">
        
        <header className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-widest">
                Infraestrutura
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              System Status
            </h1>
            <p className="text-gray-400 text-sm mt-1">Monitoramento em tempo real dos serviços da Máfia.</p>
          </div>
        </header>

        <div className={`
          relative overflow-hidden rounded-2xl p-6 border transition-all duration-500 backdrop-blur-md
          ${systemHealth === 'healthy' ? 'bg-emerald-500/5 border-emerald-500/20' : ''}
          ${systemHealth === 'degraded' ? 'bg-yellow-500/5 border-yellow-500/20' : ''}
          ${systemHealth === 'critical' ? 'bg-red-500/15 border-red-500/20' : ''}
          ${systemHealth === 'loading' ? 'bg-white/5 border-white/5' : ''}
        `}>
          <div className="flex items-center gap-4 ">
             <div className={`
               p-3 rounded-full flex items-center justify-center shadow-lg
               ${systemHealth === 'healthy' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : ''}
               ${systemHealth === 'degraded' ? 'bg-yellow-500 text-black shadow-yellow-500/20' : ''}
               ${systemHealth === 'critical' ? 'bg-red-500 text-white shadow-red-500/20' : ''}
               ${systemHealth === 'loading' ? 'bg-gray-700 animate-pulse' : ''}
             `}>
               {systemHealth === 'healthy' && <CheckCircle2 className="w-6 h-6" />}
               {systemHealth === 'degraded' && <AlertTriangle className="w-6 h-6" />}
               {systemHealth === 'critical' && <XCircle className="w-6 h-6" />}
             </div>
             <div>
               <h2 className="text-xl font-semibold">
                 {systemHealth === 'healthy' && 'Todos os sistemas operacionais'}
                 {systemHealth === 'degraded' && 'Alguns serviços apresentam instabilidade'}
                 {systemHealth === 'critical' && 'Interrupção crítica de serviço'}
                 {systemHealth === 'loading' && 'Verificando status...'}
               </h2>
               <p className="text-sm opacity-70">
                 Monitoramento da infraestrutura em tempo real.
               </p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading && initialServices.length === 0 
            ? [1,2,3,4].map(i => <div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse border border-white/5" />)
            : initialServices.map((service) => (
              <ServiceCard key={service.id} initialData={service} />
            ))
          }
        </div>

        <UptimeHistory />

        <div className="flex justify-center pt-8 border-t border-white/5">
           <span className="text-xs text-gray-500 font-mono">
             Última atualização completa: {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--'}
           </span>
        </div>

      </div>
    </div>
  );
}