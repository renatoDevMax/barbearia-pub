import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Corte from '@/models/Corte';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Data atual (início do dia)
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    // Buscar agendamentos ativos da data atual em diante
    const agendamentosAtivos = await Corte.find({
      status: 'agendado',
      data: { $gte: hoje }
    }).sort({ data: 1, horario: 1 });
    
    // Configurar CORS
    const response = NextResponse.json({ 
      success: true, 
      data: agendamentosAtivos,
      count: agendamentosAtivos.length 
    });
    
    // Adicionar headers CORS
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
    
  } catch (error) {
    console.error('Erro ao buscar agendamentos ativos:', error);
    const errorResponse = NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    );
    
    // Adicionar headers CORS também no erro
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return errorResponse;
  }
}

// Adicionar método OPTIONS para preflight requests
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}
