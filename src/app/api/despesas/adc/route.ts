import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Despesa from '@/models/Despesa';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { nome, valor, recorrencia, data } = await request.json();
    
    // Validação dos campos obrigatórios
    if (!nome || valor === undefined || !recorrencia) {
      return NextResponse.json({ 
        error: 'Dados incompletos. Nome, valor e recorrência são obrigatórios' 
      }, { status: 400 });
    }

    // Validação do valor
    if (typeof valor !== 'number' || valor < 0) {
      return NextResponse.json({ 
        error: 'Valor deve ser um número positivo' 
      }, { status: 400 });
    }

    // Validação da recorrência
    const recorrenciasValidas = ['única', 'mensal', 'semanal', 'diária'];
    if (!recorrenciasValidas.includes(recorrencia)) {
      return NextResponse.json({ 
        error: 'Recorrência deve ser: única, mensal, semanal ou diária' 
      }, { status: 400 });
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
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao adicionar despesa:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}
