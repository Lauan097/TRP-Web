import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/utils/constants';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/site/recruitment/status`, { 
      cache: 'no-store',
      headers: {
        'x-api-key': process.env.API_KEY || ''
      }
    });
    
    if (!response.ok) {
        // Se der erro, assumimos fechado por segurança
        return NextResponse.json({ isOpen: false });
    }
    
    const data = await response.json();
    // O backend retorna { isOpen: boolean, cycle: ... } ou algo assim?
    // Vamos verificar o backend recruitment.js novamente.
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching recruitment status:', error);
    return NextResponse.json({ isOpen: false });
  }
}
