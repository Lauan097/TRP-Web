import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { API_BASE_URL } from '@/utils/constants';
import { useToast } from '../../ToastContext';
import { FaRegClock } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import CustomSelectMenu from '../../embeds/CustomSelectMenu';

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string; username: string; nickname: string } | null;
  adminId: string;
}

export function WarningModal({ isOpen, onClose, user, adminId }: WarningModalProps) {
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('24');
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState('1');
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/site/moderation/warn`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || ''
        },
        body: JSON.stringify({
          userId: user.id,
          guildId: '1295702106195492894',
          reason,
          durationHours: duration === 'permanent' ? null : parseInt(duration),
          adminId,
          level
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Falha ao aplicar advertência');
      }

      addToast('Advertência aplicada com sucesso!', 'success');
      onClose();
      setReason('');
      setDuration('24');
      setLevel('1');
    } catch (error) {
      if (error instanceof Error) {
        addToast(`Erro: ${error.message}`, 'error');
      } else {
        addToast('Erro desconhecido', 'error');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Aplicar Advertência">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-white">Usuário</Label>
          <div className="p-2 mt-1 bg-white/5 rounded border border-white/10 text-white/70">
            {user?.nickname} ({user?.username})
          </div>
        </div>
        
        <div>
          <Label className="text-white">Motivo</Label>
          <Textarea 
            value={reason} 
            onChange={(e) => setReason(e.target.value)} 
            placeholder="Descreva o motivo da advertência..."
            className="bg-[#121212] border-white/10 min-h-25 mt-1 text-white"
            required
            minLength={10}
            maxLength={300}
          />
        </div>

        <div>
          <Label className="text-white mb-2">Duração</Label>
          <CustomSelectMenu
            value={duration}
            onChange={(value) => { if (typeof value === 'string') { setDuration(value); } }}
            options={[
              {
                name: '24 Horas (1 Dia)',
                value: '24',
                description: 'A Advetência será retirada após 1 dia.',
                icon: FaRegClock
              },
              {
                name: '48 Horas (2 Dias)',
                value: '48',
                description: 'A Advetência será retirada após 2 dias.',
                icon: FaRegClock
              },
              {
                name: '72 Horas (3 Dias)',
                value: '72',
                description: 'A Advetência será retirada após 3 dias.',
                icon: FaRegClock
              },
              {
                name: '96 Horas (4 Dias)',
                value: '96',
                description: 'A Advetência será retirada após 4 dias.',
                icon: FaRegClock
              },
              {
                name: '120 Horas (5 Dias)',
                value: '120',
                description: 'A Advetência será retirada após 5 dias.',
                icon: FaRegClock
              },
              {
                name: '168 Horas (7 Dias)',
                value: '168',
                description: 'A Advetência será retirada após 7 dias.',
                icon: FaRegClock
              },
              {
                name: '240 Horas (10 Dias)',
                value: '240',
                description: 'A Advetência será retirada após 10 dias.',
                icon: FaRegClock
              },
              {
                name: '336 Horas (14 Dias)',
                value: '336',
                description: 'A Advetência será retirada após 14 dias.',
                icon: FaRegClock
              },
              {
                name: '480 Horas (20 Dias)',
                value: '480',
                description: 'A Advetência será retirada após 20 dias.',
                icon: FaRegClock
              },
              {
                name: '720 Horas (1 Mês)',
                value: '720',
                description: 'A Advetência será retirada após 1 mês.',
                icon: FaRegClock
              },
              {
                name: '1440 Horas (2 Mêses)',
                value: '1440',
                description: 'A Advetência será retirada após 2 mêses.',
                icon: FaRegClock
              },
              {
                name: '2160 Horas (3 Mêses)',
                value: '2160',
                description: 'A Advetência será retirada após 3 mêses.',
                icon: FaRegClock
              },
              {
                name: 'Permanente (∞)',
                value: 'permanent',
                description: 'Sem data de expiração (Pra sempre... é muito tempo)',
                icon: FaRegClock
              }
            ]}
          />
        </div>

        <div className='mt-6'>
          <Label className="text-white mb-2">Nível da Advertência</Label>
          <CustomSelectMenu 
            value={level}
            onChange={(value) => { if (typeof value === 'string') { setLevel(value); } }}
            options={[
              {
                name: 'Aplicar Advetência Nível 1',
                description: 'Uma simples advertência sem consequências adicionais.',
                value: '1',
                icon: FiAlertTriangle,
                iconColor: '#ffdd00'
              },
              {
                name: 'Aplicar Advetência Nível 2',
                description: 'Advertência nível 2 e uma mensagem direta via DM.',
                value: '2',
                icon: FiAlertTriangle,
                iconColor: '#ffa200'
              },
              {
                name: 'Aplicar Advetência Nível 3',
                description: 'Advertência nível 3 e aplicação de castigo por 7 dias.',
                value: '3',
                icon: FiAlertTriangle,
                iconColor: '#ff5900'
              }
            ]}
          
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose} className="text-white hover:text-white hover:bg-white/10 cursor-pointer">Cancelar</Button>
          <Button type="submit" disabled={loading} className="bg-yellow-600 hover:bg-yellow-600/80 text-white cursor-pointer">
            {loading ? 'Aplicando...' : 'Aplicar Advertência'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
