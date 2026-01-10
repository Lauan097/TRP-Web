import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Tenta buscar do GitHub (Funciona em Produção se o repo for público)
    // Se o repositório for privado, você precisará adicionar um token de acesso pessoal nos headers ou usar a API do GitHub
    const response = await fetch('https://raw.githubusercontent.com/Evillxz/TRP-Bot/main/package.json', { 
      next: { revalidate: 300 } // Cache por 5 minutos
    });
    
    if (response.ok) {
      const pkg = await response.json();
      return NextResponse.json({ version: pkg.version });
    }
    
    return NextResponse.json({ version: 'v1.0.0' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching bot version:', error);
    return NextResponse.json({ version: 'v1.0.0' }, { status: 500 });
  }
}
