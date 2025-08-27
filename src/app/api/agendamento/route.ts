import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Corte from '@/models/Corte';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { data, horario, barbeiro, service } = await request.json();
    
    if (!data || !horario || !barbeiro || !service) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    await dbConnect();
    
    // Buscar dados do usuário no banco
    const user = await User.findOne({ userEmail: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 400 });
    }
    
    if (!user.userPhone) {
      return NextResponse.json({ error: 'Telefone não cadastrado. Complete seu perfil primeiro.' }, { status: 400 });
    }

    // Criar novo agendamento
    const novoCorte = await Corte.create({
      nome: user.userName,
      telefone: user.userPhone,
      status: 'agendado',
      data: new Date(data),
      horario: horario,
      barbeiro: barbeiro,
      service: service,
      userId: user._id.toString(),
    });

    if (!novoCorte) {
      return NextResponse.json({ error: 'Erro ao salvar agendamento' }, { status: 500 });
    }

    console.log(`Corte agendado para: ${user.userName}`);
    return NextResponse.json({ 
      success: true, 
      agendamento: novoCorte 
    });

  } catch (error) {
    console.error('Erro ao salvar agendamento:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
