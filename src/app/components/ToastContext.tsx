"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType, duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type, duration };
    setToasts((prev) => {
      const newToasts = prev.length >= 3 ? [...prev.slice(1), toast] : [...prev, toast];
      return newToasts;
    });
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
  return (
    <div>
      {toasts.map((toast, index) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} index={index} total={toasts.length} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void; index: number; total: number }> = ({ toast, onRemove, index, total }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  }, [onRemove, toast.id]);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleClose]);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBgColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-[#2a2a2a] border-green-500';
      case 'error':
        return 'bg-[#2a2a2a] border-red-500';
      case 'warning':
        return 'bg-[#2a2a2a] border-yellow-500';
      case 'info':
        return 'bg-[#2a2a2a] border-blue-500';
      default:
        return 'bg-[#2a2a2a] border-gray-500';
    }
  };

  return (
    <div
      className={`fixed flex items-center p-4 rounded-lg shadow-lg border-l-4 max-w-xs mx-auto ${getBgColor(toast.type)} animate-in slide-in-from-top-2 duration-300 transition-opacity ease-in-out ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        top: `${16 + (total - 1 - index) * 8}px`,
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        zIndex: 9999 + index * 10,
      }}
    >
      {getIcon(toast.type)}
      <span className="ml-3 text-sm font-medium text-gray-100 flex-1">{toast.message}</span>
      <button
        onClick={handleClose}
        className="ml-3 py-1 px-1 text-gray-300 hover:text-gray-400 hover:bg-[#5a5a5a73] transition-colors rounded-md focus:outline-none cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};