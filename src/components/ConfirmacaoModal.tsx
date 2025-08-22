'use client';

import { useEffect } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ConfirmacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfirmacaoModal({ isOpen, onClose }: ConfirmacaoModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      // Fechar modal e redirecionar após 5 segundos
      const timer = setTimeout(() => {
        onClose();
        router.push('/');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
        {/* Botão fechar */}
        <button
          onClick={() => {
            onClose();
            router.push('/');
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Conteúdo do modal */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.jpg"
              alt="Carlos Souza Barbearia Pub"
              width={200}
              height={60}
              className="h-50 w-auto object-contain rounded-xl"
            />
          </div>
          
          <div className="mb-6">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Agendamento Confirmado!
            </h2>
            <p className="text-gray-600">
              Seu corte foi agendado com sucesso. Agradecemos a preferência!
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">
              Você será redirecionado automaticamente em alguns segundos...
            </p>
          </div>
          
          <button
            onClick={() => {
              onClose();
              router.push('/');
            }}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    </div>
  );
}
