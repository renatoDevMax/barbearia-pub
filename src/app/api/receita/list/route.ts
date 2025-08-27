import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Corte from '@/models/Corte';
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
    
    // Buscar todos os cortes ordenados por data (mais recentes primeiro)
    const cortes = await Corte.find({}).sort({ data: -1 });
    
    // Buscar todas as despesas ordenadas por data (mais recentes primeiro)
    const despesas = await Despesa.find({}).sort({ data: -1 });
    
    // Calcular totais
    const totalReceita = cortes.reduce((total, corte) => {
      const valor = corte.service === 'cabelo' ? 45 : 65;
      return total + valor;
    }, 0);
    
    const totalDespesas = despesas.reduce((total, despesa) => total + despesa.valor, 0);
    const lucro = totalReceita - totalDespesas;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Dados de receita listados com sucesso',
      data: {
        cortes,
        despesas,
        totais: {
          receita: totalReceita,
          despesas: totalDespesas,
          lucro: lucro
        }
      }
    }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Erro ao listar dados de receita:', error);
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
