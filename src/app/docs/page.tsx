'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Menu, Search, Home, FileText, Shield } from 'lucide-react';
import { TfiReload } from "react-icons/tfi";
import DocsWelcome from './docspage/WelcomePage';
import RecruiterPage from './docspage/RecruiterPage';
import ReRecruiterPage from './docspage/ReRecruiterPage';
import RecruitmentRequirementsPage from './docspage/ReRequeriments';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-8 text-center text-gray-500 min-h-screen flex flex-col items-center justify-center">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <p>Documentação em desenvolvimento.</p>
  </div>
);

export default function DocsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = searchParams.get('page') || 'welcome';

  const updateTab = (id: string) => {
    setIsSidebarOpen(false);
    router.push(`${pathname}?page=${id}`, { scroll: false });
  };

  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const menuItems = [ 
    {
      category: "INTRODUÇÃO",
      items: [
        { id: 'welcome', label: "Bem-vindo", icon: <Home size={18} />, component: <DocsWelcome /> },
        { id: 'about', label: "Sobre a Máfia", icon: <Shield size={18} />, component: <PlaceholderPage title="Sobre a Máfia" /> },
      ]
    },
    {
      category: "RECRUTAMENTO",
      items: [
        { id: 'recruitment', label: "Processo Seletivo", icon: <FileText size={18} />, component: <RecruiterPage /> },
        { id: 'requirements', label: "Requisitos", icon: <Shield size={18} />, component: <RecruitmentRequirementsPage /> },
        { id: 're-recruitment', label: "Recadastramento", icon: <TfiReload size={18} />, component: <ReRecruiterPage /> },
      ]
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === 'Escape') {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getFilteredMenuItems = () => {
    if (!searchQuery.trim()) return menuItems;
    const q = searchQuery.toLowerCase();
    return menuItems
      .map(group => ({
        ...group,
        items: group.items.filter(i => i.label.toLowerCase().includes(q))
      }))
      .filter(group => group.items.length > 0);
  };

  const filteredMenuItems = getFilteredMenuItems();

  const getActiveContent = () => {
    for (const group of menuItems) {
      const item = group.items.find(i => i.id === activeTab);
      if (item) return item.component;
    }
    return <DocsWelcome />;
  };

  return (
    <div className="min-h-screen w-full mb-18 text-gray-300 font-sans selection:bg-red-900 selection:text-white flex justify-center p-4 md:p-4">

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="w-full max-w-400 flex gap-6 items-start">
        
        <aside className={`
          fixed inset-y-0 left-0 z-50 md:z-0 md:sticky md:top-20 w-72 shrink-0
          bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white/5 rounded-3xl
          transform transition-transform duration-300 ease-in-out flex flex-col
          md:translate-x-0 h-[calc(100vh-6rem)]
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-3 mb-8 px-2">
              <div className="w-8 h-8 flex items-center justify-center font-bold text-white text-lg">
              <Image
                src="/logo_trindade.png"
                width={40}
                height={40}
                alt="Logo TRP"
                className='rounded-md'
              />
              </div>
              <div>
                  <span className="font-bold text-lg text-white tracking-wide block leading-none">
                    Trindade
                    <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase ml-1">
                      Docs
                    </span>
                  </span>
              </div>
            </div>

            <div className="relative mb-8 group">
              <Search className="absolute left-3 top-3 text-gray-500 group-focus-within:text-white transition-colors" size={16} />
              <input 
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const first = filteredMenuItems[0]?.items[0];
                    if (first) {
                      updateTab(first.id);
                      setSearchQuery('');
                      searchInputRef.current?.blur();
                    }
                  } else if (e.key === 'Escape') {
                    setSearchQuery('');
                    searchInputRef.current?.blur();
                  }
                }}
                type="text" 
                placeholder="Buscar..." 
                className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:bg-white/10 focus:border-white/10 transition-all placeholder:text-gray-600"
              />
              <div className="absolute right-3 top-2.5 text-[0.65rem] font-bold text-gray-600 border border-white/10 px-1.5 py-0.5 rounded bg-black/20">Ctrl + Q</div>
            </div> 

            <nav className="space-y-8">
              {filteredMenuItems.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-3 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-900"></span>
                    {section.category}
                  </h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <button 
                          onClick={() => updateTab(item.id)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-left duration-200 group
                            ${activeTab === item.id
                              ? 'bg-linear-to-r from-red-900/20 to-transparent text-white border-l-2 border-red-600' 
                              : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}
                          `}
                        >
                          <span className={`transition-colors ${activeTab === item.id ? 'text-red-500' : 'text-gray-600 group-hover:text-gray-400'}`}>
                            {item.icon}
                          </span>
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-white/5 bg-black/20">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">
                  <Image 
                    src="/logoSentra.png"
                    width={40}
                    height={40}
                    alt="Logo TRP"
                  />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-400">Powered by 
                      <span className="font-extrabold"> Sentra </span>
                    </span>
                </div>
             </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 bg-neutral-950 border border-white/5 rounded-3xl relative shadow-2xl">
          <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-20">
            <span className="font-bold text-white">Documentação</span>
            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-400 p-2 hover:bg-white/10 rounded-lg">
              <Menu size={20} />
            </button>
          </div>

          <main className="flex-1">
            {getActiveContent()}
          </main>
        </div>

      </div>
    </div>
  );
}