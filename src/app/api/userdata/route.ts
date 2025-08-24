import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Pegar o corpo da requisição
    const userData = await request.json();
    
    // Verificar se o userName foi fornecido
    if (!userData.userName) {
      const errorResponse = NextResponse.json(
        { 
          success: false, 
          error: 'userName é obrigatório' 
        },
        { status: 400 }
      );
      
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return errorResponse;
    }
    
    // Buscar o usuário pelo userName
    const user = await User.findOne({ userName: userData.userName });
    
    if (!user) {
      const errorResponse = NextResponse.json(
        { 
          success: false, 
          error: 'Usuário não encontrado' 
        },
        { status: 404 }
      );
      
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return errorResponse;
    }
    
    // Gerar data atual
    const dataAtual = new Date().toISOString();
    
    // Adicionar a data atual na lista userDatas
    const userDatasAtualizada = [...(user.userDatas || []), dataAtual];
    
    // Atualizar o usuário no banco de dados
    const userAtualizado = await User.findByIdAndUpdate(
      user._id,
      { userDatas: userDatasAtualizada },
      { new: true, runValidators: true }
    );
    
    if (!userAtualizado) {
      const errorResponse = NextResponse.json(
        { 
          success: false, 
          error: 'Erro ao atualizar usuário' 
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
      message: 'Data adicionada com sucesso',
      data: {
        userName: userAtualizado.userName,
        userDatas: userAtualizado.userDatas,
        dataAdicionada: dataAtual
      }
    });
    
    // Adicionar headers CORS
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
    
  } catch (error) {
    console.error('Erro ao adicionar data do usuário:', error);
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
