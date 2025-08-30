import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Corte from '@/models/Corte';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Pegar o corpo da requisição
    const corteData = await request.json();
    
    // Verificar campos obrigatórios
    if (!corteData.nome || !corteData.telefone || !corteData.barbeiro || !corteData.userId || !corteData.service) {
      const errorResponse = NextResponse.json(
        { 
          success: false, 
          error: 'Campos obrigatórios: nome, telefone, barbeiro, userId, service' 
        },
        { status: 400 }
      );
      
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return errorResponse;
    }

    // Validar se o service é válido
    const servicesValidos = ['cabelo', 'cabelo e barba'];
    if (!servicesValidos.includes(corteData.service)) {
      const errorResponse = NextResponse.json(
        { 
          success: false, 
          error: 'Service deve ser: cabelo ou cabelo e barba' 
        },
        { status: 400 }
      );
      
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return errorResponse;
    }
    
    // Gerar data e hora atual
    const agora = new Date();
    const data = agora.toISOString();
    const horario = agora.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    
    // Criar objeto completo para salvar no banco
    const corteCompleto = {
      nome: corteData.nome,
      telefone: corteData.telefone,
      status: corteData.status || 'agendado', // Status padrão se não fornecido
      data: data,
      horario: horario,
      barbeiro: corteData.barbeiro,
      service: corteData.service,
      userId: corteData.userId
    };
    
    // Salvar no banco de dados
    const novoCorte = await Corte.create(corteCompleto);
    
    if (!novoCorte) {
      const errorResponse = NextResponse.json(
        { 
          success: false, 
          error: 'Erro ao salvar corte' 
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
      message: 'Corte adicionado com sucesso',
      data: novoCorte
    });
    
    // Adicionar headers CORS
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
    
  } catch (error) {
    console.error('Erro ao adicionar corte:', error);
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
