'use client';

import { useState } from 'react';
import { FaPhone, FaTimes } from 'react-icons/fa';
import Image from 'next/image';

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PhoneModal({ isOpen, onClose, onSuccess }: PhoneModalProps) {
  const [phone, setPhone] = useState('');
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);



  const handleUpdatePhone = async () => {
    if (!phone.trim()) {
      alert('Por favor, insira um número de telefone');
      return;
    }


    
    setIsUpdatingPhone(true);
    try {
      const response = await fetch('/api/user/update-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phone.trim() }),
      });

      if (response.ok) {
        setPhone('');
        onSuccess();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Erro ao salvar telefone');
      }
    } catch (error) {
      console.error('Erro ao atualizar telefone:', error);
      alert('Erro ao salvar telefone. Tente novamente.');
    } finally {
      setIsUpdatingPhone(false);
    }
  };

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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Bem-vindo!
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
            Para completar seu cadastro, adicione seu número de telefone:
          </p>
          
          <div className="space-y-4">
                         <input
               type="tel"
               value={phone}
               onChange={(e) => setPhone(e.target.value)}
               placeholder="(41) 99999-9999"
               className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

             />
            
            <button
              onClick={handleUpdatePhone}
              disabled={isUpdatingPhone || !phone.trim()}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <FaPhone className="text-lg" />
              <span>{isUpdatingPhone ? 'Salvando...' : 'Completar Cadastro'}</span>
            </button>
            
            <button
              onClick={onClose}
              className="w-full text-gray-500 px-6 py-2 rounded-lg font-medium hover:text-gray-700 transition-colors"
            >
              Pular por enquanto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
