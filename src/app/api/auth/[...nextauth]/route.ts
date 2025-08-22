import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect();
          
          // Verificar se o usuário já existe
          const existingUser = await User.findOne({ userEmail: user.email });
          
          if (!existingUser) {
            // Marcar que é um novo usuário no token (não criar no banco ainda)
            return { isNewUser: true };
          }
          
          return true;
        } catch (error) {
          console.error('Erro ao verificar usuário:', error);
          return false;
        }
      }
      return true;
    },
        async session({ session, token }) {
      if (session.user?.email) {
        try {
          await dbConnect();
          const user = await User.findOne({ userEmail: session.user.email });
          
          if (user) {
            session.user.id = user._id.toString();
            session.user.userName = user.userName;
            session.user.userPhone = user.userPhone;
            session.user.userDatas = user.userDatas;
            session.user.isNewUser = false;
          } else {
            session.user.isNewUser = true;
            session.user.userPhone = null;
            session.user.userDatas = [];
          }
        } catch (error) {
          console.error('Erro ao buscar usuário na sessão:', error);
        }
      }
      
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.userName = user.userName;
        token.userPhone = user.userPhone;
        token.userDatas = user.userDatas;
      }
      
      // Se é um novo usuário, marcar no token
      if (account?.provider === 'google' && user?.isNewUser) {
        token.isNewUser = true;
      }
      
      return token;
    },
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST };
