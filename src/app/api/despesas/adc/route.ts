import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Despesa from '@/models/Despesa';

// Configuração CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request: NextRequest) {
  try {

    const { nome, valor, recorrencia, data } = await request.json();
    
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
        error: 'Recorrência deve ser: individual ou periodico' 
      }, { status: 400, headers: corsHeaders });
    }

    await dbConnect();
    
    // Criar nova despesa
    const novaDespesa = new Despesa({
      nome,
      valor,
      recorrencia,
      data: data ? new Date(data) : new Date()
    });

    await novaDespesa.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Despesa adicionada com sucesso',
      data: novaDespesa 
    }, { status: 201, headers: corsHeaders });

  } catch (error) {
    console.error('Erro ao adicionar despesa:', error);
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
