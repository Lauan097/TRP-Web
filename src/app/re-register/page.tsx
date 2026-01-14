'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CustomBorderInput from '../components/CustomBorderInput';
import CustomSelectMenu from '../components/embeds/CustomSelectMenu';
import { Button } from '@/components/ui/button';
import { useToast } from "@/app/components/ToastContext";
import { Loader2, User, Phone, Backpack, Shield, X } from 'lucide-react';
import { FaDiscord, FaOrcid, FaCheckCircle } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";

interface LegacyProfile {
  user_name: string;
  user_id: string;
  user_game_id: string;
  user_telephone: string;
  user_shift: string;
  approver_nick: string;
};

const SHIFT_ROLE_MAP: Record<string, { name: string; color: string; bg?: string }> = {
  '1447988476237709392': { name: '@ Manhã', color: 'text-yellow-400', bg: 'bg-yellow-500/12' },
  '1447988532932120588': { name: '@ Tarde', color: 'text-orange-400', bg: 'bg-orange-500/12' },
  '1447988583217758318': { name: '@ Noite', color: 'text-blue-400', bg: 'bg-blue-500/12' },
};

export default function ReRegisterPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<LegacyProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [nomeJogo, setNomeJogo] = useState('');
  const [identificacao, setIdentificacao] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nomeMembro, setNomeMembro] = useState('');
  const [idMembro, setIdMembro] = useState('');
  const [turnos, setTurnos] = useState<string[]>([]);
  const [turnosError, setTurnosError] = useState('');
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500';

  function extractNameAndId(text: string): { name: string; id: string } {
    const match = text.match(/^(.+?)\s*\[(\d{1,6})\]$/);
    if (match) {
      return { name: match[1].replace(/^TRP\s*»\s*/, '').trim(), id: match[2] };
    }
    return { name: text, id: '' };
  }

  const checkLegacy = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/site/recruitment/legacy-profile?user_id=${userId}`);
      const data = await res.json();
      
      if (data.found) {
        setProfile(data.profile);

        const { name: playerName, id: playerId } = extractNameAndId(data.profile.user_name || '');
        setNomeJogo(playerName);
        setIdentificacao(data.profile.user_game_id || playerId);
        setTelefone(data.profile.user_telephone || '');
        
        const { name: approverName, id: approverId } = extractNameAndId(data.profile.approver_nick || '');
        setNomeMembro(approverName || 'Padrinho');
        setIdMembro(approverId || '777');
      } else {
        if (data.reason === 'ALREADY_REGISTERED') {
           router.push('/');
           return;
        }
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      addToast('Erro ao verificar perfil antigo', 'error');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, addToast, router]);

  useEffect(() => {
    // @ts-expect-error Session type extension not picked up here
    if (session?.isMember) {
      router.push('/');
      return;
    }

    if (session?.user?.id && !profile) {
      checkLegacy(session.user.id);
    } else if (session === null) {
      router.push('/');
    } else if (session?.user?.name && !loading && !profile) {
      const { name, id } = extractNameAndId(session.user.name);
      setNomeJogo(name);
      setIdentificacao(id);
      setNomeMembro('Padrinho');
      setIdMembro('777');
    }
  }, [session, router, checkLegacy, profile, loading]);

  function normalizeString(input?: string | null) {
    if (!input) return '';
    return input
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .trim();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    if (turnos.length === 0) {
      setTurnosError('Selecione pelo menos um turno/cargo');
      addToast('Por favor, selecione um turno/cargo', 'error');
      return;
    }

    setSubmitting(true);
    try {


      const normalizedFormData = {
        nomeJogo: normalizeString(nomeJogo),
        identificacao: normalizeString(identificacao),
        telefone: normalizeString(telefone),
        nomeMembro: normalizeString(nomeMembro),
        idMembro: normalizeString(idMembro),
        turnos: turnos
      };

      const res = await fetch(`${apiUrl}/api/site/recruitment/legacy-apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: session.user.id,
          accessToken: session.accessToken,
          formData: normalizedFormData
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        addToast('Migração realizada com sucesso!', 'success');
        
        await update();
        
        router.push('/');
      } else {
        addToast(data.error || 'Erro ao realizar migração', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Erro de conexão', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-gray-400 text-sm">
        <Loader2 className="animate-spin text-red-600 w-12 h-12 mr-2" />
        Verificando seus dados...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center mx-auto">
        <div className="bg-[#111] border border-[#222] p-8 rounded-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h1>
          <p className="text-gray-400 mb-6 font-medium">
            Você não possui um registro de membro antigo em nossa base de dados.
            Por favor, utilize o processo normal de recrutamento ou contate a Gerência.
          </p>
          <Button onClick={() => router.push('/register')} className="bg-red-600 hover:bg-red-700 w-full cursor-pointer">
            Ir para Cadastro
          </Button>
          <p className="text-xs text-gray-500 mt-8 font-mono select-text bg-black border border-gray-900/30 rounded-sm p-1 inline-block" aria-hidden="true">NO_DATA_FOUND</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-red-600 to-red-900 mb-4">
            Atualização Cadastral
          </h1>
          <p className="text-gray-400 text-md font-medium bg-[#111] border border-red-900/30 rounded-xl p-2 inline-block">
            Bem-vindo de volta! Como membro veterano, precisamos apenas que valide seus dados para migrar para o novo sistema.
          </p>
        </div>

        <div className="bg-[#111] border border-red-900/30 rounded-xl p-8 mb-8 shadow-[0_0_50px_-12px_rgba(220,38,38,0.1)]">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <Shield className="text-red-600 w-6 h-6" />
            <h2 className="text-2xl font-semibold text-white">Seus Dados Antigos</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard icon={<User />} label="Nome em Jogo" value={nomeJogo} />
            <InfoCard icon={<FaOrcid />} label="ID em Jogo" value={identificacao} />
            <InfoCard icon={<Phone />} label="Telefone" value={profile.user_telephone} />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard icon={<FaCheckCircle />} label="Nome do Indicador" value={nomeMembro} />
            <InfoCard icon={<FaDiscord />} label="ID do Indicador" value={idMembro} />
          </div>

          <div className="mt-6 text-sm">
            <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-lg flex items-start gap-4 hover:border-red-900/50 transition-colors group">
              <div className="p-3 bg-[#111] rounded-lg text-gray-500 group-hover:text-red-500 transition-colors">
                <Backpack />
              </div>
              <div className="flex-1">
                <span className="block text-gray-500 text-sm mb-1">Turno/Cargo</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.user_shift?.split(',').map((id, idx) => {
                    const shift = SHIFT_ROLE_MAP[id.trim()];
                    return shift ? (
                      <span key={idx} className={`px-3 py-0.5 rounded-md font-medium ${shift.color} ${shift.bg}`}>
                        {shift.name}
                      </span>
                    ) : (
                      <span key={idx} className="text-white">{id}</span>
                    );
                  }) || <span className="text-gray-400">Não informado</span>}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-8 rounded-lg text-lg shadow-lg hover:shadow-red-600/20 transition-all cursor-pointer"
            >
              Confirmar e Iniciar
            </Button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-[#333] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#222] flex justify-between items-center sticky top-0 bg-[#111] z-10">
              <h3 className="text-xl font-bold text-white">Atualizar Dados</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors bg-[#111] hover:bg-[#222] border border-[#222] p-2 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-lg mb-6">
                <p className="text-red-200 text-sm flex items-center font-sans">
                  <FiAlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
                  Por favor, confirme ou atualize seus dados atuais para o novo sistema.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomBorderInput
                  label="Nome do Personagem"
                  placeholder="Ex: SeuNome 123"
                  value={nomeJogo}
                  onChange={(e) => setNomeJogo(e.target.value)}
                  disabled={submitting}
                  required
                />
                
                <CustomBorderInput
                  label="Id do Personagem"
                  placeholder="O Id do seu Personagem"
                  value={identificacao}
                  onChange={(e) => setIdentificacao(e.target.value)}
                  disabled
                  required
                />

                <CustomBorderInput
                  label="Telefone in-game"
                  placeholder="Ex: 555-0123"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  disabled={submitting}
                  required
                />

                <CustomSelectMenu
                  label="Turnos Disponíveis"
                  options={[
                    {
                      name: 'Turno da Manhã',
                      value: '1447988476237709392',
                      description: 'Selecione se disponível no turno da manhã',
                    },
                    {
                      name: 'Turno da Tarde',
                      value: '1447988532932120588',
                      description: 'Selecione se disponível no turno da tarde',
                    },
                    {
                      name: 'Turno da Noite',
                      value: '1447988583217758318',
                      description: 'Selecione se disponível no turno da noite',
                    }
                  ]}
                  value={turnos}
                  onChange={(selected) => {
                    const selectedArray = Array.isArray(selected) ? selected : [selected];
                    setTurnos(selectedArray);
                    if (selectedArray.length > 0) setTurnosError('');
                  }}
                  placeholder="Selecione os turnos"
                  multiSelect={true}
                  className={turnosError ? 'border-red-500' : ''}
                />
              </div>

              <hr className="my-6 border-t border-[#222] p-2" />

              <div className='grid grid-cols-2 gap-6'>
                <CustomBorderInput
                  label="Nome do Aprovador"
                  placeholder="Quem te recrutou?"
                  value={nomeMembro}
                  onChange={(e) => setNomeMembro(e.target.value)}
                  disabled
                  required
                />

                <CustomBorderInput
                  label="ID do Aprovador"
                  placeholder="ID do recrutador"
                  value={idMembro}
                  onChange={(e) => setIdMembro(e.target.value)}
                  disabled
                  required
                />
              </div>
              

              <div className="pt-6 border-t border-[#222] flex justify-end gap-3">
                <Button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-transparent border border-[#333] hover:bg-[#222] cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  title={turnos.length === 0 ? 'Selecione pelo menos um turno' : undefined}
                  className={`bg-red-600 hover:bg-red-600 min-w-[150px] cursor-pointer ${turnos.length === 0 ? 'opacity-60 cursor-not-allowed!' : 'hover:bg-red-800 transition-colors'}`}
                >
                  {submitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processando...</>
                  ) : 'Validar Dados'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-lg flex items-start gap-4 hover:border-red-900/50 transition-colors group">
      <div className="p-3 bg-[#111] rounded-lg text-gray-500 group-hover:text-red-500 transition-colors">
        {icon}
      </div>
      <div>
        <span className="block text-gray-500 text-sm mb-1">{label}</span>
        <span className="block text-white font-medium break-all">{value || 'Não Informado'}</span>
      </div>
    </div>
  );
}
