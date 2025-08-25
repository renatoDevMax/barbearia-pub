import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Corte from '@/models/Corte';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Pegar o corpo da requisição
    const resgateData = await request.json();
    
    // Verificar se o nome foi fornecido
    if (!resgateData.nome) {
      const errorResponse = NextResponse.json(
        { 
          success: false, 
          error: 'Nome é obrigatório' 
        },
        { status: 400 }
      );
      
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return errorResponse;
    }
    
    // Buscar os últimos 10 cortes confirmados do usuário
    const cortesConfirmados = await Corte.find({
      nome: resgateData.nome,
      status: 'confirmado'
    })
    .sort({ data: -1, horario: -1 }) // Ordenar por data e hora (mais recentes primeiro)
    .limit(10); // Limitar a 10 registros
    
    if (cortesConfirmados.length < 10) {
      const errorResponse = NextResponse.json(
        { 
          success: false, 
          error: `Usuário não possui 10 cortes confirmados. Possui apenas ${cortesConfirmados.length} cortes.` 
        },
        { status: 400 }
      );
      
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return errorResponse;
    }
    
    // Extrair os IDs dos cortes para atualização
    const cortesIds = cortesConfirmados.map(corte => corte._id);
    
    // Atualizar o status dos 10 cortes para "fechado"
    const resultado = await Corte.updateMany(
      { _id: { $in: cortesIds } },
      { status: 'fechado' }
    );
    
    if (resultado.modifiedCount !== 10) {
      const errorResponse = NextResponse.json(
        { 
          success: false, 
          error: 'Erro ao atualizar os cortes' 
        },
        { status: 500 }
      );
      
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return errorResponse;
    }
    
    // Configurar CORS
    const response = NextResponse.json({ 
      success: true, 
      message: 'Resgate realizado com sucesso! 10 pontos foram resgatados.',
      data: {
        nome: resgateData.nome,
        cortesResgatados: resultado.modifiedCount,
        cortesAtualizados: cortesIds
      }
    });
    
    // Adicionar headers CORS
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
    
  } catch (error) {
    console.error('Erro ao realizar resgate:', error);
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
