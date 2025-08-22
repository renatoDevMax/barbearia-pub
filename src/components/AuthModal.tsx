'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { FaGoogle, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { redirect: false });
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Detectar quando o login é bem-sucedido
  useEffect(() => {
    if (session && onSuccess && isOpen) {
      onSuccess();
    }
  }, [session, onSuccess, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Conteúdo do modal */}
        <div className="text-center">
          {!session ? (
            <>
                             <h2 className="text-2xl font-bold text-gray-800 mb-4">
                 Sistema Fidelidade
               </h2>
               <div className="flex justify-center mb-4">
                 <Image
                   src="/logo.jpg"
                   alt="Carlos Souza Barbearia Pub"
                   width={200}
                   height={60}
                   className="h-50 w-auto object-contain rounded-xl"
                 />
               </div>
               <p className="text-gray-600 mb-6">
                 Entre para participar do programa de fidelidade. Seu décimo corte é grátis!
               </p>
              
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaGoogle className="text-red-500 text-xl" />
                <span className="font-medium">
                  {isLoading ? 'Entrando...' : 'Entrar com Google'}
                </span>
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Bem-vindo!
              </h2>
                             <div className="mb-6">
                 <p className="text-gray-600 mb-2">
                   Logado como:
                 </p>
                 <p className="font-semibold text-gray-800">
                   {session.user?.userName || session.user?.name}
                 </p>
                 <p className="text-sm text-gray-500">
                   {session.user?.email}
                 </p>
                 {session.user?.userPhone && (
                   <p className="text-sm text-gray-500">
                     📱 {session.user.userPhone}
                   </p>
                 )}
               </div>
              
              <button
                onClick={handleSignOut}
                disabled={isLoading}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saindo...' : 'Sair'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
