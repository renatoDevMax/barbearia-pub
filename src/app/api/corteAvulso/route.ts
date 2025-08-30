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
    const body = await request.json();
    console.log('Dados recebidos:', body);
    
    const { nome, telefone, status, data, horario, barbeiro, service, userId } = body;

    // Validações obrigatórias
    if (!nome || !telefone || !status || !data || !horario || !barbeiro || !service) {
      console.log('Dados faltando:', { nome: !!nome, telefone: !!telefone, status: !!status, data: !!data, horario: !!horario, barbeiro: !!barbeiro, service: !!service });
      return NextResponse.json({ 
        error: 'Dados incompletos. Nome, telefone, status, data, horário, barbeiro e service são obrigatórios' 
      }, { status: 400, headers: corsHeaders });
    }

    // Validar se o service é válido
    const servicesValidos = ['cabelo', 'cabelo e barba'];
    if (!servicesValidos.includes(service)) {
      console.log('Service inválido:', service);
      return NextResponse.json({ 
        error: 'Service deve ser: cabelo ou cabelo e barba' 
      }, { status: 400, headers: corsHeaders });
    }

    // Validar se o status é válido
    const statusValidos = ['agendado', 'confirmado', 'cancelado', 'realizado', 'fechado'];
    if (!statusValidos.includes(status)) {
      console.log('Status inválido:', status);
      return NextResponse.json({ 
        error: 'Status deve ser: agendado, confirmado, cancelado, realizado ou fechado' 
      }, { status: 400, headers: corsHeaders });
    }

    // Conectar ao banco
    await dbConnect();

    // Tratar a data
    let dataFormatada;
    if (typeof data === 'string') {
      dataFormatada = new Date(data);
    } else if (data && data.$date) {
      dataFormatada = new Date(data.$date);
    } else {
      dataFormatada = new Date(data);
    }

    console.log('Data formatada:', dataFormatada);

    // Criar o objeto de corte avulso
    const corteAvulso = await Corte.create({
      nome,
      telefone,
      status,
      data: dataFormatada,
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
