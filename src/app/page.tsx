"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from "react";
import { FaDiscord, FaBalanceScale, FaUsers, FaHistory } from "react-icons/fa";
import { FaGun, FaSackDollar, FaBoxOpen, FaArrowRight } from "react-icons/fa6";
import { motion, Variants, useSpring, useMotionValue, useInView } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FileText, Brain, Users, Swords, Crosshair } from "lucide-react";

const easing = {
  smooth: [0.25, 0.1, 0.25, 1] as const,
  cinematic: [0.77, 0, 0.175, 1] as const, 
  dramatic: [0.19, 1, 0.22, 1] as const, 
  elastic: [0.68, -0.6, 0.32, 1.6] as const,
};

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MagneticButton = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 200 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.1);
    y.set((e.clientY - centerY) * 0.1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
};

const AnimatedCounter = ({ value, suffix = "" }: { value: number | null, suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: "0px" });
  const hasAnimatedRef = useRef(false);
  
  useEffect(() => {
    if (value === null || value === 0 || !isInView || hasAnimatedRef.current) return;
    
    hasAnimatedRef.current = true;
    
    const duration = 2500;
    const steps = 80;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value, isInView]);

  if (value === null) return <span ref={ref}>Carregando...</span>;
  
  return <span ref={ref}>{displayValue > 0 ? displayValue : value} {suffix}</span>;
};

const BlurReveal = ({ 
  children, 
  className, 
  delay = 0,
  duration = 1.2
}: { 
  children: React.ReactNode, 
  className?: string, 
  delay?: number,
  duration?: number
}) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 40,
        filter: "blur(15px)",
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: duration,
        delay: delay,
        ease: easing.dramatic,
        filter: { duration: duration * 1.3, ease: easing.smooth }
      }}
      className={cn("will-change-[filter,transform,opacity]", className)}
    >
      {children}
    </motion.div>
  );
};

const TextReveal = ({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) => {
  const words = text.split(" ");

  const container: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay },
    },
  };

  const wordVariant: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      filter: "blur(12px)",
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: { 
        duration: 1,
        ease: easing.dramatic,
      },
    },
  };

  return (
    <motion.p
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      className={className}
    >
      {words.map((word, wordIndex) => (
        <motion.span 
          key={wordIndex} 
          variants={wordVariant} 
          className="inline-block mr-[0.3em] will-change-[filter,transform,opacity]"
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
};


const ScrollReveal = ({ children, className, delay = 0 }: { 
  children: React.ReactNode, 
  className?: string, 
  delay?: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ 
        duration: 1.4, 
        delay: delay, 
        ease: easing.dramatic
      }}
      className={cn("will-change-[transform,opacity]", className)}
    >
      {children}
    </motion.div>
  );
};

const StaggerContainer = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.18, delayChildren: delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerItem = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      variants={{
        hidden: { 
          opacity: 0, 
          y: 50,
          scale: 0.92,
        },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { 
            duration: 1.1,
            ease: easing.dramatic
          } 
        }
      }}
      className={cn("will-change-[transform,opacity]", className)}
    >
      {children}
    </motion.div>
  );
};

const AnimatedLine = ({ className, delay = 0 }: { className?: string, delay?: number }) => {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, delay, ease: easing.cinematic }}
      className={cn("origin-left", className)}
    />
  );
};


export default function Home() {
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [botVersion, setBotVersion] = useState<string>('v1.0.0');
  const [recruitmentOpen, setRecruitmentOpen] = useState<boolean>(false);

  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('/api/stats');
        if (statsRes.ok) {
          const data = await statsRes.json();
          setMemberCount(data.memberCount);
        }
        const versionRes = await fetch('/api/version');
        if (versionRes.ok) {
          const data = await versionRes.json();
          setBotVersion(data.version);
        }
        const recruitmentRes = await fetch('/api/recruitment/status');
        if (recruitmentRes.ok) {
          const data = await recruitmentRes.json();
          setRecruitmentOpen(!!data.cycle);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, [pathname]);

  return (
    <main className="flex flex-col items-center min-h-screen justify-center px-4 pb-20 overflow-x-hidden">

      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: easing.smooth }}
        className="max-w-7xl w-full flex flex-col items-center justify-center bg-[#050505]/60 border border-white/5 backdrop-blur-xl rounded-[3rem] p-8 md:p-20 shadow-2xl mt-8 md:mt-12 relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-purple-900/10 via-transparent to-red-900/10 opacity-50 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.7, filter: "blur(25px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ 
              duration: 1.6, 
              delay: 0.3, 
              ease: easing.dramatic,
              filter: { duration: 2 }
            }}
            className="relative logo-container shrink-0 will-change-[filter,transform,opacity]"
          >
            <motion.svg 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72.5 h-72.5" 
              viewBox="0 0 290 290"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 0.4, rotate: 360 }}
              transition={{ 
                opacity: { duration: 1.5, delay: 0.5, ease: easing.cinematic },
                rotate: { 
                  duration: 60, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: 1.5
                }
              }}
            >
              <circle 
                cx="145" 
                cy="145" 
                r="140" 
                fill="none" 
                stroke="url(#circleGradient)" 
                strokeWidth="1.5" 
                strokeDasharray="12 20 6 20" 
              />
              <defs>
                <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(202,117,117,0.5)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
                  <stop offset="100%" stopColor="rgba(147,112,219,0.5)" />
                </linearGradient>
              </defs>
            </motion.svg>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: [0, 1, 1],
                scale: [0.9, 1, 1.02, 1],
              }}
              transition={{ 
                duration: 1.5, 
                delay: 0.8, 
                ease: easing.dramatic,
                scale: {
                  duration: 4,
                  delay: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-67 h-67 rounded-full border border-white/10" 
            />
            
            <motion.div 
              animate={{ 
                opacity: [0.8, 1, 0.8],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-65 h-65 rounded-full bg-[radial-gradient(circle,rgba(202,117,117,0.18)_0%,transparent_70%)]" 
            />
            
            <Image 
              src="/logo_trindade.png" 
              alt="Logo Trindade Penumbra" 
              width={250} 
              height={250} 
              className="rounded-full relative z-10 shadow-[0_0_60px_rgba(202,117,117,0.2)]" 
              priority
            />
          </motion.div>

          <div className="flex-1 space-y-8 text-center md:text-left">
            <div>
                <div className="flex flex-col md:block overflow-hidden">
                  <motion.h1 
                    className="text-4xl md:text-7xl font-sans font-extrabold text-white tracking-tight flex flex-wrap justify-center md:justify-start gap-x-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.25, delayChildren: 0.8 } }
                    }}
                  >
                     <motion.span 
                        className="will-change-[filter,transform,opacity]"
                        variants={{ 
                          hidden: { opacity: 0, y: 60, filter: "blur(18px)" }, 
                          visible: { 
                            opacity: 1, y: 0, filter: "blur(0px)",
                            transition: { duration: 1.3, ease: easing.dramatic }
                          } 
                        }}
                     >
                        Trindade
                     </motion.span>
                     <motion.span 
                        className="text-transparent bg-clip-text bg-linear-to-r from-[#ca7575] to-red-600 will-change-[filter,transform,opacity]"
                        variants={{ 
                          hidden: { opacity: 0, y: 60, filter: "blur(18px)" }, 
                          visible: { 
                            opacity: 1, y: 0, filter: "blur(0px)",
                            transition: { duration: 1.3, ease: easing.dramatic }
                          } 
                        }}
                     >
                        Penumbra
                     </motion.span>
                  </motion.h1>
                </div>
                
                <div className="mt-6 flex justify-center md:justify-start">
                    <TextReveal 
                        text="O submundo tem donos. Nós somos a lei onde o governo não alcança." 
                        className="text-lg md:text-xl text-gray-400 max-w-2xl"
                        delay={1.6}
                    />
                </div>
            </div>
            
            <motion.div 
                initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 2.8, duration: 1, ease: easing.dramatic }}
                className="flex flex-wrap justify-center md:justify-start gap-4"
            >
              <MagneticButton>
                <a 
                  href="#" 
                  target="_blank"
                  className="group relative inline-flex items-center gap-3 bg-[#5865F2]/10 border border-[#5865F2]/50 hover:bg-[#5865F2] text-[#5865F2] hover:text-white px-8 py-3 rounded-2xl font-bold transition-all duration-500 shadow-[0_0_20px_rgba(88,101,242,0.3)] hover:shadow-[0_0_40px_rgba(88,101,242,0.6)]"
                >
                  <FaDiscord className="text-xl transition-transform duration-300 group-hover:scale-110" />
                  <span>Discord Oficial</span>
                </a>
              </MagneticButton>
              <MagneticButton>
                <Link 
                  href="/sobre" 
                  className="group inline-flex items-center gap-2 text-gray-300 hover:text-white px-6 py-3 transition-all duration-500 border border-white/10 rounded-2xl hover:bg-white/5 hover:border-white/20"
                >
                  Sobre Nós <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <ScrollReveal delay={0.4} className="w-full flex justify-center mt-18 mb-36 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 px-10 py-5 bg-[#0f0f0fb9] backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all duration-300">
          
          <div className="flex items-center gap-4 group cursor-default">
            <div className="relative flex h-3 w-3">
              {recruitmentOpen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${recruitmentOpen ? 'bg-green-600' : 'bg-red-600'}`}></span>
            </div>
            <div className="flex flex-col">
              <span className={`text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold group-hover:${recruitmentOpen ? 'text-green-400' : 'text-red-400'} transition-colors`}>Recrutamento</span>
              <span className="text-sm font-bold text-white tracking-wide">{recruitmentOpen ? 'Aberto' : 'Fechado'}</span>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-linear-to-b from-transparent via-white/10 to-transparent"></div>

          <div className="flex items-center gap-4 group cursor-default">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaUsers className="w-5 h-5 text-red-600" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold group-hover:text-red-500 transition-colors duration-300">Membros</span>
              <span className="text-sm font-bold text-white tracking-wide">
                <AnimatedCounter value={memberCount} suffix="Agentes" />
              </span>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-linear-to-b from-transparent via-white/10 to-transparent"></div>

          <Link href="/changelog" className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 md:px-3 py-1 rounded-lg transition-all">
            <FaHistory className="w-5 h-5 text-blue-500 group-hover:scale-120 transition-transform duration-200" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold group-hover:text-blue-400 transition-colors">Changelog</span>
              <span className="text-sm font-bold text-white tracking-wide">{botVersion}</span>
            </div>
          </Link>
        </div>
      </ScrollReveal>

      <section className="max-w-7xl w-full mt-24 mb-32">
        <ScrollReveal delay={0.2}>
            <div className="flex flex-col items-right md:flex-row justify-between mb-12 px-4">
                <BlurReveal delay={0.2}>
                  <span className="text-[#ca7575] font-mono text-xs tracking-[0.3em] uppercase">Especialidades</span>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">Nossos Serviços</h2>
                </BlurReveal>
                <AnimatedLine className="h-px bg-white/20 flex-1 ml-12 mb-4 hidden md:block mt-8" delay={0.6} />
            </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" delay={0.4}>
          <StaggerItem>
            <div className="group h-full bg-[#080808] border border-white/5 hover:border-red-900/50 p-8 rounded-3xl relative overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-crosshair">
                <div className="absolute -right-10 -top-10 bg-red-900/10 w-40 h-40 rounded-full blur-3xl group-hover:bg-red-900/20 transition-all duration-500"></div>
                <FaGun className="text-4xl text-[#ca7575] mb-6 relative z-10 transition-transform group-hover:scale-110 duration-300" />
                <h3 className="text-2xl font-bold text-white mb-3">Bélico Avançado</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Logística de armamento pesado. Pistolas, fuzis e munições para dominação de território.
                </p>
                <div className="flex items-center text-xs text-[#ca7575] font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-[#ca7575] mr-2 shadow-[0_0_10px_#ca7575]"></span> Estoque 100% Garantido
                </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="group h-full bg-[#080808] border border-white/5 hover:border-purple-900/50 p-8 rounded-3xl relative overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-crosshair">
                <div className="absolute -right-10 -top-10 bg-purple-900/10 w-40 h-40 rounded-full blur-3xl group-hover:bg-purple-900/20 transition-all duration-500"></div>
                <FaSackDollar className="text-4xl text-purple-400 mb-6 relative z-10 transition-transform group-hover:scale-110 duration-300" />
                <h3 className="text-2xl font-bold text-white mb-3">Gestão Financeira</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Lavagem de capital ilícito com as melhores taxas da cidade. Segurança e sigilo total.
                </p>
                <div className="flex items-center text-xs text-purple-400 font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-purple-400 mr-2 shadow-[0_0_10px_#c084fc]"></span> Taxa: 15%
                </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="group h-full bg-[#080808] border border-white/5 hover:border-blue-900/50 p-8 rounded-3xl relative overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-crosshair">
                <div className="absolute -right-10 -top-10 bg-blue-900/10 w-40 h-40 rounded-full blur-3xl group-hover:bg-blue-900/20 transition-all duration-500"></div>
                <FaBoxOpen className="text-4xl text-blue-400 mb-6 relative z-10 transition-transform group-hover:scale-110 duration-300" />
                <h3 className="text-2xl font-bold text-white mb-3">Narcóticos</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Distribuição em larga escala de substâncias puras. Abastecimento constante para revendedores.
                </p>
                <div className="flex items-center text-xs text-blue-400 font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mr-2 shadow-[0_0_10px_#60a5fa]"></span> Alta Pureza
                </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      <ScrollReveal className="max-w-6xl w-full mt-24 mb-28">
            <div className="bg-[#0f0f0f] border border-white/5 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: easing.dramatic }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] md:text-[15rem] font-bold text-white/2 pointer-events-none select-none whitespace-nowrap font-sans"
                >
                    OMERTÀ
                </motion.div>
                
                <motion.div 
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8, delay: 0.4, ease: easing.cinematic }}
                  className="absolute top-0 left-1/4 w-px h-full bg-linear-to-b from-transparent via-white/5 to-transparent origin-top" 
                />
                <motion.div 
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8, delay: 0.7, ease: easing.cinematic }}
                  className="absolute top-0 right-1/4 w-px h-full bg-linear-to-b from-transparent via-white/5 to-transparent origin-top" 
                />

                <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                    <BlurReveal delay={0.3}>
                      <FaBalanceScale className="text-5xl text-gray-500 mx-auto" />
                    </BlurReveal>
                    
                    <BlurReveal delay={0.6} duration={1.3}>
                      <h2 className="text-3xl md:text-5xl font-bold text-white">
                          Não somos apenas mafiosos<br/>Somos uma <span className="text-[#ca7575]">Família</span>
                      </h2>
                    </BlurReveal>
                    
                    <div className="flex justify-center">
                        <TextReveal 
                            text="A Trindade Penumbra opera sob um código de honra estrito. A lealdade é nossa moeda mais valiosa. Traição é paga com sangue. Nossa organização preza pela discrição, eficiência e proteção mútua."
                            className="text-gray-400 text-lg leading-relaxed text-center"
                            delay={1.0}
                        />
                    </div>
                    
                    <div className="pt-8 flex justify-center gap-12 border-t border-white/5 mt-8">
                        {['Honra', 'Lealdade', 'Respeito'].map((item, i) => (
                            <motion.div 
                                key={item}
                                initial={{ opacity: 0, y: 35, filter: "blur(12px)" }}
                                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                viewport={{ once: true }}
                                transition={{ 
                                  delay: 1.6 + (i * 0.2),
                                  duration: 0.9,
                                  ease: easing.dramatic
                                }}
                                className="text-center will-change-[filter,transform,opacity]"
                            >
                                <span className="block text-[#ca7575] font-bold text-xl">{item}</span>
                                <span className="text-xs text-gray-600 uppercase">Princípio 0{i+1}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
      </ScrollReveal>

      <section className="max-w-5xl w-full mt-12 mb-24 px-4 mx-auto">
        <ScrollReveal delay={0.3}>
          <div className="relative bg-linear-to-b from-[#1a1a1a] to-black border border-white/10 rounded-3xl overflow-hidden min-h-150">
          
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
                <motion.div 
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 right-1/4 md:right-[15%] -translate-y-1/2 w-125 h-125 bg-red-900/30 rounded-full blur-[100px] z-0 will-change-opacity"
                />
            </div>

            <div className="absolute top-0 right-0 w-full h-full md:w-[60%] pointer-events-none mask-[linear-gradient(to_right,transparent,black_20%,black_100%)]">
                <Image
                    src="/caveira4.jpg" 
                    alt="Skull Background" 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80 md:opacity-20"
                    width={864}
                    height={1144}
                    priority
                />
    
                <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black to-transparent md:hidden" />
            </div>

            <div className="relative z-10 p-8 md:p-12 md:w-[55%] flex flex-col justify-center h-full">
              <BlurReveal delay={0.2}>
                <div className="flex items-center gap-4 mb-2">
                  <motion.div 
                    animate={{ color: ["#ca7575", "#ff0000", "#ca7575"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Crosshair className="w-8 h-8" />
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Processo de Seleção</h2>
                </div>
                <p className="text-gray-400 mb-12 border-l-2 border-[#ca7575]/30 pl-4">
                  Indique um amigo de confiança para ingressar na Família!
                </p>
              </BlurReveal>

              <StaggerContainer className="flex flex-col gap-8 relative ml-2 md:ml-4" delay={0.5}>
                <div className="absolute left-[2.2rem] top-8 bottom-12 w-0.5 bg-linear-to-b from-white/10 via-white/5 to-transparent" />
                {[
                  { icon: FileText, title: "Solicitação", tag: "Teórico", desc: "Checagem de informações iniciais.", type: "normal" },
                  { icon: Brain, title: "Formulário", tag: "Teórico", desc: "Avaliação de conduta ética da organização.", type: "normal" },
                  { icon: Users, title: "Entrevista", tag: "In-Game", desc: "Um encontro especial dentro do game.", type: "ingame" },
                  { icon: Swords, title: "Última Etapa", tag: "In-Game", desc: "A etapa final para se tornar um de nós...", type: "ingame" }
                ].map((step, index) => (
                    <StaggerItem key={index} className="relative z-10 flex items-start gap-6 group cursor-default">
                      <div className={`shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg border
                        ${step.type === 'ingame' 
                          ? 'bg-[#1a1a1a] border-[#ca7575]/20 group-hover:border-[#ca7575]/60 group-hover:shadow-[0_0_20px_rgba(202,117,117,0.2)]' 
                          : 'bg-[#151515] border-white/5 group-hover:border-white/30'
                        }`}>
                        <step.icon className={`w-8 h-8 transition-colors duration-300 ${step.type === 'ingame' ? 'text-white group-hover:text-[#ca7575]' : 'text-gray-300 group-hover:text-white'}`} />
                      </div>

                      <div className="pt-2">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className={`text-xl font-bold transition-colors ${step.type === 'ingame' ? 'text-white group-hover:text-[#ca7575]' : 'text-white'}`}>
                              {step.title}
                            </h3>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border
                              ${step.type === 'ingame' 
                                  ? 'bg-[#ca7575]/10 text-[#ca7575] border-[#ca7575]/20' 
                                  : 'bg-[#2a2a2a] text-gray-400 border-white/5'
                              }`}>
                              {step.tag}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-62.5">
                          {step.desc}
                        </p>
                      </div>
                    </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </main>
  );
}