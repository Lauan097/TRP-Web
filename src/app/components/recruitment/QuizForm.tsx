'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/app/components/ToastContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Fingerprint, Droplets } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/app/components/NumberInput";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { motion, Variants } from 'framer-motion';
import { GiSkullSabertooth } from "react-icons/gi";

interface QuizFormProps {
  userId: string;
  onSuccess: () => void;
}

const questions = [
  { id: 'nomePersonagem', label: 'Nome do personagem' },
  { id: 'idadePersonagem', label: 'Idade real' },
  { id: 'historiaPersonagem', label: 'Tempo de RP' },
  { id: 'motivoEntrada', label: 'Histórico em organizações' },
  { id: 'pg', label: 'Reação a consequências' },
  { id: 'mg', label: 'Motivação' },
  { id: 'cl', label: 'Hierarquia' },
  { id: 'rdmVdm', label: 'Ação sob pressão' },
  { id: 'amorVida', label: 'Diferencial' },
  { id: 'crash', label: 'Confiança' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 50, damping: 15 }
  }
};

export default function QuizForm({ userId, onSuccess }: QuizFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { addToast } = useToast();
  const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500';
  
  const [flicker, setFlicker] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 100);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = questions.filter(q => !answers[q.id] || answers[q.id].trim() === '');
    
    if (missing.length > 0) {
      addToast(`O sangue exige compromisso. Preencha os campos restantes: ${missing.length}`, 'warning');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${apiURL}/api/site/recruitment/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, answers })
      });

      const data = await res.json();

      if (res.ok) {
        addToast('Pacto de sangue selado. Aguarde.', 'success');
        onSuccess();
      } else {
        addToast(data.error || 'Falha no ritual.', 'error');
      }

    } catch (error) {
      console.error(error);
      addToast('Conexão cortada.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyles = `
    bg-black/60 
    border border-white/5 
    text-zinc-200 placeholder:text-zinc-600 
    rounded-xl 
    min-h-12 w-full px-4 py-3 text-sm 
    transition-all duration-300
    outline-none focus:outline-none focus:ring-0 
    focus:border-red-600/60
    focus:shadow-[0_0_20px_rgba(220,38,38,0.15)] 
    focus:bg-black/80
    placeholder:font-medium
  `;
  
  const containerStyles = `
    relative bg-[#0a0a0a]/80 
    border border-white/5 
    rounded-2xl p-6 
    backdrop-blur-md 
    group 
    hover:border-red-900/30 
    transition-all duration-500 
    shadow-lg hover:shadow-red-900/5
  `;
  
  const labelStyles = "text-zinc-400 text-xs uppercase tracking-[0.10em] font-bold mb-3 block group-focus-within:text-red-500 transition-colors duration-300 flex items-center gap-2";

  return (
    <div className="w-full max-w-4xl mx-auto relative min-h-screen flex flex-col items-center justify-center py-20">
      
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,#000000_90%]"></div>
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-red-900/40 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <div className="relative w-full px-4">
        
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 relative z-10"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[150%] bg-black blur-[60px] -z-10 rounded-full pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/20 border border-red-900/30 text-red-500 text-[10px] font-black tracking-[0.2em] uppercase mb-6 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
            <Droplets size={12} className="fill-current" />
            Etapa 02
          </div>
          
          <h1 className={cn(
            "text-4xl md:text-5xl font-black text-white tracking-tighter uppercase font-serif mb-3",
            flicker ? "opacity-70 blur-[1px] text-red-200" : "opacity-100"
          )}>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-red-900 drop-shadow-sm">Formulário</span>
          </h1>
          
          <p className="text-zinc-500 text-sm max-w-md mx-auto font-medium">
            A lealdade é escrita com sangue, mas começa com a verdade.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className={containerStyles}>
              <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full bg-red-900/20 group-hover:bg-red-600 transition-colors duration-500" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-5">
                  <Label htmlFor="nomePersonagem" className={labelStyles}>Seu nome Real</Label>
                  <input
                    id="nomePersonagem"
                    type="text"
                    autoComplete="off"
                    placeholder="Seu nome completo..."
                    value={answers['nomePersonagem'] || ''}
                    onChange={(e) => handleChange('nomePersonagem', e.target.value)}
                    className={inputStyles}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="idadePersonagem" className={labelStyles}>Idade Real</Label>
                  <NumberInput
                    value={answers['idadePersonagem'] ? parseInt(answers['idadePersonagem']) : 18}
                    onChange={(val) => handleChange('idadePersonagem', val.toString())}
                    min={1} max={100}
                    className="bg-black/60 border border-white/5! text-zinc-200 rounded-xl mt-4.5 focus:border-red-600/60! focus:ring-0 focus:outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-5">
                  <Label htmlFor="historiaPersonagem" className={labelStyles}>Tempo de RP</Label>
                  <input
                    id="historiaPersonagem"
                    type="text"
                    placeholder="A quanto tempo você joga RP?"
                    value={answers['historiaPersonagem'] || ''}
                    onChange={(e) => handleChange('historiaPersonagem', e.target.value)}
                    className={inputStyles}
                  />
                </div>
              </div>
            </motion.div>

            {[
              { id: 'motivoEntrada', label: 'Já integrou alguma organização? E por que saiu da mesma?', ph: 'Descreva brevemente sua função e o motivo da saída...' },
              { id: 'pg', label: 'Como você reage quando seu personagem sofre consequências graves?', ph: 'Ex: Prisão, perda financeira, derrota...' },
            ].map((q) => (
              <motion.div key={q.id} variants={itemVariants} className={containerStyles}>
                 <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full bg-red-900/20 group-hover:bg-red-600 transition-colors duration-500" />
                <Label htmlFor={q.id} className={labelStyles}>{q.label}</Label>
                <Textarea 
                  id={q.id}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  className={`${inputStyles} min-h-[100px] resize-none focus-visible:ring-0`}
                  placeholder={q.ph}
                />
              </motion.div>
            ))}

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={containerStyles}>
                <Label htmlFor="mg" className={labelStyles}>O que te motiva a buscar uma família criminosa?</Label>
                <Textarea 
                  id="mg"
                  value={answers['mg'] || ''}
                  onChange={(e) => handleChange('mg', e.target.value)}
                  className={`${inputStyles} min-h-[140px] resize-none focus-visible:ring-0`}
                  placeholder="Porque não outra vertente do RP?"
                />
              </div>
              <div className={containerStyles}>
                <Label htmlFor="cl" className={labelStyles}> Como você reage a hierarquia?</Label>
                <Textarea 
                  id="cl"
                  value={answers['cl'] || ''}
                  onChange={(e) => handleChange('cl', e.target.value)}
                  className={`${inputStyles} min-h-[140px] resize-none focus-visible:ring-0`}
                  placeholder="Qual sua reação a ordens que não concorda, mas deve cumprir?"
                />
              </div>
            </motion.div>

            {[
              { id: 'rdmVdm', label: 'Relate como seu personagem age sob pressão extrema ou risco real dentro da cidade:', ph: 'Em tiroteios ou sequestros, você mantém a calma?' },
              { id: 'amorVida', label: 'Qual é o seu maior diferencial como jogador dentro de uma organização estruturada?', ph: 'Qual diferença você faz dentro de uma organização?' },
              { id: 'crash', label: 'Por que devemos confiar em você para carregar o nome da família?', ph: 'Por que não devemos te eliminar agora? Qual vantagens você irá trazer para a família?' },
            ].map((q) => (
              <motion.div key={q.id} variants={itemVariants} className={containerStyles}>
                 <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full bg-red-900/20 group-hover:bg-red-600 transition-colors duration-500" />
                <Label htmlFor={q.id} className={labelStyles}>{q.label}</Label>
                <Textarea 
                  id={q.id}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  className={`${inputStyles} min-h-[100px] resize-none focus-visible:ring-0`}
                  placeholder={q.ph}
                />
              </motion.div>
            ))}

          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="w-full max-w-2xl mx-auto mt-12 mb-24 relative"
          >
            <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:border-red-900/40 transition-colors duration-500">
               <div className="absolute -inset-1 bg-linear-to-r from-red-600/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="flex items-center gap-4 z-10 pl-2">
                <Checkbox 
                  id="terms" 
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  className='data-[state=checked]:bg-red-600 data-[state=checked]:text-white border-zinc-600 w-5 h-5 rounded-md' 
                />
                <Label htmlFor="terms" className="text-zinc-400 cursor-pointer text-xs uppercase tracking-widest hover:text-white transition-colors">
                  Aceito as consequências
                </Label>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn("inline-block z-10", (submitting || !termsAccepted) && "cursor-not-allowed")}>
                    <Button 
                      type="submit" 
                      disabled={submitting || !termsAccepted}
                      className={cn(
                        "relative overflow-hidden bg-red-900/20 border border-red-900/50 text-red-500 font-bold px-8 py-6 rounded-xl transition-all duration-300 cursor-pointer",
                        termsAccepted && !submitting ? "hover:bg-red-600 hover:text-white hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] hover:border-red-500" : "opacity-40 grayscale"
                      )}
                    >
                      <span className="relative z-10 flex items-center gap-3 tracking-widesttext-sm">
                        {submitting ? (
                          <span className="animate-pulse">Enviando...</span>
                        ) : (
                          <>
                            <Fingerprint size={18} />
                            FINALIZAR
                          </>
                        )}
                      </span>
                    </Button>
                  </div>
                </TooltipTrigger>
                {!termsAccepted && (
                  <TooltipContent className='bg-zinc-900 border-red-900 text-red-400'>
                    <p>Você deve aceitar as consequênciasa antes</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
            
            <div className="text-center mt-8 opacity-30 hover:opacity-80 transition-opacity duration-500">
              <GiSkullSabertooth className="mx-auto w-10 h-10 text-red-900 mb-2" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">Máfia Trindade Penumbra</p>
            </div>

          </motion.div>
        </form>
      </div>
    </div>
  );
}