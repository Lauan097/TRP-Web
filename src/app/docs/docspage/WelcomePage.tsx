'use client';

import Link from 'next/link';
import { Book, ArrowRight, HelpCircle } from 'lucide-react';
import { FaDiscord, FaInstagram, FaYoutube, FaUserSecret } from "react-icons/fa";
import { MdOutlineAutorenew } from "react-icons/md";

export default function DocsWelcome() {
  
  const quickLinks = [
    {
      title: "Comece por aqui",
      description: "Entenda o propósito da organização no servidor.",
      icon: <Book size={24} className="text-white" />,
      href: "/docs?page=about",
      color: "bg-blue-600"
    },
    {
      title: "Recrutamento",
      description: "Passo a passo para se tornar um membro oficial da Máfia.",
      icon: <FaUserSecret size={24} className="text-black" />,
      href: "/docs?page=recruitment",
      color: "bg-gray-200"
    },
    {
      title: "Recadastramento",
      description: "Clique aqui para entender como funciona o recadastramento.",
      icon: <MdOutlineAutorenew size={24} className="text-white" />,
      href: "/docs?page=re-recruitment",
      color: "bg-neutral-600"
    }
  ];

  const socials = [
    { name: "Discord", icon: <FaDiscord size={20} />, href: "https://discord.gg/gNsut7bUsz" },
    { name: "Youtube", icon: <FaYoutube size={20} />, href: "https://www.youtube.com/channel/UC7tvp174iqf9NaqtDtMSLlg" },
    { name: "Instagram", icon: <FaInstagram size={20} />, href: "https://www.instagram.com" }
  ];

  return (
    <div className="bg-neutral-950 w-full max-w-5xl mx-auto px-6 py-12 md:py-20 animate-fade-in text-gray-300">
      
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Bem-vindo à Documentação
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed max-w-4xl border-l-4 border-red-600 pl-6">
          Aqui você encontrará tudo o que precisa para sua jornada na 
          <span className="text-red-500 font-semibold mx-1">Máfia Trindade Penumbra</span>. 
          Navegue pelos guias abaixo para aprender sobre nossos sistemas, regras, processos e eventos.
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">
          Acesso Rápido
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((link, idx) => (
            <Link 
              key={idx} 
              href={link.href}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-lg ${link.color}`}>
                  {link.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {link.description}
                </p>
              </div>
              
              <div className="mt-6 flex items-center text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0">
                Acessar <ArrowRight size={16} className="ml-2" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="pt-10 border-t border-white/5 gap-12">
        <h1 className="text-4xl font-bold text-gray-200 mb-6 md:mb-6">
          🟢 Recadastramento <span className='text-green-500'>On</span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
          Já é membro da Trindade mas não está conseguindo acessar o site? Faça o recadastramento para atualizar suas informações 
          e garantir seu acesso contínuo à nossa comunidade.
        </p>

        <Link href="/docs?page=re-recruitment" 
          className="inline-flex items-center text-sm font-medium text-green-500 hover:text-green-400 transition-colors mt-6"
        >
          Realizar Recadastramento <ArrowRight size={14} className="ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5 mt-10">
        <div>
          <h3 className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <HelpCircle size={20} className="text-red-500" />
            Precisa de ajuda?
          </h3>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">
            Se você não encontrou o que procurava na documentação, fale com um gerente via Discord.
          </p>
          <a href="https://discord.com/channels/1295702106195492894/1445236701210349608" className="inline-flex items-center text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
            Acessar Discord <ArrowRight size={14} className="ml-1" />
          </a>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-3">
            Nossas Redes
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Acompanhe as novidades e anúncios oficiais.
          </p>
          <div className="flex gap-3">
            {socials.map((social, idx) => (
              <a 
                key={idx}
                href={social.href}
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/10 transition-all"
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}