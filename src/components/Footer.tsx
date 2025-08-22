'use client';

import { FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo/Título */}
          <div className="mb-8">
            <div className="flex justify-center mb-2">
              <Image
                src="/fundoremv2.png"
                alt="Carlos Souza Barbearia Pub"
                width={200}
                height={60}
                className="h-12 md:h-16 w-auto object-contain"
              />
            </div>
            <p className="text-gray-300 text-sm md:text-base">
              Estilo e qualidade em cada corte
            </p>
          </div>

          {/* Informações de Contato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Endereço */}
            <div className="flex flex-col items-center md:items-start space-y-3">
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-2xl text-gray-400" />
                <h4 className="text-lg font-semibold">Endereço</h4>
              </div>
              <p className="text-gray-300 text-sm md:text-base text-center md:text-left leading-relaxed">
                Rua Ernesto Postarek, 393 Lj 01<br />
                83260-000 Centro<br />
                Matinhos/PR
              </p>
            </div>

            {/* Telefone */}
            <div className="flex flex-col items-center md:items-start space-y-3">
              <div className="flex items-center space-x-3">
                <FaPhone className="text-2xl text-gray-400" />
                <h4 className="text-lg font-semibold">Contato</h4>
              </div>
              <a 
                href="tel:41999694593" 
                className="text-gray-300 text-sm md:text-base hover:text-white transition-colors duration-300"
              >
                (41) 99969-4593
              </a>
            </div>
          </div>

          {/* Linha divisória */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <p className="text-gray-400 text-sm">
              © 2024 Carlos Souza Barbearia Pub. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
