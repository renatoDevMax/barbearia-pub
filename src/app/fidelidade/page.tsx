'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import QRCode from 'qrcode';

export default function FidelidadePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [pontos, setPontos] = useState(0);
  const [cortesConfirmados, setCortesConfirmados] = useState([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [showHistoricoModal, setShowHistoricoModal] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    const buscarCortesConfirmados = async () => {
      try {
        const response = await fetch('/api/fidelidade', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail: session.user.email,
            userName: session.user.userName || session.user.name
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setCortesConfirmados(data.cortes);
          setPontos(data.cortes.length);
        }
      } catch (error) {
        console.error('Erro ao buscar cortes:', error);
      } finally {
        setLoading(false);
      }
    };

    buscarCortesConfirmados();
  }, [session, status]);

  const handleAdicionarCorte = async () => {
    if (!session?.user) return;
    
    try {
      // Criar objeto para o QR Code
      const qrData = {
        nome: session.user.userName || session.user.name,
        telefone: session.user.userPhone,
        status: "confirmado",
        userId: session.user.id
      };
      
      // Gerar QR Code
      const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeDataUrl(qrCodeUrl);
      setShowQRModal(true);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  const handleResgatarCorte = async () => {
    if (!session?.user) return;
    
    try {
      // Criar objeto para o QR Code (mesmo do adicionar corte)
      const qrData = {
        nome: session.user.userName || session.user.name,
        telefone: session.user.userPhone,
        status: "confirmado",
        userId: session.user.id
      };
      
      // Gerar QR Code
      const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeDataUrl(qrCodeUrl);
      setShowQRModal(true);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  const handleHistoricoCortes = () => {
    setShowHistoricoModal(true);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="flex-1 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Carregando seus pontos...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="flex-1 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Programa de Fidelidade
              </h1>
              <p className="text-lg text-gray-600">
                Faça login para acompanhar seus pontos de fidelidade.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Informações adicionais */}
          <div className="text-center mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Seus Pontos Atuais
              </h3>
              <p className="text-3xl font-bold text-blue-600 mb-2">{pontos}</p>
              <p className="text-sm text-gray-500">
                {pontos >= 10 
                  ? "Parabéns! Você pode resgatar um corte gratuito!"
                  : `Faltam ${10 - pontos} pontos para resgatar um corte gratuito`
                }
              </p>
            </div>
          </div>

          {/* Grid de pontos */}
          <div className="flex justify-center mb-12">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {/* 10 quadrados - 2 por linha, 5 linhas */}
              {Array.from({ length: 10 }, (_, index) => (
                <div
                  key={index}
                  className="w-16 h-16 md:w-20 md:h-20 bg-gray-900 border-2 border-gray-300 rounded-lg shadow-md flex items-center justify-center transition-all duration-300 hover:shadow-lg overflow-hidden"
                >
                  {index < pontos && (
                    <Image
                      src="/fundoremv2.png"
                      alt="Ponto ganho"
                      width={40}
                      height={40}
                      className="w-12 h-12 md:w-16 md:h-16 object-contain"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Texto explicativo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Programa de Fidelidade
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Acompanhe sua pontuação com os cortes realizados. A cada corte você ganha 1 ponto. 
              Com 10 pontos você pode resgatar um corte gratuito!
            </p>
          </div>
            
          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleAdicionarCorte}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Adicionar Corte
            </button>
            <button 
              onClick={handleResgatarCorte}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                pontos >= 10 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={pontos < 10}
            >
              Resgatar Corte Fidelidade
            </button>
            <button 
              onClick={handleHistoricoCortes}
              className="px-6 py-3 bg-amber-950 text-white rounded-lg font-medium hover:bg-amber-900 transition-colors"
            >
              Histórico de Cortes
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal QR Code */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Exiba isso para seu Barbeiro
              </h3>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  <strong>Nome:</strong> {session?.user?.userName || session?.user?.name}
                </p>
              </div>
              
              <div className="mb-6 flex justify-center">
                {qrCodeDataUrl && (
                  <img 
                    src={qrCodeDataUrl} 
                    alt="QR Code" 
                    className="w-64 h-64 border-2 border-gray-300 rounded-lg"
                  />
                )}
              </div>
              
              <div className="text-sm text-gray-500 mb-4">
                <p>Escaneie este QR Code para adicionar um corte</p>
              </div>
              
              <button
                onClick={() => setShowQRModal(false)}
                className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Histórico de Cortes */}
      {showHistoricoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Histórico de Cortes
              </h3>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  <strong>Cliente:</strong> {session?.user?.userName || session?.user?.name}
                </p>
              </div>
              
              {/* Lista de datas com scroll */}
              <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {session?.user?.userDatas && session.user.userDatas.length > 0 ? (
                  <div className="space-y-2">
                                         {session.user.userDatas
                       .sort((a: any, b: any) => new Date(b).getTime() - new Date(a).getTime()) // Ordenar do mais recente para o mais antigo
                       .map((data: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-800 font-medium">
                            {new Date(data).toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {new Date(data).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhum corte registrado ainda.</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowHistoricoModal(false)}
                className="w-full mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
