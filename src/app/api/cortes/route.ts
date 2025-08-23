import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Corte from '@/models/Corte';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Buscar todos os cortes da coleção
    const cortes = await Corte.find({}).sort({ data: -1, horario: -1 });
    
    return NextResponse.json({ 
      success: true, 
      data: cortes,
      count: cortes.length 
    });
    
  } catch (error) {
    console.error('Erro ao buscar cortes:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}
