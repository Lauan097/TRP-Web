import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { ArrowRight } from 'lucide-react';
import { LuOctagonAlert } from "react-icons/lu";
import { MdOutlineContentCopy } from "react-icons/md";

export default function ReRecruiterPage() {

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    const text = 'https://trindadep.discloud.app/re-register';
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Erro ao copiar o link', err);
    }
  };

  return (
    <section className="relative rounded-2xl min-h-screen bg-neutral-950 text-gray-300 font-sans selection:bg-red-900 selection:text-white overflow-hidden flex flex-col">
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20 md:px-12 w-full">

        <div className="items-center gap-2 text-xs text-red-500 font-medium mb-6 bg-[#0a0a0a]/50 inline-flex px-3 py-1 rounded-full border border-red-500/20">
          <span>Docs</span>
          <span><IoIosArrowForward /></span>
          <span>Recrutamento</span>
          <span><IoIosArrowForward /></span>
          <span className="text-gray-400">Recadastramento</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 mt-6">
          Recadastramento
        </h1>
        <p className="mb-12">
          Veja como estar realizando o seu recadastramento no novo sistema da <span className="text-red-500 font-semibold">Trindade Penumbra</span>.
        </p>

        <hr className='bg-gray-600/40 border-0 h-px mb-12' />

        <h2 className="text-4xl md:text-4xl font-bold text-white mb-6 mt-6">
          Pra que serve o Recadastramento?
        </h2>
        <p>
          O recadastramento é uma etapa essencial para garantir que
          <span className="text-green-500 font-semibold"> todos os membros </span>
          estejam com suas informações atualizadas e em conformidade com as novas diretrizes da organização. 
          Ao realizar o recadastramento, você assegura seu acesso contínuo aos recursos, eventos e benefícios oferecidos pela Família.
        </p>

        <hr className='bg-gray-600/40 border-0 h-px mt-12 mb-12' />

        <h2 className="text-4xl font-bold text-white mb-8">
          Como realizar o Recadastramento?
        </h2>
        <p className="text-lg text-gray-400 leading-relaxed mb-12 border-l-4 border-green-600 pl-6">
          A etapa de recadastramento é bem simples, você só precisa acessar o link abaixo e seguir os passos indicados.
          <br />
          <span className="text-white font-mono text-sm bg-black flex items-center w-fit p-4 rounded-lg mt-2 border border-gray-500/20">
            https://trindadep.discloud.app/re-register
            <button
              type="button"
              onClick={copyToClipboard}
              aria-label="Copiar link"
              className="inline ml-6 cursor-pointer"
            >
              <MdOutlineContentCopy size={16} className="text-green-500" />
            </button>
            {copied && <span className="ml-3 text-green-400 font-semibold font-sans">Copiado!</span>}
          </span>
        </p>

        <h2 className="text-3xl font-bold text-white mb-4 mt-12">
          Após acessar o endereço
        </h2>
        <p className="text-lg text-gray-400 leading-relaxed mb-4">
          Você deverá seguir os seguintes passos para garantir o seu recadastramento:
        </p>
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-500 text-xs font-bold font-mono">1</span>
              <span>Ter em mãos as suas informações do jogo.</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-500 text-xs font-bold font-mono">2</span>
              <span>Preencher o formulário de recadastramento.</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-500 text-xs font-bold font-mono">3</span>
              <span>Enviar o formulário de recadastramento.</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 p-4 rounded-2xl bg-linear-to-r from-red-900/10 to-transparent border border-white/5">
          <h4 className="text-red-500 font-bold mb-2 flex items-center"><LuOctagonAlert className="mr-1" />Nota</h4>
          <p className="text-sm text-gray-400 mb-4">
            Insira seu Nome e ID juntos, sem a inicial <span className="text-red-500 font-semibold">TRP »</span> , ele deve ficar no formato 
            <span className="text-green-400 font-mono"> Nome (ID)</span>.
          </p>
        </div>

        <hr className='bg-gray-600/40 border-0 h-px mt-12 mb-12' />

        <h2 className="text-4xl md:text-4xl font-bold text-white mb-6 mt-6">
          <span className="text-red-500">Problemas </span> que você pode encontrar
        </h2>
        <p>
          Durante o processo de recadastramento, você pode encontrar alguns problemas comuns. Aqui estão algumas soluções para esses problemas:
        </p>

        <div className="w-full py-8">
          <div className="space-y-4">
            <div className="bg-zinc-900 rounded-lg p-5 border-l-4 border-red-600 flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Erro de acesso
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-mono">NO_DATA_FOUND</span>
                </h3>
                  <p className="text-gray-400 text-sm mt-1">Não estou conseguindo acessar o formulário.</p>
              </div>

              <div className="bg-black/40 p-3 rounded text-sm text-gray-200 md:max-w-xs border border-zinc-700">
                <span className="text-green-400 font-bold">Solução: </span> 
                Refaça o processo de Login (Clique em <span className="text-red-400 font-bold">Sair</span> e entre novamente).
              </div>

            </div>

            <div className="bg-zinc-900 rounded-lg p-5 border-l-4 border-orange-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div>
                <h3 className="text-lg font-bold text-white">Navegação travada</h3>
                <p className="text-gray-400 text-sm mt-1">Não consigo acessar outras páginas após o cadastro.</p>
              </div>

              <div className="bg-black/40 p-3 rounded text-sm text-gray-200 md:max-w-xs border border-zinc-700">
                <span className="text-green-400 font-bold">Solução: </span> 
                Pressione <kbd className="bg-zinc-700 px-1 rounded text-xs">CTRL + R</kbd>. Se não funcionar, refaça o login.
              </div>

            </div>

            <div className="bg-zinc-900 rounded-lg p-5 border-l-4 border-blue-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div>
                <h3 className="text-lg font-bold text-white">Dados antigos ausentes</h3>
                <p className="text-gray-400 text-sm mt-1">Minhas informações antigas não aparecem.</p>
              </div>

              <div className="bg-black/40 p-3 rounded text-sm text-gray-200 md:max-w-xs border border-zinc-700">
                <span className="text-blue-400 font-bold">Nota: </span> 
                Isso é normal se você não possui registro no sistema. Apenas preencha e envie.
              </div>

            </div>
          </div>
        </div>

        <p>
          Se nenhuma dessas soluções funcionar pra você ou encontrar algum outro problema que não esteja listado aqui, entre em contato 
          com um Gerente via Discord para obter assistência personalizada.
        </p>
        <a href="https://discord.com/channels/1295702106195492894/1445236701210349608" 
          className="inline-flex items-center text-sm font-medium text-red-400 hover:text-red-300 transition-colors mt-8"
        >
          Acessar Discord <ArrowRight size={14} className="ml-1" />
        </a>

        <hr className='bg-gray-600/40 border-0 h-px mt-12 mb-12' />

        <h2 className="text-4xl md:text-4xl font-bold text-green-400 mb-6 mt-6">
          Conclusão
        </h2>
        <p>
          Após completar o recadastramento, você estará apto a acessar todos os recursos e benefícios do site da
          <span className="text-red-500 font-semibold"> Trindade Penumbra</span>. Bem-vindo de volta à nossa comunidade!
        </p>


      </div>
    </section>
  );
}