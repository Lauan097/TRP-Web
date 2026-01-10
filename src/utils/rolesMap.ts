export const ROLE_MAP: Record<string, { name: string; color: string; bg?: string }> = {
  '1446158406561042602': { name: 'Associados', color: 'text-gray-100', bg: 'bg-gray-700/30' },
  '1446157127214305370': { name: "3° Operário", color: 'text-yellow-300', bg: 'bg-yellow-600/16' },
  '1446157527262695506': { name: "2° Operário", color: 'text-yellow-300', bg: 'bg-yellow-600/12' },
  '1446157691448856616': { name: 'Operário', color: 'text-yellow-400', bg: 'bg-yellow-500/12' },
  '1446130792815267962': { name: "3° Soldado", color: 'text-slate-200', bg: 'bg-slate-600/12' },
  '1446130767305375834': { name: "2° Soldado", color: 'text-slate-200', bg: 'bg-slate-600/10' },
  '1446130709172457522': { name: 'Soldado', color: 'text-white', bg: 'bg-slate-800/20' },
  '1446129859171586078': { name: "3° Regime Principal", color: 'text-indigo-300', bg: 'bg-indigo-600/10' },
  '1446129750513811556': { name: "2° Regime Principal", color: 'text-indigo-300', bg: 'bg-indigo-600/12' },
  '1446129387521966182': { name: 'Regime Principal', color: 'text-indigo-200', bg: 'bg-indigo-700/14' },
  '1446128918326153280': { name: 'Conselheiro', color: 'text-rose-300', bg: 'bg-rose-600/12' },
  '1446128149187399761': { name: 'Gerente', color: 'text-emerald-300', bg: 'bg-emerald-600/12' },
  '1446127626703077437': { name: 'Braço Esquerdo', color: 'text-pink-300', bg: 'bg-pink-600/12' },
  '1446126883111436389': { name: 'Braço Direito', color: 'text-fuchsia-300', bg: 'bg-fuchsia-600/12' },
  '1446125458981781616': { name: 'Sub Chefe', color: 'text-orange-300', bg: 'bg-orange-600/12' },
  '1361018915576217681': { name: 'Chefe', color: 'text-red-300', bg: 'bg-red-600/14' },
  '1365475846843928617': { name: 'Programador', color: 'text-cyan-300', bg: 'bg-cyan-600/12' }
};

export const ROLE_PRIORITY = [
  '1365475846843928617', // Programador (cargo especial)
  '1361018915576217681', // Chefe
  '1446125458981781616', // Sub Chefe
  '1446126883111436389', // Braço Direito
  '1446127626703077437', // Braço Esquerdo
  '1446128149187399761', // Gerente
  '1446128918326153280', // Conselheiro
  '1446129387521966182', // Regime Principal
  '1446129750513811556', // 2° Regime Principal
  '1446129859171586078', // 3° Regime Principal
  '1446130709172457522', // Soldado
  '1446130767305375834', // 2° Soldado
  '1446130792815267962', // 3° Soldado
  '1446157691448856616', // Operário
  '1446157527262695506', // 2° Operário
  '1446157127214305370', // 3° Operário
  '1446158406561042602', // Associados
];

export function getRoleById(id: string) {
  return ROLE_MAP[id] || null;
}

import { RoleData } from "./apiClient";

export function getHighestRoleFromIds(roles: RoleData[] | undefined): { id: string; name: string; color?: string; bg?: string } | null {
  if (!roles || roles.length === 0) return null;
  
  const userRolesMap = new Map(roles.map(r => [r.id, r]));

  for (const id of ROLE_PRIORITY) {
    if (userRolesMap.has(id)) {
      const apiRole = userRolesMap.get(id);
      const staticRole = getRoleById(id);
      
      const colorToUse = (apiRole?.color && apiRole.color !== '#000000') 
        ? apiRole.color 
        : staticRole?.color;

      return { 
        id, 
        name: apiRole?.name || staticRole?.name || id, 
        color: colorToUse, 
        bg: staticRole?.bg
      };
    }
  }
  return null;
}

export default ROLE_MAP;
