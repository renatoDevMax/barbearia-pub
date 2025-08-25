'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function ProgramasPage() {
  const handleAppAndroidClick = () => {
    window.open('https://drive.usercontent.google.com/download?id=11svjo8Sf_KPAny2dqULUslKHs8XP7D2y&export=download&authuser=0', '_blank');
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[calc(100dvh-80px)] flex items-center justify-center overflow-hidden">
        {/* Video de fundo */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videoHome.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos.
        </video>
        
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black"></div>
        
        {/* Conteúdo central */}
        <div className="relative z-10 text-center px-4">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/fundoremv2.png"
              alt="Carlos Souza Barbearia Pub"
              width={300}
              height={150}
              className="mx-auto"
            />
          </div>
          
          {/* Botão App Android */}
          <button
            onClick={handleAppAndroidClick}
            className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            App Android
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
