'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import PhoneModal from './PhoneModal';

export default function PhoneModalWrapper() {
  const { data: session, status } = useSession();
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  useEffect(() => {
    // Verificar se é um novo usuário (não existe no banco ainda)
    if (session?.user?.isNewUser === true) {
      setShowPhoneModal(true);
    }
  }, [session]);

  const handlePhoneSuccess = () => {
    setShowPhoneModal(false);
    // Recarregar a página para atualizar a sessão
    window.location.reload();
  };

  const handlePhoneClose = () => {
    setShowPhoneModal(false);
  };

  return (
    <PhoneModal
      isOpen={showPhoneModal}
      onClose={handlePhoneClose}
      onSuccess={handlePhoneSuccess}
    />
  );
}
