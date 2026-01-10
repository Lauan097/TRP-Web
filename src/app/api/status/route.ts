import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/utils/constants';

export const dynamic = 'force-dynamic';

interface ServiceData {
  id: number;
  name: string;
  description: string;
  status: string;
  latency: number;
  uptime: number;
  memory: string;
}

export async function GET() {
  const API_URL = API_BASE_URL;
  
  try {
    const startPing = Date.now();
    await fetch(`${API_URL}/health`, { cache: 'no-store' });
    const pingLatency = Date.now() - startPing;

    const response = await fetch(`${API_URL}/api/site/status`, { cache: 'no-store' });
    
    if (!response.ok) {
        return NextResponse.json([], { status: response.status });
    }
    
    const data: ServiceData[] = await response.json();
    const coreApi = data.find((s) => s.name === 'Core API');
    if (coreApi) {
        coreApi.latency = pingLatency;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching status via proxy:', error);
    
    // Em caso de erro (API offline), retornar estado offline para todos os serviços
    // para evitar que o frontend quebre com erro 500
    const offlineData: ServiceData[] = [
        { id: 1, name: 'Core API', description: 'Backend principal e rotas', status: 'offline', latency: 0, uptime: 0, memory: '0MB' },
        { id: 2, name: 'PostgreSQL Database', description: 'Persistência de dados', status: 'offline', latency: 0, uptime: 0, memory: 'N/A' },
        { id: 3, name: 'Discord Bot', description: 'Gateway e Eventos', status: 'offline', latency: 0, uptime: 0, memory: '0MB' },
        { id: 4, name: 'Lavalink Node', description: 'Servidor de Música', status: 'offline', latency: 0, uptime: 0, memory: '0MB' }
    ];
    
    return NextResponse.json(offlineData);
  }
}