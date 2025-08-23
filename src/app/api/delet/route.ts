import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Corte from '@/models/Corte';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Pegar o corpo da requisição
    const corteData = await request.json();
    
    // Verificar se o ID foi fornecido
    if (!corteData._id) {
      const errorResponse = NextResponse.json(
        { 
          success: false, 
          error: 'ID do corte é obrigatório' 
        },
        { status: 400 }
      );
      
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return errorResponse;
    }
    
    // Buscar o corte antes de deletar para verificar se existe
    const corteExistente = await Corte.findById(corteData._id);
    
    if (!corteExistente) {
      const errorResponse = NextResponse.json(
        { 
          success: false, 
          error: 'Corte não encontrado' 
        },
        { status: 404 }
      );
      
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return errorResponse;
    }
    
    // Deletar o corte do banco de dados
    const deletedCorte = await Corte.findByIdAndDelete(corteData._id);
    
    // Configurar CORS
    const response = NextResponse.json({ 
      success: true, 
      message: 'Corte deletado com sucesso',
      data: deletedCorte
    });
    
    // Adicionar headers CORS
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
    
  } catch (error) {
    console.error('Erro ao deletar corte:', error);
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
