"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa";
import { MdFileCopy } from "react-icons/md";
import { RiAlertLine } from "react-icons/ri";
import { useToast } from "../components/ToastContext";

export default function Profile() {
  const { data: session } = useSession();
  const { addToast } = useToast();

  const handleCopyEmail = () => {
    if (session?.user?.email) {
      navigator.clipboard.writeText(session.user.email);
      addToast("Email copiado!", "success");
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">

            <div className="shrink-0">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-red-600/20 shadow-lg ring-2 ring-red-900/40">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-gray-500 font-bold text-3xl">
                    {session?.user?.name?.charAt(0) || "?"}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">

              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Olá, {session?.user?.name || "Usuário"}
                </h1>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs text-neutral-400 font-mono">
                  <FaDiscord className="mr-2 text-[#6974f3]" /> {session?.user?.id || "N/A"}
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs text-neutral-400 font-mono ml-2">
                  <FcGoogle className="mr-2" /> 
                  {session?.user?.email || "N/A"}
                  <MdFileCopy 
                    className="ml-3 cursor-pointer hover:text-white transition-colors"
                    onClick={handleCopyEmail}
                    title="Copiar email"
                  />
                </div>
              </div>

              <p className="text-sm text-neutral-400 font-medium mt-8">
                É uma grande honra ter você conosco! La Famiglia è per sempre.
              </p>

            </div>
            <div className="flex justify-end w-full md:w-auto">
              <Image 
                src="/logotrindade_tpr.png"
                alt="Logo Trindade TPR"
                width={180}
                height={170}
                className="opacity-20"
              />
            </div>
          </div>

          <hr className="my-8 border-neutral-800" />

          <div className="max-w-fit mx-auto">
            <div className="bg-neutral-800 border border-yellow-500/20 rounded-lg p-4 text-center">
              <div className="text-red-200 font-medium inline-flex items-center gap-1.5">
                <RiAlertLine className="text-yellow-500 -mt-0.5" /> Atualizações de Perfil em Breve!
              </div>
              <p className="text-sm text-yellow-300/60 mt-1">
                Estamos trabalhando para trazer novas funcionalidades e estatísticas detalhadas.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}