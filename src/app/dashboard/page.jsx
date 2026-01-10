'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import EmbedEditor from '../components/embeds/EmbedEditor';
import ManageRecPage from '../components/recruiter/ManageRecPage';
import MemberPage from '../components/members/MemberPage';
import RafflesPage from '../components/raffles/RafflesPage';
import DashboardHome from '../components/homepage/HomePage';
import LogsPage from '../components/logspage/LogsPage';
import { 
  Settings,
  Users, 
  Trophy,
  FileText,
  Menu,
  X,
  ChevronRight,
  Send,
  UserCheck,
  House
} from 'lucide-react';

const NavigationSidebar = ({ isOpen, onClose, activeTab, setActiveTab, sections }) => {
  return (
    <>
      <div 
        className={`
          fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />
      
      <div className={`
        fixed top-0 right-0 h-full w-80 
        bg-[#09090b] /* Fundo quase preto sólido (Zinc 950) */
        border-l border-white/5 
        shadow-2xl z-50 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        
        <div className="flex flex-col h-full">
          
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
            <span className="text-sm font-medium text-zinc-400 tracking-wider uppercase">
              Menu Principal
            </span>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4">
            <div className="space-y-1">
              {sections.map((section, index) => {
                const isActive = activeTab === section.id;
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveTab(section.id);
                      onClose();
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group cursor-pointer
                      ${isActive 
                        ? 'bg-red-500/10 text-red-500'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                      }
                    `}
                  >
                    <section.icon 
                      className={`w-4 h-4 ${isActive ? 'text-red-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} 
                    />
                    
                    <span className="flex-1 text-left">{section.title}</span>
                    
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 border-t border-white/5 bg-[#09090b]">
            <div className="flex flex-col gap-4">

               <div className="flex items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-300">Powered by</span>
                  <Image src="/logoSentra.png" alt="Sentra" width={20} height={20} className="" /> Sentra
               </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

const MessageContent = () => (
  <div className="space-y-6 p-6">
    <h1 className="py-4 text-5xl text-center font-extrabold font-sans text-white">Mensagens</h1>
    <hr className="h-2 rounded-t-3xl border-l border-r border-t border-gray-400/20 border-t-gray-400/20" />
    <EmbedEditor 
      title="Embed Editor" 
      description="Crie e personalize embeds para suas mensagens do Discord com facilidade."
    />
  </div>
);

const GeneralsContent = () => (
  <div className="space-y-6 p-6">
    <DashboardHome />
  </div>
);

const RecruitmentContent = () => (
  <div className="space-y-6 p-6">
    <h2 className="text-5xl text-center font-extrabold font-sans text-white">Recrutamento</h2>
    <hr className="h-4 rounded-t-3xl border-l border-r border-t border-gray-400/20 border-t-gray-400/20" />
    <ManageRecPage />
  </div>
);

const MembersContent = () => (
  <div className="space-y-6 p-6">
    <h2 className="text-5xl text-center font-extrabold font-sans text-white">Gerenciar Membros</h2>
    <hr className="h-4 rounded-t-3xl border-l border-r border-t border-gray-400/20 border-t-gray-400/20" />
    <MemberPage />
  </div>
);

const RafflesContent = () => (
  <div className="space-y-6 p-6">
    <h2 className="text-5xl text-center font-extrabold font-sans text-white">Sorteios</h2>
    <hr className="h-4 rounded-t-3xl border-l border-r border-t border-gray-400/20 border-t-gray-400/20" />
    <RafflesPage />
  </div>
);

const LogsContent = () => (
  <div className="space-y-6 p-6">
    <h2 className="text-5xl text-center font-extrabold font-sans text-white">System Logs</h2>
    <hr className="h-4 rounded-t-3xl border-l border-r border-t border-gray-400/20 border-t-gray-400/20" />
    <LogsPage />
  </div>
);

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('generals');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTab = localStorage.getItem('dashboardActiveTab');
    const timer = setTimeout(() => {
      if (savedTab) {
        setActiveTab(savedTab);
      }
      setIsLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('dashboardActiveTab', activeTab);
    }
  }, [activeTab, isLoaded]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !session.isAdmin) {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (status === 'loading' || !session?.isAdmin || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const sections = [
    { id: 'generals', title: 'Página Inicial', icon: House, component: GeneralsContent },
    { id: 'messages', title: 'Mensagens', icon: Send, component: MessageContent },
    { id: 'recruiter', title: 'Recrutamento', icon: UserCheck, component: RecruitmentContent },
    { id: 'members', title: 'Membros', icon: Users, component: MembersContent },
    { id: 'raffles', title: 'Sorteios', icon: Trophy, component: RafflesContent },
    { id: 'logs', title: 'Logs', icon: FileText, component: LogsContent },
  ];


  const ActiveContent = sections.find(s => s.id === activeTab)?.component || GeneralsContent;

  return (
    <div 
      className="min-h-screen"
    >
      <NavigationSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sections={sections}
      />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-400 bg-[#05050573] backdrop-blur-md max-w-fit rounded-md px-3 py-1 border border-[#ffffff1c]">
              <Settings className="w-4 h-4" />
              <span>Dashboard</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-blue-400">{sections.find(s => s.id === activeTab)?.title}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(true);
              }}
              className="cursor-pointer p-2 bg-[#05050573] backdrop-blur-md hover:bg-slate-700/40 border border-[#ffffff1c] rounded-lg transition-all duration-200 hover:scale-110 group"
              title="Abrir navegação (Ctrl+B)"
            >
              <Menu className="w-4 h-4 text-slate-300 group-hover:text-white" />
            </button>
          </div>
        </div>

        <div className="animate-fadeIn bg-[#00000073] backdrop-blur-md rounded-xl min-h-screen">
          <ActiveContent />
        </div>
      </div>
    </div>
  );
}