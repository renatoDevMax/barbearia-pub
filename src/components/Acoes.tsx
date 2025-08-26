'use client';

import { IoIosWifi } from 'react-icons/io';
import { FaQrcode, FaGoogle, FaInstagram, FaWhatsapp, FaUsers, FaStore, FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';
import { MdPix } from "react-icons/md";
import Image from 'next/image';
import { useState, useEffect } from 'react';


export default function Acoes() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [showBarbeariasModal, setShowBarbeariasModal] = useState(false);
  const [wifiCopied, setWifiCopied] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [expandedBarbearia, setExpandedBarbearia] = useState<number | null>(null);
  const images = ['insta1.jpg', 'insta2.jpg', 'insta3.jpg', 'insta4.jpg', 'insta5.jpg'];

  const barbearias = [
    {
      imagem: "/barbearia1.jpg",
      endereco: "PR-412, 5460 - Ipanema, Pontal do Paraná - PR, 83255-000"
    },
    {
      imagem: "/barbearia2.png",
      endereco: "R. João Eugênio, 711 - Costeira, Paranaguá - PR, 83203-400"
    },
    {
      imagem: "/barbearia3.jpg",
      endereco: "PR-412, 5460 - Ipanema, Pontal do Paraná - PR, 83255-000"
    },
    {
      imagem: "/barbearia4.webp",
      endereco: "R. Ernesto Postarek, Matinhos - PR, 83260-000"
    }
  ];

  const handleWhatsAppClick = () => {
    const phoneNumber = '41999694593';
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWifiClick = () => {
    setShowWifiModal(true);
    setWifiCopied(false);
  };

  const handleWifiConnect = () => {
    const password = 'barbearia5';
    
    // Copiar senha para área de transferência
    navigator.clipboard.writeText(password).then(() => {
      setWifiCopied(true);
      setTimeout(() => setWifiCopied(false), 2000);
    }).catch(() => {
      setWifiCopied(true);
      setTimeout(() => setWifiCopied(false), 2000);
    });
  };

  const handlePixClick = () => {
    setShowPixModal(true);
    setPixCopied(false);
  };

  const handlePixCopy = () => {
    const pixKey = '45891816814';
    
    // Copiar chave PIX para área de transferência
    navigator.clipboard.writeText(pixKey).then(() => {
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 2000);
    }).catch(() => {
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 2000);
    });
  };

  const handleAvaliacaoClick = () => {
    const googleReviewsUrl = 'https://www.google.com/search?sca_esv=ce44fb6aa5ce43e4&cs=1&biw=1920&bih=919&sxsrf=AE3TifO0ELIx1R1C1_MEeg3RdRfPEYRDug:1755874641098&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-EwrK8XXiPtXJBjf3N_1hglCGisJx7qoxyiUG-Fgqz4QwFvo2vz-1aPtwNxUyCJMeeDzqSKJzgvj5xB-HLuo_gA8X-AH-qcK-eChcuUy8MQi2qYFcJn1HMzD9FsVcsyYcS5LTeSA%3D&q=Carlossouzabarbeariapub.matinhos+Coment%C3%A1rios&sa=X&ved=2ahUKEwjiy4Li1p6PAxX4pZUCHckzBqAQ0bkNegQIMxAD';
    window.open(googleReviewsUrl, '_blank');
  };

  const handleInstagramClick = () => {
    const instagramUrl = 'https://www.instagram.com/pub_matinhos/';
    window.open(instagramUrl, '_blank');
  };

  const handleFidelidadeClick = () => {
    window.location.href = '/fidelidade';
  };

  const handleBarbeariasClick = () => {
    setShowBarbeariasModal(true);
    setExpandedBarbearia(null);
  };

  const handleBarbeariaToggle = (index: number) => {
    setExpandedBarbearia(expandedBarbearia === index ? null : index);
  };

  const handleIniciarRota = (endereco: string) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
    window.open(googleMapsUrl, '_blank');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 1500);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
        <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center space-x-8 md:space-x-12">
          {/* Botão WiFi */}
          <button 
            onClick={handleWifiClick}
            className="flex flex-col items-center group"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-white bg-black rounded-full flex items-center justify-center mb-3 transition-all duration-300 hover:scale-110 hover:shadow-lg">
              <IoIosWifi className="text-white text-2xl md:text-3xl" />
            </div>
            <span className="text-sm md:text-base font-medium text-white">WiFi</span>
          </button>

          {/* Botão PIX */}
          <button 
            onClick={handlePixClick}
            className="flex flex-col items-center group"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-white bg-black rounded-full flex items-center justify-center mb-3 transition-all duration-300 hover:scale-110 hover:shadow-lg">
              <MdPix className="text-white text-2xl md:text-3xl" />
            </div>
            <span className="text-sm md:text-base font-medium text-white">PIX</span>
          </button>

                     {/* Botão Google */}
           <button 
             onClick={handleAvaliacaoClick}
             className="flex flex-col items-center group"
           >
             <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-white bg-black rounded-full flex items-center justify-center mb-3 transition-all duration-300 hover:scale-110 hover:shadow-lg">
               <FaGoogle className="text-white text-2xl md:text-3xl" />
             </div>
             <span className="text-sm md:text-base font-medium text-white">Avaliação</span>
           </button>
         </div>
         
         {/* Card Instagram */}
         <div className="mt-12 flex justify-center px-4">
           <button 
             onClick={handleInstagramClick}
             className="w-full max-w-sm md:max-w-md lg:max-w-lg bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer" 
             style={{width: '95%'}}
           >
             <div className="relative h-48 overflow-hidden">
                <Image
                  src={`/${images[currentImage]}`}
                  alt="Instagram"
                  width={400}
                  height={300}
                  className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                    isTransitioning ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <div className={`absolute inset-0 bg-black transition-opacity duration-500 ease-in-out ${
                  isTransitioning ? 'opacity-80' : 'opacity-40'
                } flex items-center justify-center`}>
                  <FaInstagram className="text-white text-8xl md:text-9xl lg:text-10xl" />
                </div>
              </div>
              <div className="p-4 flex items-center justify-center space-x-2">
                <FaInstagram className="text-pink-500 text-xl" />
                <h3 className="text-lg font-semibold text-gray-400">Instagram</h3>
              </div>
           </button>
          </div>
          
                     {/* Botão WhatsApp */}
           <div className="mt-8 flex justify-center">
             <button 
               onClick={handleWhatsAppClick}
               className="flex items-center space-x-3 px-12 py-2 bg-gradient-to-r from-black via-green-950 to-black text-gray-400 rounded-full border border-gray-600 shadow-[0_10px_25px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_35px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105"
             >
               <FaWhatsapp className="text-2xl" />
               <span className="font-semibold text-lg">Adicionar Contato</span>
             </button>
           </div>
           
                       {/* Botão Corte Fidelidade */}
            <div className="mt-10 flex justify-center">
              <button 
                onClick={handleFidelidadeClick}
                className="flex items-center space-x-3 px-14 py-2 bg-gradient-to-r from-black via-gray-900 to-black text-gray-400 rounded-full border border-gray-600 shadow-[0_10px_25px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_35px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105"
              >
                <FaUsers className="text-2xl" />
                <span className="font-semibold text-lg">Corte Fidelidade</span>
              </button>
            </div>
            
            {/* Botão Nossas Barbearias */}
            <div className="mt-10 flex justify-center">
              <button 
                onClick={handleBarbeariasClick}
                className="flex items-center space-x-3 px-10 py-2 bg-gradient-to-r from-black via-amber-950 to-black text-gray-400 rounded-full border border-gray-600 shadow-[0_10px_25px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_35px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105"
              >
                <FaStore className="text-2xl" />
                <span className="font-semibold text-lg">Nossas Barbearias</span>
              </button>
            </div>

            {/* Card Preço do Corte */}
            <div className="mt-10 flex justify-center px-4">
              <div className="w-full max-w-md bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl border border-gray-700 shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_25px_50px_rgba(255,255,255,0.2)] transition-all duration-500 hover:scale-105 overflow-hidden">
                <div className="p-8 relative pb-15">
                  {/* Texto do card */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-3 leading-relaxed">
                      Corte de Cabelo
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Oferecemos um serviço de qualidade com preço acessível. 
                      Nossos profissionais são experientes e garantem um resultado 
                      que supera suas expectativas.
                    </p>
                  </div>
                  
                  {/* Preço destacado */}
                  <div className="absolute bottom-6 right-6">
                    <div className="text-right">
                      <div className="text-xs text-gray-400 mb-1 font-medium tracking-wider">
                        APENAS
                      </div>
                      <div className="text-4xl font-bold text-white leading-none">
                        R$ 45
                      </div>
                      <div className="text-xs text-gray-400 font-medium tracking-wider">
                        ,00
                      </div>
                    </div>
                  </div>

                  <div className='absolute bottom-6 left-6'>
                    <p className='text-sm text-gray-400' >20 min - 40 min</p>
                  </div>
                  
                  {/* Elemento decorativo */}
                  <div className="absolute top-4 right-4 w-16 h-16 border border-gray-600 rounded-full opacity-20"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border border-gray-600 rounded-full opacity-30"></div>
                </div>
              </div>
            </div>

            {/* Card Preço do Corte + Barba */}
            <div className="mt-6 flex justify-center px-4">
              <div className="w-full max-w-md bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl border border-gray-700 shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_25px_50px_rgba(255,255,255,0.2)] transition-all duration-500 hover:scale-105 overflow-hidden">
                <div className="p-8 relative pb-15">
                  {/* Texto do card */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-3 leading-relaxed">
                      Corte de Cabelo + Barba
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Combo completo com o melhor custo-benefício. 
                      Nossos profissionais são experientes e garantem um resultado 
                      que supera suas expectativas.
                    </p>
                  </div>
                  
                  {/* Preço destacado */}
                  <div className="absolute bottom-6 right-6">
                    <div className="text-right">
                      <div className="text-xs text-gray-400 mb-1 font-medium tracking-wider">
                        APENAS
                      </div>
                      <div className="text-4xl font-bold text-white leading-none">
                        R$ 65
                      </div>
                      <div className="text-xs text-gray-400 font-medium tracking-wider">
                        ,00
                      </div>
                    </div>
                  </div>

                  <div className='absolute bottom-6 left-6'>
                    <p className='text-sm text-gray-400' >20 min - 40 min</p>
                  </div>
                  
                  {/* Elemento decorativo */}
                  <div className="absolute top-4 right-4 w-16 h-16 border border-gray-600 rounded-full opacity-20"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border border-gray-600 rounded-full opacity-30"></div>
                </div>
              </div>
            </div>
        </div>

        {/* Modal WiFi */}
        {showWifiModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Conectar ao WiFi
                </h3>
                <div className="mb-6">
                  <p className="text-gray-600 mb-2">
                    <strong>Rede:</strong> Barbearia pub
                  </p>
                  <p className="text-gray-600 mb-4">
                    <strong>Senha:</strong> barbearia5
                  </p>
                  <p className="text-sm text-gray-500">
                    Clique em "Copiar Senha" para facilitar a conexão
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleWifiConnect}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      wifiCopied 
                        ? 'bg-green-600 text-white' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {wifiCopied ? 'Copiado!' : 'Copiar Senha'}
                  </button>
                  <button
                    onClick={() => setShowWifiModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal PIX */}
        {showPixModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Pagamento PIX
                </h3>
                <div className="mb-6">
                  {/* QR Code genérico */}
                  <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="w-32 h-32 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <MdPix className="text-4xl text-gray-600" />
                      </div>
                      <p className="text-sm">QR Code PIX</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-2">
                    <strong>Chave PIX:</strong> 45891816814
                  </p>
                  <p className="text-sm text-gray-500">
                    Clique em "Copiar Chave" para facilitar o pagamento
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handlePixCopy}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      pixCopied 
                        ? 'bg-green-600 text-white' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {pixCopied ? 'Copiado!' : 'Copiar Chave'}
                  </button>
                  <button
                    onClick={() => setShowPixModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Nossas Barbearias */}
        {showBarbeariasModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-black rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-white">
                    Nossas Barbearias
                  </h3>
                  <button
                    onClick={() => setShowBarbeariasModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  {barbearias.map((barbearia, index) => (
                    <div key={index} className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
                      {/* Item principal */}
                      <button
                        onClick={() => handleBarbeariaToggle(index)}
                        className="w-full p-4 flex items-center space-x-4 hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <Image
                            src={barbearia.imagem}
                            alt={`Barbearia ${index + 1}`}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center space-x-2">
                            <FaMapMarkerAlt className="text-red-500 text-lg" />
                            <span className="text-gray-200 font-medium">
                              {barbearia.endereco}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <FaChevronDown 
                            className={`text-gray-400 text-lg transition-transform duration-300 ${
                              expandedBarbearia === index ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </button>
                      
                      {/* Conteúdo expandido */}
                      {expandedBarbearia === index && (
                        <div className="px-4 pb-4 border-t border-gray-700">
                          <div className="pt-4">
                            <button
                              onClick={() => handleIniciarRota(barbearia.endereco)}
                              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                            >
                              <FaMapMarkerAlt className="text-lg" />
                              <span>Iniciar Rota</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
  );
}
