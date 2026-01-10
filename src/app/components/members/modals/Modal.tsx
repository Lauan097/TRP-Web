import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  const [body, setBody] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBody(document.body);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen || !body) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`relative w-full ${maxWidth} bg-[#1E1E1E] border border-white/10 rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white hover:bg-[#2d2d2d] rounded-lg p-2 cursor-pointer transition-colors">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    body
  );
}
