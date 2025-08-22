import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Corte from '@/models/Corte';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { userEmail, userName } = await request.json();
    
    if (!userEmail || !userName) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    await dbConnect();
    
    // Buscar cortes confirmados do usuário
    const cortes = await Corte.find({
      nome: userName,
      status: 'confirmado'
    }).sort({ createdAt: -1 }); // Mais recentes primeiro

    return NextResponse.json({ 
      success: true, 
      cortes: cortes,
      totalPontos: cortes.length
    });

  } catch (error) {
    console.error('Erro ao buscar cortes de fidelidade:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
