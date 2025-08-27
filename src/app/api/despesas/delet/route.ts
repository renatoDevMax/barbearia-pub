import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Despesa from '@/models/Despesa';

// Configuração CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function DELETE(request: NextRequest) {
  try {
    const { _id } = await request.json();
    
    // Validação do ID
    if (!_id) {
      return NextResponse.json({ 
        error: 'ID da despesa é obrigatório' 
      }, { status: 400, headers: corsHeaders });
    }

    await dbConnect();
    
    // Buscar a despesa pelo ID para verificar se existe
    const despesaExistente = await Despesa.findById(_id);
    
    if (!despesaExistente) {
      return NextResponse.json({ 
        error: 'Despesa não encontrada' 
      }, { status: 404, headers: corsHeaders });
    }

    // Deletar a despesa
    await Despesa.findByIdAndDelete(_id);

    return NextResponse.json({ 
      success: true, 
      message: 'Despesa deletada com sucesso',
      data: { _id }
    }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Erro ao deletar despesa:', error);
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
