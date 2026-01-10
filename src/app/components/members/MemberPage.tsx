import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { API_BASE_URL } from '@/utils/constants';
import { FaSortUp, FaSortDown, FaFilter, FaRegTrashAlt, FaSearch, FaUser, FaBan, FaWpforms } from 'react-icons/fa';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input';
import { WiMoonFull } from "react-icons/wi";
import { AiFillMoon } from "react-icons/ai";
import { IoIosRemoveCircle, IoIosWarning } from "react-icons/io";
import { RiRecordCircleFill } from "react-icons/ri";
import { LuRefreshCw, LuHistory } from "react-icons/lu";
import { ImEnter } from "react-icons/im";
import { MdMoreVert } from "react-icons/md";
import { useSession } from "next-auth/react";
import { WarningModal } from './modals/WarningModal';
import { ExonerationModal } from './modals/ExonerationModal';
import { ProfileModal } from './modals/ProfileModal';
import { RecruitmentModal } from './modals/RecruitmentModal';

const HIERARCHY_IDS = [
  '1365475846843928617',
  '1361018915576217681',
  '1446125458981781616',
  '1446126883111436389',
  '1446127626703077437',
  '1446128149187399761',
  '1446128918326153280',
  '1446129387521966182',
  '1446129750513811556',
  '1446129859171586078',
  '1446130709172457522',
  '1446130767305375834',
  '1446130792815267962',
  '1446157691448856616',
  '1446157527262695506',
  '1446157127214305370',
  '1446158406561042602',
  '1446473418609397913'
];

interface Role {
  id: string;
  name: string;
  color: string;
}

interface ApiUser {
  userId: string;
  username: string;
  nickname?: string;
  avatar?: string;
  joinedAt?: string;
  status?: 'online' | 'offline' | 'dnd' | 'idle';
  roles?: Role[];
}

interface Member {
  id: string;
  avatar: string;
  nickname: string;
  username: string;
  timeSince: string;
  rawJoinedAt: number;
  roles: Role[];
  highestRoleIndex: number;
  joinedAt: string;
  lastOnline: string;
  status: 'online' | 'offline' | 'dnd' | 'idle';
}

const ITEMS_PER_PAGE = 15;

const calculateTimeSince = (dateString?: string) => {
  if (!dateString) return 'N/A';
  const joinDate = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - joinDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) return `${diffDays} dias`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`;
  return `${Math.floor(diffDays / 365)} anos`;
};

export default function MemberPage() {
  const { data: session } = useSession();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [activeModal, setActiveModal] = useState<'none' | 'profile' | 'recruitment' | 'warn' | 'exonerate'>('none');
  
  // Filtros e Ordenação
  const [sortBy, setSortBy] = useState<'joinedAt' | 'hierarchy' | 'status'>('hierarchy');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/bot/user_status?_=${Date.now()}`, {
        headers: {
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch members');
      
      const data: ApiUser[] = await res.json();
      
      const formattedMembers: Member[] = data
        .filter(user => user.username && user.userId) // Filtra usuários inválidos/corrompidos
        .map((user) => {
        const userRoles = Array.isArray(user.roles) ? user.roles : [];
        const filteredRoles = userRoles
          .filter(role => role && typeof role === 'object' && 'id' in role && HIERARCHY_IDS.includes(role.id))
          .sort((a, b) => {
            return HIERARCHY_IDS.indexOf(a.id) - HIERARCHY_IDS.indexOf(b.id);
          });
          
        const highestRoleIndex = filteredRoles.length > 0 
          ? HIERARCHY_IDS.indexOf(filteredRoles[0].id) 
          : 999;

        return {
          id: user.userId,
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.nickname || 'User'}&background=random`,
          nickname: user.nickname || 'Desconhecido',
          username: user.username ? `@${user.username}` : 'N/A',
          timeSince: calculateTimeSince(user.joinedAt),
          rawJoinedAt: user.joinedAt ? new Date(user.joinedAt).getTime() : 0,
          roles: filteredRoles,
          highestRoleIndex,
          joinedAt: user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('pt-BR') : 'N/A',
          lastOnline: user.status && user.status !== 'offline' ? 'Online Agora' : 'Offline',
          status: user.status || 'offline',
        };
      });

      setMembers(formattedMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchMembers();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', fetchMembers);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', fetchMembers);
    };
  }, []);

  // Lógica de Filtragem e Ordenação
  const filteredAndSortedMembers = React.useMemo(() => {
    let result = [...members];

    // 0. Filtro de Busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.nickname.toLowerCase().includes(query) || 
        m.username.toLowerCase().includes(query) || 
        m.id.includes(query)
      );
    }

    // 1. Filtro de Status
    if (statusFilter !== 'all') {
      result = result.filter(m => m.status === statusFilter);
    }

    // 2. Ordenação
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'hierarchy') {
        comparison = a.highestRoleIndex - b.highestRoleIndex;
      } else if (sortBy === 'joinedAt') {
        comparison = b.rawJoinedAt - a.rawJoinedAt; // Mais recente primeiro por padrão
      } else if (sortBy === 'status') {
        const statusOrder = { online: 0, dnd: 1, idle: 2, offline: 3 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [members, sortBy, sortOrder, statusFilter, searchQuery]);

  // 3. Lógica de Paginação
  const totalPages = Math.ceil(filteredAndSortedMembers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMembers = filteredAndSortedMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Funções de navegação
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  
  const handleSort = (key: 'joinedAt' | 'hierarchy' | 'status') => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] rounded-2xl text-white flex flex-col items-center justify-center p-8 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        <span className="mt-4 text-gray-400">Carregando membros...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] rounded-2xl text-white flex flex-col items-center p-8 w-full">
      
      {/* Cabeçalho da Página */}
      <div className="w-full max-w-7xl mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Membros da Comunidade</h1>
          <div className="text-sm text-white/50">
            Total: <span className="text-white">{filteredAndSortedMembers.length}</span> membros
          </div>
        </div>

        {/* Controles de Filtro */}
        <div className="flex items-center gap-4 rounded-lg">
          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <Input 
              placeholder="Buscar por nome ou ID..." 
              className="pl-9 bg-[#1a1a1a] border-white/10 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button size="icon-sm" className="bg-[#1a1a1a] hover:bg-[#3d3d3d] border border-[#3d3d3d] cursor-pointer text-white/50 hover:text-white">
                  <FaFilter />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border border-white/10 shadow-2xl min-w-[150px]" align="center">
                <DropdownMenuItem onClick={() => fetchMembers()}>
                  Atualizar
                  <DropdownMenuShortcut><LuRefreshCw className="text-white/50" /></DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Filtrar Status</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="border border-white/10 shadow-2xl min-w-[140px]">
                      <DropdownMenuItem onClick={() => setStatusFilter('online')}>
                        Disponível
                        <DropdownMenuShortcut><WiMoonFull className="text-green-500" /></DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('idle')}>
                        Ausente
                        <DropdownMenuShortcut><AiFillMoon className="text-yellow-600" /></DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('dnd')}>
                        Não Perturbe
                        <DropdownMenuShortcut><IoIosRemoveCircle className="text-red-400" /></DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('offline')}>
                        Offline
                        <DropdownMenuShortcut><RiRecordCircleFill className="text-gray-500" /></DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Filtrar Data</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="border border-white/10 shadow-2xl min-w-[140px]">
                      <DropdownMenuItem onClick={() => { setSortBy('joinedAt'); setSortOrder('asc'); }}>
                        Mais Recentes
                        <DropdownMenuShortcut><ImEnter className="text-white/50" /></DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSortBy('joinedAt'); setSortOrder('desc'); }}>
                        Mais Antigos
                        <DropdownMenuShortcut><LuHistory className="text-white/50" /></DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator className="bg-white/10 mx-1.5" />
                <DropdownMenuItem variant='destructive' onClick={() => { setStatusFilter('all'); setSortBy('hierarchy'); setSortOrder('asc'); }}>
                  Limpar Filtros
                  <DropdownMenuShortcut><FaRegTrashAlt className="text-red-400" /></DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl bg-[#1E1E1E] rounded-xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#252525] border-b border-white/10 text-white/60 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('hierarchy')}>
                  <div className="flex items-center gap-1">
                    Membro {sortBy === 'hierarchy' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold">Tempo de Casa</th>
                <th className="px-6 py-4 font-semibold">Cargos</th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('joinedAt')}>
                  <div className="flex items-center gap-1">
                    Entrou em {sortBy === 'joinedAt' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentMembers.map((member) => (
                <tr 
                  key={member.id} 
                  className="hover:bg-white/5 transition-colors duration-200 group"
                >
                  {/* Coluna: Membro */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Image 
                          src={member.avatar} 
                          alt={member.nickname} 
                          className="w-10 h-10 rounded-full border border-white/10"
                          width={40}
                          height={40}
                        />
                        {/* Bolinha de Status */}
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1E1E1E] ${getStatusColor(member.status)}`}></span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{member.nickname}</span>
                        <span className="text-xs text-white/40">{member.username}</span>
                      </div>
                    </div>
                  </td>

                  {/* Coluna: Tempo de Casa (Substituindo Email) */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-white/70 font-mono bg-white/5 px-2 py-1 rounded border border-white/5">
                      {member.timeSince}
                    </span>
                  </td>

                  {/* Coluna: Cargos */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {member.roles.map((role) => {
                        const hasColor = role.color && role.color !== '#000000';
                        return (
                          <span 
                            key={role.id} 
                            className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wide border bg-white/5 border-white/10 ${!hasColor ? 'text-white/60' : ''}`}
                            style={hasColor ? { 
                              color: role.color, 
                              borderColor: `${role.color}40`,
                              backgroundColor: `${role.color}20` 
                            } : undefined}
                          >
                            {role.name}
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  {/* Coluna: Data de Entrada */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-sm">
                      <span className="text-white/80">{member.joinedAt}</span>
                    </div>
                  </td>

                  {/* Coluna: Ações */}
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button size="lg" className="h-8 w-8 rounded-full p-0 bg-transparent hover:bg-white/10 text-white/50 hover:text-white cursor-pointer">
                          <MdMoreVert className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="border border-white/10 shadow-2xl min-w-[150px]">
                        <DropdownMenuItem onClick={() => { setSelectedMember(member); setActiveModal('profile'); }}>
                          Ver Perfil
                          <DropdownMenuShortcut><FaUser className="h-4 w-4" /></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedMember(member); setActiveModal('recruitment'); }}>
                          Formulário
                          <DropdownMenuShortcut><FaWpforms className="h-4 w-4" /></DropdownMenuShortcut>
                        </DropdownMenuItem>

                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>Moderar</DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="border border-white/10 shadow-2xl min-w-[140px]">
                              <DropdownMenuItem onClick={() => { setSelectedMember(member); setActiveModal('warn'); }}>
                                Aplicar ADV
                                <DropdownMenuShortcut><IoIosWarning className="text-white/50" /></DropdownMenuShortcut>
                              </DropdownMenuItem>
                              <DropdownMenuItem variant="destructive" onClick={() => { setSelectedMember(member); setActiveModal('exonerate'); }}>
                                Exonerar
                                <DropdownMenuShortcut><FaBan className="text-red-400" /></DropdownMenuShortcut>
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#252525] border-t border-white/10 px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-white/40">
            Mostrando {startIndex + 1} até {Math.min(startIndex + ITEMS_PER_PAGE, filteredAndSortedMembers.length)} de {filteredAndSortedMembers.length}
          </span>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all"
            >
              Anterior
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-all
                    ${currentPage === page 
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/50 cursor-pointer' 
                      : 'text-white/40 hover:bg-white/5 cursor-pointer'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>

      <WarningModal 
        isOpen={activeModal === 'warn'} 
        onClose={() => setActiveModal('none')} 
        user={selectedMember} 
        adminId={session?.user?.id || 'unknown'} 
      />
      <ExonerationModal 
        isOpen={activeModal === 'exonerate'} 
        onClose={() => setActiveModal('none')} 
        user={selectedMember} 
        adminId={session?.user?.id || 'unknown'} 
      />
      <ProfileModal 
        isOpen={activeModal === 'profile'} 
        onClose={() => setActiveModal('none')} 
        user={selectedMember} 
      />
      <RecruitmentModal 
        isOpen={activeModal === 'recruitment'} 
        onClose={() => setActiveModal('none')} 
        user={selectedMember} 
      />
    </div>
  );
}