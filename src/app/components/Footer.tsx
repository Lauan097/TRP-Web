'use client';

import Link from "next/link";
import Image from "next/image";
import { FaDiscord, FaInstagram, FaYoutube } from "react-icons/fa";
import { useToast } from "@/app/components/ToastContext";
import { useAuth } from "./AuthGuard";

export default function Footer() {
  const { isVerified } = useAuth();
  const currentYear = new Date().getFullYear();
  const { addToast } = useToast();

  if (!isVerified) return null;

  return (
    <footer className="w-full border-t border-white/10 bg-black/30 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8 text-center md:text-left">
          
          <div className="col-span-1 space-y-4 flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-3 group justify-center md:justify-start">
              <div className="relative w-12 h-12 overflow-hidden rounded-full border border-white/20 group-hover:border-white/50 transition-colors">
                <Image 
                  src="/logo_trindade.png" 
                  alt="Logo Trindade" 
                  fill 
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold font-sans text-white tracking-wider">
                TRINDADE
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Dominando as sombras do Legacy.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 font-sans tracking-wider border-b border-white/10 pb-2 inline-block">
              NAVEGAÇÃO
            </h3>
            <ul className="space-y-2 text-sm text-gray-400 flex flex-col items-center md:items-start">
              <li>
                <Link href="/" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <a href="/rules" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Regras
                </a>
              </li>
              <li>
                <Link onClick={() => addToast('Página em desenvolvimento!', 'info')} href="" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Status
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 font-sans tracking-wider border-b border-white/10 pb-2 inline-block">
              COMUNIDADE
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="https://discord.gg/gNsut7bUsz" target="_blank" className="hover:text-[#5865F2] hover:translate-x-1 transition-all inline-block">
                  Nosso Discord
                </Link>
              </li>
              <li>
                <Link href="https://discord.gg/rplegacy" target="_blank" className="hover:text-pink-500 hover:translate-x-1 transition-all inline-block">
                  Legacy RP
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Área de Denúncias
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 font-sans tracking-wider border-b border-white/10 pb-2 inline-block">
              ACOMPANHE
            </h3>
            <div className="flex gap-4 justify-center md:justify-start">
              <a 
                href="https://discord.gg/gNsut7bUsz" 
                target="_blank" 
                className="bg-white/5 p-3 rounded-lg text-gray-400 hover:bg-[#5865F2] hover:text-white transition-all hover:scale-110"
                aria-label="Discord"
              >
                <FaDiscord size={20} />
              </a>
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                className="bg-white/5 p-3 rounded-lg text-gray-400 hover:bg-linear-to-tr hover:from-yellow-500 hover:via-red-500 hover:to-purple-500 hover:text-white transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a 
                href="https://www.youtube.com/channel/UC7tvp174iqf9NaqtDtMSLlg" 
                target="_blank" 
                className="bg-white/5 p-3 rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition-all hover:scale-110"
                aria-label="YouTube"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 text-center">
          <p>
            &copy; {currentYear} Trindade Penumbra. Todos os direitos reservados.
          </p>
          <p className="font-semibold">
            Powered by <Image src="/logoSentra.png" alt="Logo Sentra" width={20} height={20} className="inline-block ml-1 object-contain" /> <span className="font-extrabold">Sentra</span>
          </p>
        </div>
      </div>
    </footer>
  );
}