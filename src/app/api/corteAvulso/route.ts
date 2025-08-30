import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Corte from '@/models/Corte';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request: NextRequest) {
  try {
    const { nome, telefone, status, data, horario, barbeiro, service, userId } = await request.json();

    // Validações obrigatórias
    if (!nome || !telefone || !status || !data || !horario || !barbeiro || !service) {
      return NextResponse.json({ 
        error: 'Dados incompletos. Nome, telefone, status, data, horário, barbeiro e service são obrigatórios' 
      }, { status: 400, headers: corsHeaders });
    }

    // Validar se o service é válido
    const servicesValidos = ['cabelo', 'cabelo e barba'];
    if (!servicesValidos.includes(service)) {
      return NextResponse.json({ 
        error: 'Service deve ser: cabelo ou cabelo e barba' 
      }, { status: 400, headers: corsHeaders });
    }

    // Validar se o status é válido
    const statusValidos = ['aberto', 'fechado', 'cancelado'];
    if (!statusValidos.includes(status)) {
      return NextResponse.json({ 
        error: 'Status deve ser: aberto, fechado ou cancelado' 
      }, { status: 400, headers: corsHeaders });
    }

    // Validar se o barbeiro é válido
    const barbeirosValidos = ['José Antonio', 'Gustavo Souza', 'André Silva'];
    if (!barbeirosValidos.includes(barbeiro)) {
      return NextResponse.json({ 
        error: 'Barbeiro deve ser: José Antonio, Gustavo Souza ou André Silva' 
      }, { status: 400, headers: corsHeaders });
    }

    // Conectar ao banco
    await dbConnect();

    // Criar o objeto de corte avulso
    const corteAvulso = await Corte.create({
      nome,
      telefone,
      status,
      data: new Date(data),
      horario,
      barbeiro,
      service,
      userId: userId || 'usuario não cadastrado'
    });

    return NextResponse.json({
      success: true,
      message: 'Corte avulso adicionado com sucesso',
      data: corteAvulso
    }, { status: 201, headers: corsHeaders });

  } catch (error) {
    console.error('Erro ao adicionar corte avulso:', error);
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
