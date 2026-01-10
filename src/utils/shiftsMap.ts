export const SHIFTS_MAP: Record<string, { name: string; emoji: string; color: string; bgColor?: string }> = {
  '1447988476237709392': {
    name: 'Manhã',
    emoji: '🌅',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/12'
  },
  '1447988532932120588': {
    name: 'Tarde',
    emoji: '🌤️',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/12'
  },
  '1447988583217758318': {
    name: 'Noite',
    emoji: '🌙',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/12'
  }
};

export function getShiftName(shiftId: string): string {
  return SHIFTS_MAP[shiftId]?.name || shiftId;
}

export function getShiftsNames(shiftsString: string): string[] {
  if (!shiftsString) return [];
  return shiftsString.split(',').map(id => getShiftName(id.trim()));
}

export const DISCORD_STATUS_MAP: Record<string, { text: string; color: string; bgColor: string }> = {
  'online': {
    text: 'Online',
    color: 'text-green-400',
    bgColor: 'bg-green-500'
  },
  'idle': {
    text: 'Ausente',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500'
  },
  'dnd': {
    text: 'Não Perturbar',
    color: 'text-red-400',
    bgColor: 'bg-red-500'
  },
  'offline': {
    text: 'Offline',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500'
  }
};
