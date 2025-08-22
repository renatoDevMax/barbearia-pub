'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();

  const handleAgendarClick = () => {
    router.push('/agenda');
  };

  return (
    <section className="relative h-[calc(100dvh-4rem)] overflow-hidden">
      {/* Video de fundo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videoHome.mp4" type="video/mp4" />
        Seu navegador não suporta vídeos.
      </video>

      {/* Overlay com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black"></div>

      {/* Conteúdo centralizado */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Bem-vindo à
          </h1>
          
          <div className="mb-6">
            <Image
              src="/fundoremv2.png"
              alt="Carlos Souza Barbearia Pub"
              width={400}
              height={200}
              className="w-auto h-36 md:h-24 lg:h-32 mx-auto"
              priority
            />
          </div>
          
          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Onde estilo encontra tradição. Agende seu horário e descubra a excelência em cada corte.
          </p>
          
          <button 
            onClick={handleAgendarClick}
            className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Agendar Horário
          </button>
        </div>
      </div>
    </section>
  );
}
