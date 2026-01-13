import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { API_BASE_URL } from '@/utils/constants';
import { useToast } from '@/app/components/ToastContext';

interface ExonerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string; username: string; nickname: string } | null;
  adminId: string;
}

export function ExonerationModal({ isOpen, onClose, user, adminId }: ExonerationModalProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/site/moderation/exonerate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || ''
        },
        body: JSON.stringify({
          userId: user.id,
          guildId: '1295702106195492894',
          reason,
          adminId
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Falha ao aplicar exoneração');
      }

      addToast('Exoneração aplicada com sucesso!', 'success');
      onClose();
      setReason('');
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
    <Modal isOpen={isOpen} onClose={onClose} title="Aplicar Exoneração">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded text-red-200 text-sm">
          Atenção: Esta ação irá banir o usuário do servidor e registrar a exoneração.
        </div>

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
            placeholder="Descreva o motivo da exoneração..."
            className="bg-[#121212] border-white/10 min-h-[100px] mt-1 text-white"
            required
            minLength={10}
            maxLength={300}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose} className="text-white hover:bg-white/10">Cancelar</Button>
          <Button type="submit" disabled={loading} variant="destructive">
            {loading ? 'Aplicando...' : 'Exonerar Usuário'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
