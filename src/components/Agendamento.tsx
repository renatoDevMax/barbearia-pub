'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import AuthModal from './AuthModal';
import ConfirmacaoModal from './ConfirmacaoModal';

export default function Agendamento() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTimeSelection, setShowTimeSelection] = useState(false);
  const [showBarberSelection, setShowBarberSelection] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showConfirmacaoModal, setShowConfirmacaoModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [agendamentosAtivos, setAgendamentosAtivos] = useState<any[]>([]);

  const { data: session } = useSession();

  // Carregar agendamentos ativos ao montar o componente
  useEffect(() => {
    const carregarAgendamentosAtivos = async () => {
      try {
        const response = await fetch('/api/agendamentos-ativos');
        if (response.ok) {
          const data = await response.json();
          setAgendamentosAtivos(data.data || []);
        }
      } catch (error) {
        console.error('Erro ao carregar agendamentos ativos:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarAgendamentosAtivos();
  }, []);

  // Função para obter a data mínima (hoje)
  const getMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  // Função para formatar a data selecionada
  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Gerar lista de horários
  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 9; hour <= 20; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 20) {
        times.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return times;
  };

  const timeSlots = generateTimeSlots();

  // Dados dos barbeiros
  const barbeiros = [
    {
      nome: 'José Antonio',
      imagem: "barbeiro1.jpg",
    },
    {
      nome: 'Gustavo Souza',
      imagem: "barbeiro2.jpg",
    },
    {
      nome: 'André Silva',
      imagem: "barbeiro3.jpg",
    }
  ];



  const handleAdvance = () => {
    setShowTimeSelection(true);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBarberSelect = (barberName: string) => {
    setSelectedBarber(barberName);
  };

  const handleTimeAdvance = () => {
    setShowBarberSelection(true);
  };

  const handleBarberAdvance = () => {
    if (session?.user) {
      setShowConfirmation(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setShowConfirmation(true);
  };

  // Função para verificar se um horário está ocupado
  const isHorarioOcupado = (data: Date, horario: string) => {
    const dataFormatada = data.toISOString().split('T')[0];
    return agendamentosAtivos.some(agendamento => {
      const agendamentoData = new Date(agendamento.data).toISOString().split('T')[0];
      return agendamentoData === dataFormatada && agendamento.horario === horario;
    });
  };

  const handleConfirmarAgendamento = async () => {
    if (!selectedDate || !selectedTime || !selectedBarber) {
      alert('Dados incompletos para agendamento');
      return;
    }



    if (!session?.user?.userPhone) {
      alert('Telefone não cadastrado. Complete seu perfil primeiro.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/agendamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: selectedDate.toISOString(),
          horario: selectedTime,
          barbeiro: selectedBarber,
        }),
      });

      if (response.ok) {
        setShowConfirmation(false);
        setShowConfirmacaoModal(true);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Erro ao confirmar agendamento');
      }
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
      alert('Erro ao confirmar agendamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };



  // Loading inicial
  if (loading) {
    return (
      <section className="bg-black text-white min-h-[calc(100dvh-4rem)] flex items-center justify-center py-16 relative overflow-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Carregando horários disponíveis...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black text-white min-h-[calc(100dvh-4rem)] flex items-center justify-center py-16 relative overflow-hidden">
      {/* Seção do Calendário */}
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 transition-transform duration-500 ease-in-out ${
        showTimeSelection ? '-translate-x-full' : 'translate-x-0'
      }`}>
        {/* Título */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Agendar Horário
          </h1>
          <p className="text-xl text-gray-300">
            Escolha a data para seu corte
          </p>
        </div>

        {/* Calendário */}
        <div className="flex justify-center">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-800 w-[calc(100%-40px)] max-w-2xl">
            <Calendar
              onChange={(value) => {
                if (value instanceof Date) {
                  setSelectedDate(value);
                }
              }}
              value={selectedDate}
              minDate={getMinDate()}
              className="custom-calendar"
              tileClassName={({ date, view }) => {
                if (view === 'month') {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const tileDate = new Date(date);
                  tileDate.setHours(0, 0, 0, 0);
                  
                  if (tileDate < today) {
                    return 'disabled-tile';
                  }
                }
                return '';
              }}
            />
          </div>
        </div>

        {/* Botão Avançar */}
        {selectedDate && !showTimeSelection && (
          <div className="text-center mt-8">
            <button 
              onClick={handleAdvance}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Avançar
            </button>
          </div>
        )}
      </div>

             {/* Seção de Seleção de Horário */}
       <div className={`absolute inset-0 bg-black text-white flex items-center justify-center py-16 transition-transform duration-500 ease-in-out ${
         showTimeSelection && !showBarberSelection ? 'translate-x-0' : showTimeSelection && showBarberSelection ? '-translate-x-full' : 'translate-x-full'
       }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Escolha o Horário
            </h1>
            <p className="text-xl text-gray-300">
              Selecione o horário para seu agendamento
            </p>
          </div>

          {/* Carrossel de Horários */}
          <div className="flex justify-center">
            <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-800 w-[calc(100%-40px)] max-w-md">
              {/* Botão Voltar */}
              <div className="flex justify-center mb-4">
                <button 
                  onClick={() => setShowTimeSelection(false)}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  ← Voltar para data
                </button>
              </div>

                             {/* Lista de Horários com Scroll */}
               <div className="relative">
                                   {/* Lista de Horários */}
                  <div className="h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    <div className="space-y-2 pr-2">
                      {timeSlots.map((time, index) => {
                        const horarioOcupado = selectedDate ? isHorarioOcupado(selectedDate, time) : false;
                        return (
                          <button
                            key={time}
                            onClick={() => !horarioOcupado && handleTimeSelect(time)}
                            disabled={horarioOcupado}
                            className={`w-full p-4 rounded-lg text-lg font-medium transition-all duration-300 ${
                              horarioOcupado
                                ? 'bg-red-900 text-red-300 cursor-not-allowed opacity-60'
                                : selectedTime === time
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                            }`}
                          >
                            {time} {horarioOcupado && '(Ocupado)'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
               </div>

                             {/* Botão Avançar */}
               {selectedTime && (
                 <div className="text-center mt-8 mb-4">
                   <button 
                     onClick={handleTimeAdvance}
                     className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                   >
                     Avançar
                   </button>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

             {/* Seção de Seleção de Barbeiro */}
       <div className={`absolute inset-0 bg-black text-white flex items-center justify-center py-16 transition-transform duration-500 ease-in-out ${
         showBarberSelection && !showConfirmation ? 'translate-x-0' : showBarberSelection && showConfirmation ? '-translate-x-full' : 'translate-x-full'
       }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Escolha o Barbeiro
            </h1>
            <p className="text-xl text-gray-300">
              Selecione o profissional para seu agendamento
            </p>
          </div>

          {/* Lista de Barbeiros */}
          <div className="flex justify-center">
            <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-800 w-[calc(100%-40px)] max-w-md">
              {/* Botão Voltar */}
              <div className="flex justify-center mb-4">
                <button 
                  onClick={() => setShowBarberSelection(false)}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  ← Voltar para horário
                </button>
              </div>

              {/* Lista de Barbeiros */}
              <div className="space-y-3">
                {barbeiros.map((barbeiro, index) => (
                  <button
                    key={index}
                    onClick={() => handleBarberSelect(barbeiro.nome)}
                    className={`w-full p-4 rounded-lg text-lg font-medium transition-all duration-300 flex items-center space-x-4 ${
                      selectedBarber === barbeiro.nome
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={`/${barbeiro.imagem}`}
                        alt={barbeiro.nome}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-left">{barbeiro.nome}</span>
                  </button>
                ))}
              </div>

                             {/* Botão Avançar */}
               {selectedBarber && (
                 <div className="text-center mt-6">
                   <button 
                     onClick={handleBarberAdvance}
                     className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                   >
                     Avançar
                   </button>
                 </div>
               )}
            </div>
          </div>
                 </div>
       </div>

                                                               {/* Seção de Confirmação Final */}
          <div className={`absolute inset-0 bg-black text-white flex items-center justify-center py-2 transition-transform duration-500 ease-in-out ${
            showConfirmation && showBarberSelection ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                                                                                               {/* Título */}
              <div className="text-center mb-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  Confirmar Agendamento
                </h1>
                <p className="text-xl text-gray-300">
                  Revise os detalhes do seu agendamento
                </p>
              </div>

                                               {/* Detalhes do Agendamento */}
             <div className="flex justify-center">
               <div className="bg-gray-900 p-4 rounded-2xl shadow-2xl border border-gray-800 w-[calc(100%-40px)] max-w-lg">
                               {/* Botão Voltar */}
                <div className="flex justify-center mb-4">
                 <button 
                   onClick={() => setShowConfirmation(false)}
                   className="text-gray-400 hover:text-white transition-colors text-sm"
                 >
                   ← Voltar para barbeiro
                 </button>
               </div>

                                                               {/* Informações do Agendamento */}
                 <div className="space-y-3">
                                   {/* Nome do Usuário */}
                  <div className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
                   <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                     <span className="text-white font-bold text-lg">
                       {session?.user?.userName?.[0] || session?.user?.name?.[0] || 'U'}
                     </span>
                   </div>
                                       <div>
                      <p className="text-gray-400 text-sm">Cliente</p>
                      <p className="text-white font-semibold">
                        {session?.user?.userName || session?.user?.name || 'Usuário'}
                      </p>
                                             {session?.user?.userPhone && (
                         <p className="text-gray-400 text-sm">
                           📱 {session.user.userPhone}
                         </p>
                       )}
                    </div>
                 </div>

                                   {/* Data */}
                  <div className="p-3 bg-gray-800 rounded-lg">
                   <p className="text-gray-400 text-sm">Data</p>
                   <p className="text-white font-semibold">
                     {selectedDate?.toLocaleDateString('pt-BR', {
                       weekday: 'long',
                       year: 'numeric',
                       month: 'long',
                       day: 'numeric'
                     })}
                   </p>
                 </div>

                                   {/* Horário */}
                  <div className="p-3 bg-gray-800 rounded-lg">
                   <p className="text-gray-400 text-sm">Horário</p>
                   <p className="text-white font-semibold">{selectedTime}</p>
                 </div>

                                   {/* Barbeiro */}
                  <div className="p-3 bg-gray-800 rounded-lg">
                   <p className="text-gray-400 text-sm">Barbeiro</p>
                   <p className="text-white font-semibold">{selectedBarber}</p>
                 </div>
               </div>

                                                                                                                               {/* Botão Confirmar */}
                                     <div className="text-center mt-4 mb-4">
                    <button 
                      onClick={handleConfirmarAgendamento}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Confirmando...' : 'Confirmar Agendamento'}
                    </button>
                  </div>
             </div>
           </div>
         </div>
       </div>

               {/* Modal de Autenticação */}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />

        {/* Modal de Confirmação de Agendamento */}
        <ConfirmacaoModal
          isOpen={showConfirmacaoModal}
          onClose={() => setShowConfirmacaoModal(false)}
        />

       {/* Estilos customizados para o calendário */}
      <style jsx global>{`
        .custom-calendar {
          background: transparent !important;
          border: none !important;
          font-family: inherit !important;
        }

        .custom-calendar .react-calendar__navigation {
          background: transparent !important;
          border: none !important;
          margin-bottom: 1rem !important;
        }

        .custom-calendar .react-calendar__navigation button {
          background: transparent !important;
          border: none !important;
          color: white !important;
          font-size: 1.25rem !important;
          font-weight: bold !important;
          padding: 0.5rem !important;
          border-radius: 0.5rem !important;
          transition: all 0.3s ease !important;
        }

        .custom-calendar .react-calendar__navigation button:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .custom-calendar .react-calendar__navigation button:disabled {
          opacity: 0.3 !important;
        }

        .custom-calendar .react-calendar__month-view__weekdays {
          background: transparent !important;
          border: none !important;
          margin-bottom: 0.5rem !important;
        }

        .custom-calendar .react-calendar__month-view__weekdays__weekday {
          background: transparent !important;
          border: none !important;
          color: #9ca3af !important;
          font-weight: bold !important;
          padding: 0.5rem !important;
          text-transform: uppercase !important;
          font-size: 0.875rem !important;
        }

        .custom-calendar .react-calendar__month-view__days {
          background: transparent !important;
          border: none !important;
        }

        .custom-calendar .react-calendar__month-view__days__day {
          background: transparent !important;
          border: none !important;
          color: white !important;
          font-size: 1rem !important;
          font-weight: 500 !important;
          padding: 0.75rem !important;
          border-radius: 0.5rem !important;
          transition: all 0.3s ease !important;
          position: relative !important;
        }

        .custom-calendar .react-calendar__month-view__days__day:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          transform: scale(1.05) !important;
        }

        .custom-calendar .react-calendar__month-view__days__day--neighboringMonth {
          color: #4b5563 !important;
        }

        .custom-calendar .react-calendar__tile--active {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
          color: white !important;
          font-weight: bold !important;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4) !important;
        }

        .custom-calendar .react-calendar__tile--active:hover {
          background: linear-gradient(135deg, #2563eb, #1e40af) !important;
          transform: scale(1.05) !important;
        }

        .custom-calendar .disabled-tile {
          color: #6b7280 !important;
          cursor: not-allowed !important;
          opacity: 0.5 !important;
        }

        .custom-calendar .disabled-tile:hover {
          background: transparent !important;
          transform: none !important;
        }

        .custom-calendar .react-calendar__tile--now {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 2px solid #3b82f6 !important;
          font-weight: bold !important;
        }

                 .custom-calendar .react-calendar__tile--now:hover {
           background: rgba(59, 130, 246, 0.2) !important;
         }

         /* Estilos customizados para scrollbar */
         .scrollbar-thin::-webkit-scrollbar {
           width: 6px !important;
         }

         .scrollbar-thin::-webkit-scrollbar-track {
           background: #374151 !important;
           border-radius: 3px !important;
         }

         .scrollbar-thin::-webkit-scrollbar-thumb {
           background: #6b7280 !important;
           border-radius: 3px !important;
         }

         .scrollbar-thin::-webkit-scrollbar-thumb:hover {
           background: #9ca3af !important;
         }
       `}</style>
    </section>
  );
}
