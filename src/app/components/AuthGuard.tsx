'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, createContext, useContext } from 'react';
import { API_BASE_URL } from '@/utils/constants';

interface AuthContextType {
  isVerified: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ isVerified: false, isLoading: true });

export const useAuth = () => useContext(AuthContext);

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (status === 'loading') return;

      if (!session) {
        setIsVerified(false);
        setIsLoading(false);
        if (pathname !== '/register') {
          router.push('/register');
        }
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/site/recruitment/status?user_id=${session.user?.id}`, {
          headers: {
            'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
          }
        });
        const data = await res.json();
        const isMember = data.userStatus?.status === 'APPROVED_PRACTICAL';
        const isSpecial = data.isSpecial;
        
        const isAdmin = session.isAdmin;

        const hasAccess = isMember || isSpecial || isAdmin;

        setIsVerified(hasAccess);
        
        if (!hasAccess) {
          // Allow access to re-register if legacy member or veteran
          if (pathname === '/re-register') {
            try {
              const legRes = await fetch(`${API_BASE_URL}/api/site/recruitment/legacy-profile?user_id=${session.user?.id}`, {
                headers: {
                  'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
                }
              });
              const legData = await legRes.json();
              
              if (legData.found) {
                 setIsLoading(false);
                 return;
              }
            } catch (err) {
              console.error('Legacy auth check failed', err);
            }
          }

          console.log(
            '%c🚫 ACESSO RESTRITO\n%cVocê precisa ser um membro verificado da Trindade para acessar este conteúdo.',
            'color: #ff0000; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 0px #000;',
            'color: #ffffff; font-size: 16px; background-color: #330000; padding: 4px; border-radius: 4px;'
          );
          
          if (pathname !== '/register') {
            router.push('/register');
          }
        } /* else {
          console.log('%c✅ Acesso concedido. Bem-vindo à Trindade!', 'color: #00ff00; font-size: 16px; font-weight: bold; text-shadow: 1px 1px 0px #000;');
        } */
      } catch (error) {
        console.error('Auth check failed', error);
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [session, status, pathname, router]);

  if (isLoading && pathname !== '/register') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          <span className="text-gray-400 text-sm animate-pulse">Verificando acesso...</span>
        </div>
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={{ isVerified, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
