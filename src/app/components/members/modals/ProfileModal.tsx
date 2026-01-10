import Image from "next/image";
import { Modal } from './Modal';

interface Role {
  id: string;
  name: string;
  color: string;
}

interface UserProfile {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  joinedAt: string;
  timeSince: string;
  roles: Role[];
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
}

export function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Perfil do Membro">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Image 
            src={user.avatar} 
            alt={user.nickname} 
            width={100} 
            height={100} 
            className="rounded-full border-4 border-white/10"
          />
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-bold text-white">{user.nickname}</h3>
          <p className="text-white/50">{user.username}</p>
          <p className="text-xs text-white/30 mt-1">ID: {user.id}</p>
        </div>

        <div className="w-full grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/5 p-3 rounded border border-white/10">
            <p className="text-xs text-white/50 uppercase">Entrou em</p>
            <p className="text-white font-mono">{user.joinedAt}</p>
          </div>
          <div className="bg-white/5 p-3 rounded border border-white/10">
            <p className="text-xs text-white/50 uppercase">Tempo de Casa</p>
            <p className="text-white font-mono">{user.timeSince}</p>
          </div>
        </div>

        <div className="w-full">
          <p className="text-xs text-white/50 uppercase mb-2">Cargos</p>
          <div className="flex flex-wrap gap-2">
            {user.roles.map((role) => (
               <span 
                  key={role.id} 
                  className="px-2 py-1 rounded text-xs uppercase font-bold tracking-wide border bg-white/5 border-white/10"
                  style={{ 
                    color: role.color || '#ffffff99', 
                    borderColor: role.color ? `${role.color}40` : undefined 
                  }}
                >
                  {role.name}
                </span>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
