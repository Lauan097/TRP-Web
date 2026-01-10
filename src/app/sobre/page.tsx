import Link from "next/link";
import Image from "next/image";
import { FaArrowLeft, FaShieldAlt, FaBalanceScale, FaCoins } from "react-icons/fa";


export default function Sobre() {
  return (
    <main className="min-h-screen flex items-start justify-center px-4 pt-24 pb-12 md:pt-32 mb-20">
      <section className="max-w-6xl w-full bg-[#05050557] bg-opacity-60 backdrop-blur-md rounded-4xl p-6 md:p-16 shadow-2xl border border-white/5 animate-in slide-in-from-top-2 duration-700">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <Link 
            href="/" 
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
            <span>Voltar ao Início</span>
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-sans font-extrabold text-white text-right drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            NOSSO <span className="text-gray-500">LEGADO</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed font-light">
            <h2 className="text-3xl font-bold text-white mb-4 border-l-4 border-gray-600 pl-4">
              Das Sombras para o Controle
            </h2>
            <p>
              A <strong className="text-white">Trindade Penumbra</strong> não nasceu do dia para a noite. Surgimos da necessidade de ordem em meio ao caos da cidade. Enquanto outros brigam por migalhas nas esquinas, nós estruturamos um império.
            </p>
            <p>
              Operamos no silêncio. Nossa força não está apenas no calibre das nossas armas, mas na inteligência das nossas estratégias. Se você vê a Trindade agindo, provavelmente já é tarde demais.
            </p>
          </div>
          
          <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-lg aspect-video bg-black/40">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/banner_02.png"
                alt="Imagem Sobre o Legado"
                width={640}
                height={360}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 transition-all duration-500 rounded-2xl pointer-events-none" />
          </div>
        </div>

        <div className="mb-24">
          <h3 className="text-center text-2xl md:text-3xl font-bold text-white mb-10 font-sans tracking-widest uppercase opacity-80">
            Os Pilares da Família
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/30 p-8 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 group">
              <FaShieldAlt className="text-4xl text-gray-400 mb-4 group-hover:text-white transition-colors" />
              <h4 className="text-xl font-bold text-white mb-2">Lealdade</h4>
              <p className="text-gray-400 text-sm">O sangue une, mas a lealdade mantém. Traição é a única falha sem perdão dentro da nossa hierarquia.</p>
            </div>
            <div className="bg-black/30 p-8 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 group">
              <FaBalanceScale className="text-4xl text-gray-400 mb-4 group-hover:text-white transition-colors" />
              <h4 className="text-xl font-bold text-white mb-2">Disciplina</h4>
              <p className="text-gray-400 text-sm">Não somos uma gangue de rua desorganizada. Seguimos ordens, mantemos a postura e executamos com precisão.</p>
            </div>
            <div className="bg-black/30 p-8 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 group">
              <FaCoins className="text-4xl text-gray-400 mb-4 group-hover:text-white transition-colors" />
              <h4 className="text-xl font-bold text-white mb-2">Negócios</h4>
              <p className="text-gray-400 text-sm">O controle do capital é o controle da cidade. Dominamos rotas, lavagem e comércio de alto risco.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 md:order-1 relative group rounded-2xl overflow-hidden border border-white/10 shadow-lg aspect-4/3 bg-black/40">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image 
                src="/banner_01.png" 
                alt="Imagem Sobre o Legado" 
                width={904} 
                height={692} 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>

          <div className="order-1 md:order-2 space-y-6 text-lg text-gray-300 leading-relaxed font-light text-right">
            <h2 className="text-3xl font-bold text-white mb-4 border-r-4 border-gray-600 pr-4">
              Poder Bélico e Automotivo
            </h2>
            <p>
              Para manter a paz, preparamo-nos para a guerra. Nossa frota é padronizada e nossos membros são treinados constantemente para situações de alto risco.
            </p>
            <p>
              Não ostentamos por vaidade, mas para demonstrar que em nosso território, quem dita as regras somos nós.
            </p>
          </div>
        </div>

        <div className="text-center pt-10 border-t border-white/10">
          <h2 className="text-2xl text-white mb-6 font-semibold">Convide um amigo para a Família!</h2>
          <p className="text-sm text-white mb-6">
            Verifique se o recrutamento está aberto, se ele está pronto para o compromisso e direcione-o a página de recrutamento.
          </p>
        </div>

      </section>
    </main>
  );
}