'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Estilos customizados para o Swiper
const swiperStyles = `
  .swiper {
    padding: 20px 0;
  }
  .swiper-slide {
    display: flex;
    justify-content: center;
  }
  .swiper-pagination-bullet {
    background: #000;
    opacity: 0.3;
  }
  .swiper-pagination-bullet-active {
    background: #000;
    opacity: 1;
  }
  .swiper-button-next,
  .swiper-button-prev {
    color: #000;
  }
`;

export default function Parceria() {
  const produtos = [
    {
      nome: 'Cream Style Prime -120g',
      descricao: 'Controle, hidratação e estilo em um só produto. O Cream Style Force Men foi desenvolvido para modelar os cabelos com facilidade, controlando o frizz e o volume ao mesmo tempo em que hidrata e protege os fios das agressões diárias. Enriquecido com colágeno, queratina e silicones especiais, proporciona brilho, definição e disciplina sem pesar.',
      valor: 60,
      imagem: 'produto1.webp'
    },
    {
      nome: 'Máscara H-Men Nº78 - 500g',
      descricao: 'A Máscara H Men Force Men foi criada para devolver a hidratação profunda a cabelos ressecados. Sua fórmula rica, com manteiga de karité e ativos que retêm a umidade, proporciona brilho, maciez e flexibilidade aos fios. Ideal para restaurar o movimento e a vida dos cabelos, deixando-os visivelmente mais saudáveis e nutridos.',
      valor: 100,
      imagem: 'produto2.webp'
    },
    {
      nome: 'Leave-in n°35 - 240g',
      descricao: 'Controle do frizz, fios alinhados e hidratação na medida certa. O Leave-in Force Men proporciona fixação leve, toque sedoso e proteção térmica e solar, mantendo os cabelos saudáveis e bem cuidados ao longo do dia.',
      valor: 70,
      imagem: 'produto3.webp'
    },
    {
      nome: 'Shampoo Oxidil - 250ml',
      descricao: 'O Shampoo Oxidil Force Men Professional é a solução perfeita para quem busca um cabelo mais forte e saudável. Com uma fórmula exclusiva e rica em ativos, ele promove uma limpeza eficaz e ao mesmo tempo estimula o crescimento capilar. Sua ação não agride os fios e ainda fortalece a fibra capilar existente, proporcionando cabelos mais volumosos e saudáveis. Além disso, refresca e estimula o metabolismo do couro cabeludo, ajudando a criar um ambiente propício para o crescimento de novos fios.',
      valor: 80,
      imagem: 'produto4.webp'
    },
    {
      nome: 'Tônico Oxidil Spray Nº10 - 30ml',
      descricao: 'O Tônico Oxidil Force Men foi desenvolvido especialmente para homens que desejam uma barba mais cheia e uniforme. Com fórmula exclusiva, ele estimula o bulbo capilar, promovendo o crescimento dos fios e ajudando no preenchimento das falhas.',
      valor: 90,
      imagem: 'produto5.webp'
    }
  ];

     return (
     <section className="py-16 bg-white relative  overflow-hidden">
       <style jsx>{swiperStyles}</style>
               <div className='bola1 z-0'></div>
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
                 <div className="text-center mb-12 relative z-10">
           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 relative z-10">
            Produtos Parceiros
          </h2>
        </div>

                 {/* Carrossel de Produtos */}
         <div className="max-w-4xl mx-auto">
           <Swiper
             spaceBetween={30}
             slidesPerView={1}
             centeredSlides={true}
             autoplay={{
               delay: 5000,
               disableOnInteraction: false,
             }}
             pagination={{
               clickable: true,
               dynamicBullets: true,
             }}
             navigation={true}
             modules={[Autoplay, Pagination, Navigation]}
             className="mySwiper"
           >
             {produtos.map((produto, index) => (
               <SwiperSlide key={index}>
                 <div className="max-w-md mx-auto bg-gray-50 rounded-lg overflow-hidden border border-gray-500 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                   <div className="relative h-64">
                     <Image
                       src={`/${produto.imagem}`}
                       alt={produto.nome}
                       fill
                       className="object-cover"
                     />
                   </div>
                   <div className="p-6">
                     <h3 className="text-xl font-semibold text-black mb-3">
                       {produto.nome}
                     </h3>
                     <p className="text-gray-600 text-sm leading-relaxed">
                       {produto.descricao}
                     </p>
                   </div>
                 </div>
               </SwiperSlide>
             ))}
           </Swiper>
         </div>
      </div>
    </section>
  );
}
