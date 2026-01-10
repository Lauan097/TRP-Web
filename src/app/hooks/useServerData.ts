import { useState, useEffect } from 'react';

interface Role {
  id: string;
  name: string;
  color?: string;
}

interface User {
  id: string;
  username: string;
  nickname?: string;
  avatar?: string;
}

interface Channel {
  id: string;
  name: string;
  type?: number;
}

interface Emoji {
  id: string;
  name: string;
  animated: boolean;
}

import { API_BASE_URL } from '@/utils/constants';

export interface ServerData {
  roles: Role[];
  users: User[];
  channels: Channel[];
  emojis: Emoji[];
}

export const useServerData = () => {
  const [data, setData] = useState<ServerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = API_BASE_URL;
        const response = await fetch(`${apiUrl}/api/site/server-data/all`);
        
        if (!response.ok) {
          throw new Error('Falha ao buscar dados do servidor');
        }

        const serverData = await response.json();
        setData(serverData);
        setError(null);
      } catch (err) {
        console.error('Error fetching server data:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const apiUrl = API_BASE_URL;
      const response = await fetch(`${apiUrl}/api/site/server-data/all`);
      
      if (!response.ok) {
        throw new Error('Falha ao buscar dados do servidor');
      }

      const serverData = await response.json();
      setData(serverData);
      setError(null);
    } catch (err) {
      console.error('Error refetching server data:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};
