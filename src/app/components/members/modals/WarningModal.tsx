import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { API_BASE_URL } from '@/utils/constants';
import { toast } from 'sonner';

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
          adminId
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Falha ao aplicar advertência');
      }

      toast.success('Advertência aplicada com sucesso!');
      onClose();
      setReason('');
      setDuration('24');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Erro: ${error.message}`);
      } else {
        toast.error('Erro desconhecido');
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
            className="bg-[#121212] border-white/10 min-h-[100px] mt-1 text-white"
            required
            minLength={10}
            maxLength={300}
          />
        </div>

        <div>
          <Label className="text-white">Duração</Label>
          <select 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-2 mt-1 bg-[#121212] border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="24">24 horas (1 Dia)</option>
            <option value="48">48 horas (2 Dias)</option>
            <option value="120">120 horas (5 Dias)</option>
            <option value="240">240 horas (10 Dias)</option>
            <option value="480">480 horas (20 Dias)</option>
            <option value="720">720 horas (1 Mês)</option>
            <option value="1440">1440 horas (2 Meses)</option>
            <option value="permanent">Permanente</option>
          </select>
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
