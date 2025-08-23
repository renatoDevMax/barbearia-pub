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
    
    // Remover campos que não devem ser atualizados
    const { _id, __v, createdAt, updatedAt, ...updateData } = corteData;
    
    // Atualizar o corte no banco de dados
    const updatedCorte = await Corte.findByIdAndUpdate(
      _id,
      updateData,
      { 
        new: true, // Retorna o documento atualizado
        runValidators: true // Executa validações do schema
      }
    );
    
    // Verificar se o corte foi encontrado
    if (!updatedCorte) {
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
    
    // Configurar CORS
    const response = NextResponse.json({ 
      success: true, 
      message: 'Corte atualizado com sucesso',
      data: updatedCorte
    });
    
    // Adicionar headers CORS
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
    
  } catch (error) {
    console.error('Erro ao atualizar corte:', error);
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
