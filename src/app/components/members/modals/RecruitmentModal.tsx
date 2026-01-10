import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from './Modal';
import { API_BASE_URL } from '@/utils/constants';
import { Loader2 } from 'lucide-react';

interface RecruitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string; username: string; nickname: string } | null;
}

interface RecruitmentData {
  status: string;
  data: Record<string, unknown> | string;
}

interface ApiResponse {
  userStatus: RecruitmentData | null;
}

export function RecruitmentModal({ isOpen, onClose, user }: RecruitmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<RecruitmentData | null>(null);

  const fetchApplication = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/site/recruitment/status?user_id=${user.id}`);
      if (res.ok) {
        const data: ApiResponse = await res.json();
        setApplication(data.userStatus);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && user) {
      fetchApplication();
    }
  }, [isOpen, user, fetchApplication]);

  const parsedData = React.useMemo(() => {
    if (!application?.data) return null;
    let data = application.data;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {
        return null;
      }
    }
    console.log('DEBUG - Dados brutos da aplicação:', application);
    console.log('DEBUG - Dados parseados (JSON):', data);
    return data as Record<string, unknown>;
  }, [application]);

  const answers = React.useMemo(() => {
    if (!parsedData) return undefined;
    
    const result: Record<string, string> = {};
    const capitalize = (s: string) => s && s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s;

    if (parsedData.answers && typeof parsedData.answers === 'object') {
       Object.entries(parsedData.answers as Record<string, string>).forEach(([k, v]) => {
           result[k] = capitalize(String(v));
       });
    }

    Object.keys(parsedData).forEach(key => {
       if (key.toLowerCase().startsWith('question')) {
          const val = parsedData[key];
          if (typeof val === 'string' || typeof val === 'number') {
              const match = key.match(/question(\d+)/i);
              const niceLabel = match ? `Questão ${match[1]}` : key;
              result[niceLabel] = capitalize(String(val));
          }
       }
    });

    const legacyKeyMap: Record<string, string> = {
      'nomePersonagem': 'Nome do Personagem',
      'idadePersonagem': 'Idade do Personagem',
      'historiaPersonagem': 'História do Personagem',
      'motivoEntrada': 'Motivo da Entrada',
      'cl': 'Combat Logging (CL)',
      'mg': 'Meta Gaming (MG)',
      'pg': 'Power Gaming (PG)',
      'rdmVdm': 'RDM / VDM',
      'amorVida': 'Amor à Vida',
      'crash': 'Crash em ação'
    };

    Object.keys(legacyKeyMap).forEach(key => {
       const mappedLabel = legacyKeyMap[key];
       if (parsedData[key] !== undefined) {
          result[mappedLabel] = capitalize(String(parsedData[key]));
       }
    });

    return Object.keys(result).length > 0 ? result : undefined;
  }, [parsedData]);

  const formatValue = (val: unknown) => {
      if (!val) return '';
      const s = String(val);
      return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const personalInfo = {
    "Nome no Jogo": formatValue(parsedData?.nomeJogo),
    "Identificação": parsedData?.identificacao,
    "Telefone": parsedData?.telefone,
    "Recrutado por": parsedData?.nomeMembro ? `${formatValue(parsedData?.nomeMembro)} (ID: ${parsedData?.idMembro})` : null,
    "Turnos Disponíveis": Array.isArray(parsedData?.turnos) 
        ? (parsedData?.turnos as string[]).map(t => formatValue(t)).join(', ') 
        : formatValue(parsedData?.turnos)
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Formulário de Recrutamento" maxWidth="max-w-4xl">
      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="animate-spin text-white" />
        </div>
      ) : application ? (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg border border-white/10">
            <span className="text-white/70 font-medium">Status da Aplicação</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              application.status === 'APPROVED' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
              application.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
              'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'
            }`}>
              {application.status.replace('_', ' ')}
            </span>
          </div>

          {parsedData ? (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider ml-1">Dados do Candidato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(personalInfo).map(([label, value]) => (
                    value ? (
                      <div key={label} className="bg-[#1a1a1a] p-3 rounded-lg border border-white/5">
                        <p className="text-xs text-white/40 uppercase mb-1">{label}</p>
                        <p className="text-white font-medium">{String(value)}</p>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>

              {answers && Object.keys(answers).length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider ml-1">Respostas do Questionário</h3>
                  <div className="space-y-3">
                    {Object.entries(answers).map(([question, answer], index) => (
                      <div key={index} className="bg-[#1a1a1a] p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-start gap-3">
                          <span className="shrink-0 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/50 mt-0.5">
                            {index + 1}
                          </span>
                          <div className="space-y-2 w-full">
                            <p className="text-sm text-white/60 font-medium leading-relaxed">
                              {question.length > 3 ? question : `Questão ${question}`}
                            </p>
                            <div className="bg-black/20 p-3 rounded border border-white/5">
                              <p className="text-white/90 text-sm whitespace-pre-wrap leading-relaxed">
                                {String(answer)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-white/30 bg-white/5 rounded-xl border border-white/5 border-dashed">
              <p>Dados do formulário não disponíveis.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-white/30 bg-white/5 rounded-xl border border-white/5 border-dashed">
          <p>Nenhum formulário encontrado para este usuário.</p>
        </div>
      )}
    </Modal>
  );
}
