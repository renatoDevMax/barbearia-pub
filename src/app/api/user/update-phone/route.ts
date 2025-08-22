import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { phone } = await request.json();
    
    if (!phone) {
      return NextResponse.json({ error: 'Telefone é obrigatório' }, { status: 400 });
    }

    await dbConnect();
    
    // Verificar se o usuário já existe
    let user = await User.findOne({ userEmail: session.user.email });
    
    if (!user) {
      // Criar novo usuário com telefone
      user = await User.create({
        userName: session.user.name,
        userEmail: session.user.email,
        userPhone: phone,
        userDatas: [],
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      });
    } else {
      // Atualizar telefone do usuário existente
      user = await User.findOneAndUpdate(
        { userEmail: session.user.email },
        { userPhone: phone },
        { new: true }
      );
    }

    if (!user) {
      return NextResponse.json({ error: 'Erro ao salvar usuário' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      userPhone: user.userPhone 
    });

  } catch (error) {
    console.error('Erro ao salvar telefone:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
