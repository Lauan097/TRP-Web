import React, { useState } from 'react';
import { X, Send, AlertTriangle, Loader2 } from 'lucide-react';
import CustomBorderInput from './CustomBorderInput';
import CustomBorderTextarea from './CustomBorderTextarea';
import { API_BASE_URL } from '@/utils/constants';

interface Service {
  id: string | number;
  title: string;
  color: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  userName: string; // Nome do usuário logado
  addToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export default function ServiceModal({ isOpen, onClose, service, userName, addToast }: ServiceModalProps) {
  const [details, setDetails] = useState('');
  const [gameId, setGameId] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !service) return null;

  const getGradientColor = (id: string | number) => {
    switch (id) {
      case 'assassinato': return 'from-red-500/20';
      case 'armas': return 'from-orange-500/20';
      case 'drogas': return 'from-emerald-400/20';
      case 'lavagem': return 'from-purple-400/20';
      default: return 'from-gray-500/20';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/site/service_requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service.id,
          serviceName: service.title,
          details,
          user: userName,
          gameId
        }),
      });

      if (!response.ok) {
        throw new Error('Erro na resposta da API');
      }

      addToast('Solicitação enviada com sucesso!', 'success');
      onClose();
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      addToast('Erro ao enviar solicitação. Tente novamente.', 'error');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#1a1a1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className={`px-6 py-4 border-b border-white/5 flex justify-between items-center bg-linear-to-r ${getGradientColor(service.id)} to-transparent`}>
          <div className="flex items-center gap-3">
            <service.icon className={service.color} size={24} />
            <h3 className="text-xl font-bold text-white">{service.title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex gap-3 items-start mb-6">
            <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-yellow-200/80">
              Você está prestes a abrir um chamado oficial. O uso indevido deste canal resultará em punições severas por parte da organização.
            </p>
          </div>

          <CustomBorderInput
            label="Solicitante"
            value={userName}
            disabled
            className="text-gray-400 cursor-not-allowed mb-8"
          />

          <CustomBorderInput
            label="ID do Usuário (RG)"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder="Digite seu ID no jogo..."
            maxLength={40}
            className="mb-8"
          />

          <CustomBorderTextarea
            label="Detalhes do Pedido"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Descreva o alvo, a quantidade ou a necessidade específica..."
            maxLength={500}
            required
          />

          <div className="pt-2 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition-all cursor-pointer
                ${loading ? 'bg-white/10 text-gray-400 cursor-wait' : 'bg-white text-black hover:bg-gray-200'}
              `}
            >
              {loading ? (
                <> <Loader2 size={16} className="animate-spin" /> Processando... </>
              ) : (
                <> <Send size={16} className='' /> Enviar Solicitação </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}