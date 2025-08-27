import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Despesa from '@/models/Despesa';

// Configuração CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function PUT(request: NextRequest) {
  try {
    const { _id, nome, valor, recorrencia, data } = await request.json();
    
    // Validação do ID
    if (!_id) {
      return NextResponse.json({ 
        error: 'ID da despesa é obrigatório' 
      }, { status: 400, headers: corsHeaders });
    }

    // Validação dos campos obrigatórios
    if (!nome || valor === undefined || !recorrencia) {
      return NextResponse.json({ 
        error: 'Dados incompletos. Nome, valor e recorrência são obrigatórios' 
      }, { status: 400, headers: corsHeaders });
    }

    // Validação do valor
    if (typeof valor !== 'number' || valor < 0) {
      return NextResponse.json({ 
        error: 'Valor deve ser um número positivo' 
      }, { status: 400, headers: corsHeaders });
    }

    // Validação da recorrência
    const recorrenciasValidas = ['individual', 'periodica'];
    if (!recorrenciasValidas.includes(recorrencia)) {
      return NextResponse.json({ 
        error: 'Recorrência deve ser: individual ou periodica' 
      }, { status: 400, headers: corsHeaders });
    }

    await dbConnect();
    
    // Buscar a despesa pelo ID
    const despesaExistente = await Despesa.findById(_id);
    
    if (!despesaExistente) {
      return NextResponse.json({ 
        error: 'Despesa não encontrada' 
      }, { status: 404, headers: corsHeaders });
    }

    // Atualizar a despesa
    const despesaAtualizada = await Despesa.findByIdAndUpdate(
      _id,
      {
        nome,
        valor,
        recorrencia,
        data: data ? new Date(data) : despesaExistente.data
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Despesa atualizada com sucesso',
      data: despesaAtualizada 
    }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Erro ao atualizar despesa:', error);
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
