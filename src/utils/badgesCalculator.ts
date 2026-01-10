export type BadgeType = 
  | 'NOVATO' 
  | 'INTERMEDIARIO' 
  | 'AVANCADO' 
  | 'VETERANO' 
  | 'PIONEIRO' 
  | 'LENDA' 
  | 'IMORTAL';

export interface Badge {
  id: BadgeType;
  name: string;
  minMonths: number;
  maxMonths: number | null;
  color: string;
  textColor: string;
  icon: string;
  description: string;
}

export const BADGES: Record<BadgeType, Badge> = {
  NOVATO: {
    id: 'NOVATO',
    name: 'Novato',
    minMonths: 0,
    maxMonths: 2,
    color: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    icon: '🌱',
    description: 'Começando sua jornada (0-2 meses)'
  },
  INTERMEDIARIO: {
    id: 'INTERMEDIARIO',
    name: 'Intermediário',
    minMonths: 2,
    maxMonths: 4,
    color: 'bg-cyan-500/10',
    textColor: 'text-cyan-400',
    icon: '⚔️',
    description: 'Ganhando experiência (2-4 meses)'
  },
  AVANCADO: {
    id: 'AVANCADO',
    name: 'Avançado',
    minMonths: 4,
    maxMonths: 8,
    color: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    icon: '🔮',
    description: 'Dominando as habilidades (4-8 meses)'
  },
  VETERANO: {
    id: 'VETERANO',
    name: 'Veterano',
    minMonths: 8,
    maxMonths: 12,
    color: 'bg-orange-500/10',
    textColor: 'text-orange-400',
    icon: '🏅',
    description: 'Veterano do servidor (8-12 meses)'
  },
  PIONEIRO: {
    id: 'PIONEIRO',
    name: 'Pioneiro',
    minMonths: 12,
    maxMonths: 18,
    color: 'bg-yellow-500/10',
    textColor: 'text-yellow-400',
    icon: '⭐',
    description: 'Desde as raízes (12-18 meses)'
  },
  LENDA: {
    id: 'LENDA',
    name: 'Lenda',
    minMonths: 18,
    maxMonths: 36,
    color: 'bg-pink-500/10',
    textColor: 'text-pink-400',
    icon: '🌟',
    description: 'Lenda do servidor (18-36 meses)'
  },
  IMORTAL: {
    id: 'IMORTAL',
    name: 'Imortal',
    minMonths: 36,
    maxMonths: null,
    color: 'bg-linear-to-tr from-purple-600 to-pink-600',
    textColor: 'text-white',
    icon: '👑',
    description: 'Imortal (72+ meses)'
  }
};

export function calculateMonthsDifference(startDate: Date | string): number {
  let start: Date;
  
  if (typeof startDate === 'string') {
    if (startDate.includes('T')) {
      start = new Date(startDate);
    } else if (startDate.includes('/')) {
      const [datePart] = startDate.split(', ');
      const [day, month, year] = datePart.split('/');
      start = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      start = new Date(startDate);
    }
  } else {
    start = startDate;
  }
  
  if (isNaN(start.getTime())) {
    console.error('Data inválida:', startDate);
    return 0;
  }
  
  const now = new Date();
  const months = 
    (now.getFullYear() - start.getFullYear()) * 12 + 
    (now.getMonth() - start.getMonth());
  
  return Math.max(0, months);
}

export function formatTimeElapsed(startDate: Date | string): string {
  let start: Date;
  
  if (typeof startDate === 'string') {
    if (startDate.includes('T')) {
      start = new Date(startDate);
    } else if (startDate.includes('/')) {
      const [datePart] = startDate.split(', ');
      const [day, month, year] = datePart.split('/');
      start = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      start = new Date(startDate);
    }
  } else {
    start = startDate;
  }
  
  if (isNaN(start.getTime())) {
    console.error('Data inválida para formatTimeElapsed:', startDate);
    return 'Carregando...';
  }
  
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  
  if (diffMs < 0) {
    return 'Data inválida';
  }
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffMonths / 12);

  if (diffYears > 0) {
    return `${diffYears} ano${diffYears !== 1 ? 's' : ''} e ${diffMonths % 12} mês${(diffMonths % 12) !== 1 ? 'es' : ''}`;
  }
  if (diffMonths > 0) {
    return `${diffMonths} mês${diffMonths !== 1 ? 'es' : ''} e ${diffDays % 30} dia${(diffDays % 30) !== 1 ? 's' : ''}`;
  }
  if (diffDays > 0) {
    return `${diffDays} dia${diffDays !== 1 ? 's' : ''} e ${diffHours % 24} hora${(diffHours % 24) !== 1 ? 's' : ''}`;
  }
  if (diffHours > 0) {
    return `${diffHours} hora${diffHours !== 1 ? 's' : ''} e ${diffMinutes % 60} minuto${(diffMinutes % 60) !== 1 ? 's' : ''}`;
  }
  return `${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`;
}

export function getBadgeByMonths(months: number): Badge {
  if (months >= 36) return BADGES.IMORTAL;
  if (months >= 18) return BADGES.LENDA;
  if (months >= 12) return BADGES.PIONEIRO;
  if (months >= 8) return BADGES.VETERANO;
  if (months >= 4) return BADGES.AVANCADO;
  if (months >= 2) return BADGES.INTERMEDIARIO;
  return BADGES.NOVATO;
}

export function getAllBadgesUntilNow(months: number): Badge[] {
  const badges: Badge[] = [];
  const badgeOrder: BadgeType[] = [
    'NOVATO',
    'INTERMEDIARIO',
    'AVANCADO',
    'VETERANO',
    'PIONEIRO',
    'LENDA',
    'IMORTAL'
  ];

  for (const badgeId of badgeOrder) {
    const badge = BADGES[badgeId];
    if (months >= badge.minMonths) {
      badges.push(badge);
    } else {
      break;
    }
  }

  return badges;
}

export function getNextBadge(months: number): Badge | null {
  const badgeOrder: BadgeType[] = [
    'NOVATO',
    'INTERMEDIARIO',
    'AVANCADO',
    'VETERANO',
    'PIONEIRO',
    'LENDA',
    'IMORTAL'
  ];

  for (const badgeId of badgeOrder) {
    const badge = BADGES[badgeId];
    if (months < badge.minMonths) {
      return badge;
    }
  }

  return null;
}

export function getMonthsUntilNextBadge(months: number): number | null {
  const nextBadge = getNextBadge(months);
  if (!nextBadge) return null;
  return nextBadge.minMonths - months;
}
