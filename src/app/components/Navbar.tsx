"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { API_BASE_URL } from '@/utils/constants';
// Ícones
import { FaFileAlt, FaBookOpen } from "react-icons/fa";
import { FaBan, FaDiscord, FaArrowRight } from "react-icons/fa6";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoChevronDown, IoLogOutOutline, IoBriefcaseSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";


import { useAuth } from "./AuthGuard";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const [dropdownUserOpen, setDropdownUserOpen] = useState(false);
  const [align, setAlign] = useState<'center' | 'end'>('center');
  const userButtonRef = useRef<HTMLDivElement>(null);
  const [hasSpecialRole, setHasSpecialRole] = useState(false);

  const { data: session } = useSession();
  const { isVerified } = useAuth();

  useEffect(() => {
    const checkSpecialRole = async () => {
      if (!session?.user?.id) return;
      
      try {
        const res = await fetch(`${API_BASE_URL}/api/site/recruitment/status?user_id=${session.user.id}`, {
          headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '' },
          cache: 'no-store'
        });
        const data = await res.json();
        setHasSpecialRole(data.isSpecial === true);
      } catch (error) {
        console.error('Failed to check special role', error);
      }
    };

    checkSpecialRole();
  }, [session]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    if (dropdownUserOpen && userButtonRef.current) {
      requestAnimationFrame(() => {
        if (!userButtonRef.current) return;
        const rect = userButtonRef.current.getBoundingClientRect();
        const menuWidth = 192;
        const halfMenu = menuWidth / 2;
        const centerPos = rect.left + (rect.width / 2);
        const newAlign = (centerPos + halfMenu > window.innerWidth - 10) ? 'end' : 'center';
        setAlign((prevAlign) => {
          if (prevAlign !== newAlign) return newAlign;
          return prevAlign;
        });
      });
    }
  }, [dropdownUserOpen]);

  const redStyle = 'flex items-center px-4 py-2.5 hover:bg-red-500/20 transition text-red-400 font-semibold border-b border-white/5';
  const grayStyle = 'flex items-center px-4 py-2.5 hover:bg-white/15 transition text-gray-300 font-semibold hover:text-white';

  return (
    <>
      <nav className="bg-[#00000063] backdrop-blur-md not-visited:sticky top-0 z-40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex items-center space-x-2.5 z-50">
              <Image src="/logo_trindade.png" alt="Logo" width={30} height={30} className='rounded-full' />
              {isVerified ? (
                <Link href="/" className="text-lg font-bold tracking-wider text-white">Trindade</Link>
              ) : (
                <span className="text-lg font-bold tracking-wider text-white">Trindade</span>
              )}
            </div>

            <div className="hidden md:flex space-x-3 text-md items-center">
              {isVerified && (
                <>
                  <Link href="/" className="py-1.5 px-2.5 hover:bg-[#5a5a5a7e] transition-colors rounded-md text-gray-200 hover:text-white">Início</Link>

                  <div className="relative group"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button className={`flex items-center space-x-1 transition-colors px-2.5 py-1.5 rounded-md text-gray-200 hover:text-white ${dropdownOpen ? 'bg-[#5a5a5a7e]' : 'hover:bg-[#5a5a5a7e]'}`}>
                      <span>Informações</span>
                      <IoChevronDown className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {dropdownOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48">
                        <div className="relative bg-black  border border-neutral-700 rounded-lg shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                          
                          <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
                            <Image src="/caveiraLogo.jpg" alt="" width={120} height={120} className="opacity-50 object-contain translate-y-3" />
                          </div>

                          <div className="relative z-10">
                            <hr className="border-white/5 mx-3" />

                            <Link href="/rules" className={grayStyle}>Regras <FaBookOpen className="ml-auto text-gray-400" /></Link>
                            <Link href="/services" className={grayStyle}>Serviços <IoBriefcaseSharp className="ml-auto text-gray-400" /></Link>
                            <Link href="/docs" className={grayStyle}>Documentação <FaFileAlt className="ml-auto text-gray-400" /></Link>
                            <Link href="/reports" className={redStyle}>Denúncias <FaBan className="ml-auto text-red-400" /></Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Link href="/sobre" className="py-1.5 px-2.5 hover:bg-[#5a5a5a7e] transition-colors rounded-md text-gray-200 hover:text-white">Sobre</Link>
                </>
              )}

              {session ? (
                <div 
                  className="relative"
                  ref={userButtonRef}
                  onMouseEnter={() => setDropdownUserOpen(true)} 
                  onMouseLeave={() => setDropdownUserOpen(false)}
                >
                  <div className={`py-1.5 px-2.5 flex items-center transition-colors rounded-md ${dropdownUserOpen ? 'bg-[#5a5a5a7e]' : 'hover:bg-[#5a5a5a7e]'}`}>
                    <Image src={session.user?.image || "/logo_trindade.png"} alt="User" width={30} height={30} className="rounded-full border border-white/10" />
                    <IoChevronDown className={`transition-transform duration-200 ml-2 text-gray-400 ${dropdownUserOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {dropdownUserOpen && (
                    <div className={`absolute top-full pt-2 w-48 z-50 ${align === 'center' ? 'left-1/2 -translate-x-1/2' : 'right-0'}`}> 
                      <div className="relative bg-black border border-[#333] rounded-lg shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                        
                        <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
                          <Image src="/caveiraLogo.jpg" alt="" width={90} height={110} className="opacity-50 object-contain translate-y-3" />
                        </div>

                        <div className="relative z-10">
                          {isVerified && (
                            <>
                              <Link href="/profile" className={grayStyle}>Meu Perfil <CgProfile className="ml-auto opacity-70" /></Link>
                              {(session.isAdmin || hasSpecialRole) && (
                                <Link href="/dashboard" className={grayStyle}>Dashboard <LuLayoutDashboard className="ml-auto opacity-70" /></Link>
                              )}
                            </>
                          )}
                          <button onClick={() => signOut()} className={`${redStyle} mx-auto w-full cursor-pointer`}> 
                            Sair <IoLogOutOutline className="ml-auto" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => signIn('discord')} className="bg-[#5865F2] text-white px-3 py-1.5 rounded-md hover:bg-[#4752C4] transition-all flex items-center shadow-lg shadow-[#5865F2]/20 font-medium text-sm cursor-pointer">
                  <FaDiscord className="mr-2 text-lg" /> Login
                </button>
              )}
            </div>

            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50 relative"
            >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
          </div>
        </div>
      </nav>

      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-99 flex flex-col items-center justify-center bg-[#050505]/65 backdrop-blur-xl transition-all duration-300 ease-in-out md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="flex flex-col items-center w-full max-w-xs px-4 animate-in slide-in-from-bottom-8 duration-500"
        >
          
          <div className="flex flex-col items-center gap-2 mb-5">
            <div className="p-1 rounded-full border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <Image src="/logo_trindade.png" alt="Logo" width={60} height={60} className="rounded-full" />
            </div>
            <span className="font-sans font-bold text-xl text-white tracking-[0.15em] uppercase">Trindade</span>
            <hr className="w-16 border-white/20" />
          </div>

          {isVerified && (
            <nav className="flex flex-col items-center w-full gap-2 text-sm">
              {[
                { label: 'Início', href: '/' },
                { label: 'Sobre Nós', href: '/sobre' },
                { label: 'Regras', href: '/rules' },
                { label: 'Documentação', href: '/docs' },
                { label: 'Serviços', href: '/services' }
              ].map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white hover:scale-105 transition-all font-medium py-1.5 px-4 rounded-full hover:bg-white/5 w-full text-center"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="w-full mt-6">
            {session ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                   <Image 
                    src={session.user?.image || "/logo_trindade.png"} 
                    alt="User" 
                    width={32} height={32} 
                    className="rounded-full" 
                  />
                  <span className="text-white font-semibold text-sm">{session.user?.name}</span>
                </div>
                
                <div className="flex gap-3 w-full justify-center">
                  {isVerified && (
                    <Link 
                      href="/profile"
                      onClick={() => setIsOpen(false)} 
                      className="text-xs text-gray-300 hover:text-white underline underline-offset-4"
                    >
                      Meu Perfil
                    </Link>
                  )}
                  <button 
                    onClick={() => { setIsOpen(false); signOut(); }}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    Sair <IoLogOutOutline />
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => { setIsOpen(false); signIn('discord'); }} 
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-2 px-6 rounded-full transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2 mx-auto text-sm"
              >
                Login <FaArrowRight className="text-xs" />
              </button>
            )}
          </div>

        </div>
      </div>
    </>
  );
}