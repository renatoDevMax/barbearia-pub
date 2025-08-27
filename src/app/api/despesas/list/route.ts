import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Despesa from '@/models/Despesa';

// Configuração CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Buscar todas as despesas ordenadas por data (mais recentes primeiro)
    const despesas = await Despesa.find({}).sort({ data: -1 });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Despesas listadas com sucesso',
      data: despesas 
    }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Erro ao listar despesas:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500, headers: corsHeaders });
  }
}

// Handler para requisições OPTIONS (preflight)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
