import { API_BASE_URL } from './constants';

export interface MemberProfile {
  id: string;
  user_name: string;
  user_discord_tag: string;
  user_discord_nick: string;
  user_id: string;
  user_game_id: string;
  user_telephone: string;
  user_shift: string;
  rec_id: string;
  approver_id: string;
  approver_tag: string;
  approver_nick: string;
  guild_id: string;
  recruited_at: string;
}

export async function fetchMemberProfile(
  userId: string,
  guildId: string = '1295702106195492894'
): Promise<MemberProfile | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/bot/memberprofile/${userId}/${guildId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
      }
    );

    if (!response.ok) {
      console.error('Erro ao buscar perfil:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data || null;
  } catch (error) {
    console.error('Erro na requisição do perfil:', error);
    return null;
  }
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('API não está acessível:', error);
    return false;
  }
}

export interface RoleData {
  id: string;
  name: string;
  color: string;
}

export interface UserStatus {
  userId: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  roles: RoleData[];
  lastUpdate: string | null;
}

export async function fetchUserStatus(
  userId: string
): Promise<UserStatus> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/bot/user_status/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return { userId, status: 'offline', roles: [], lastUpdate: null };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Erro na requisição do status do usuário:', error);
    return { userId, status: 'offline', roles: [], lastUpdate: null };
  }
}

export interface ServiceStatus {
  id: number;
  name: string;
  description: string;
  status: 'online' | 'offline' | 'issue';
  latency: number;
  uptime: number;
  memory?: string;
}

export interface HistoryStat {
  date: string;
  uptime: number;
}

export async function fetchSystemStatus(): Promise<ServiceStatus[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/site/status`, {
      cache: 'no-store'
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching system status:', error);
    return [];
  }
}

export async function fetchHistoryStats(): Promise<HistoryStat[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/site/status/history`, {
      cache: 'no-store'
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching history stats:', error);
    return [];
  }
}
