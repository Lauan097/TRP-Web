"use client";

import { useState } from 'react';
import { ExclamationTriangleIcon, LinkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import CustomBorderInput from '../components/CustomBorderInput';
import CustomBorderTextarea from '../components/CustomBorderTextarea';
import CustomSelectMenu from '../components/embeds/CustomSelectMenu';
import { useToast } from '../components/ToastContext';

const REPORT_TYPES = [
  { name: 'VDM (Vehicle Deathmatch)', value: 'vdm' },
  { name: 'RDM (Random Deathmatch)', value: 'rdm' },
  { name: 'Meta Gaming', value: 'meta_gaming' },
  { name: 'Power Gaming', value: 'power_gaming' },
  { name: 'Combat Logging', value: 'combat_logging' },
  { name: 'Outros', value: 'others' },
];

export default function PaginaDenuncia() {
  const [loading, setLoading] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [reportType, setReportType] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [description, setDescription] = useState('');
  
  const { addToast } = useToast();
  const reportsEnabled = process.env.NEXT_PUBLIC_REPORTS_ENABLED || false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerId || !reportType || !videoLink || !description) {
      addToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      addToast('Funcionalidade em desenvolvimento!', 'warning');
      
      // setPlayerId('');
      // setReportType('');
      // setVideoLink('');
      // setDescription('');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-1 space-y-6">
            <h1 className="text-4xl font-bold text-white">
              Abrir <span className="text-red-600">Dossiê</span>
            </h1>
            <p className="text-gray-400">
              Use este canal para reportar quebras de regras ou condutas inadequadas. 
              Sua identidade será preservada pela Alta Cúpula, mas falsas denúncias resultarão em exílio.
            </p>
            
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl">
              <h3 className="flex items-center text-red-400 font-semibold mb-2">
                <ExclamationTriangleIcon className="w-5 h-5 mr-2"/> Requisitos
              </h3>
              <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                <li>Provas em vídeo são obrigatórias para casos de Anti-RP.</li>
                <li>Prints devem ser de tela cheia.</li>
                <li>Mantenha a descrição objetiva.</li>
              </ul>
            </div>
        </div>

        <div className="md:col-span-2 w-full max-w-xl">
          <form onSubmit={handleSubmit} className="bg-[#0f0f0f]/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl space-y-10 shadow-2xl">
            
            <h3 className="text-2xl font-bold text-white text-center mb-10">Informações</h3>

            {/* Aviso de indisponibilidade do sistema de reports */}
            {!reportsEnabled && (
              <div className="mb-6 bg-red-600/10 border border-red-600/30 p-4 rounded-xl text-red-200">
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Sistema de Reports Indisponível</p>
                    <p className="text-sm text-red-200/90">O sistema de denúncias está temporariamente fora do ar. Submissões estão desabilitadas até segunda ordem.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <CustomBorderInput 
                    label="ID do Jogador"
                    maxLength={4} 
                    placeholder="Exemplo: 1234"
                    required
                    value={playerId}
                    disabled={!reportsEnabled}
                    onChange={(e) => setPlayerId(e.target.value)}
                />
              </div>

              <div>
                <CustomSelectMenu
                  label="Tipo de Denúncia"
                  options={REPORT_TYPES}
                  placeholder="Selecione o Tipo"
                  maxSelected={1}
                  value={reportType}
                  disabled={!reportsEnabled}
                  onChange={(value) => setReportType(value as string)}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <LinkIcon className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
                <CustomBorderInput 
                  placeholder="https://www.youtube.com/watch?v=..."
                  label="Link da Prova em Vídeo"
                  required
                  className="pl-10"
                  value={videoLink}
                  disabled={!reportsEnabled}
                  onChange={(e) => setVideoLink(e.target.value)}
                />
              </div>
            </div>

            <div>
              <CustomBorderTextarea 
                label="Descrição Detalhada"
                required
                placeholder="Descreva detalhadamente o ocorrido, incluindo datas, horários e locais..."
                maxLength={2000}
                value={description}
                disabled={!reportsEnabled}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={!reportsEnabled}
              className="w-full bg-linear-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-linear-to-r disabled:hover:from-red-700 disabled:hover:to-red-900"
            >
              {loading ? 'Enviando ao Tribunal...' : (
                reportsEnabled ? (
                  <>
                    Enviar Denúncia <PaperAirplaneIcon className="w-5 h-5" />
                  </>
                ) : 'Indisponível no momento'
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}