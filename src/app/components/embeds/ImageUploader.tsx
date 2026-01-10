'use client';

import { Upload, Link, X } from 'lucide-react';
import { ChangeEvent, useState, DragEvent, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils"; 
import { API_BASE_URL } from '@/utils/constants'; 

interface ImageInputProps {
  value?: string;
  onChange: (url: string) => void;
  label: string;
  isOptional?: boolean;
  className?: string;
}

export default function ImageInput({ value, onChange, label }: ImageInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImageLoadFailed(false);
  }, [value]);

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const apiUrl = API_BASE_URL;
      const response = await fetch(`${apiUrl}/api/site/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Falha no upload');
      }
      onChange(data.url);
    } catch (error) {
      alert('Erro ao enviar imagem: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragEnter = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); if (!isDragging) setIsDragging(true); };
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleClear = () => {
    onChange('');
  };


  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-400 pt-1">{label}</label>

      <div className="flex flex-col gap-4">
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <div className="relative h-10 flex-1">
              <input
                type="text"
                value={value || ""}
                onChange={handleUrlChange}
                placeholder="Cole a URL da imagem aqui"
                className="w-full h-full pl-10 pr-4 py-2 bg-[#202022] border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>
            {value && (
              <button
                onClick={handleClear}
                className="h-10 w-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-md text-red-400 transition-colors shrink-0"
                aria-label="Remover URL"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <div
            className={cn(
              "relative border-2 border-dashed rounded-md p-4 h-20 text-center transition-colors flex items-center justify-center",
              "cursor-pointer",
              isDragging ? "border-blue-500 bg-blue-900/20" : "border-gray-700 bg-[#252525]",
              isUploading && "opacity-60 cursor-not-allowed"
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <input 
                ref={fileInputRef} 
                type="file" accept="image/png, image/jpeg, image/gif" 
                className="hidden" onChange={(e) => { if (e.target.files && e.target.files.length > 0) { handleFileUpload(e.target.files[0]); } }} 
                disabled={isUploading} 
            />
            {isUploading ? (
              <div className="flex items-center justify-center text-blue-400">
                <Upload className="animate-bounce mr-2" size={20} />
                <span>Enviando...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center text-gray-400">
                <Upload className="mr-2" size={20} />
                <span className="hidden sm:inline">Arraste e solte ou</span>
                <span className="text-blue-400">&nbsp;clique aqui&nbsp;</span>
                <span className="hidden sm:inline">e faça upload</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}