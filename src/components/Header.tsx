'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import AuthModal from './AuthModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { data: session, status } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
         <header className="bg-black shadow-sm border-b border-gray-800 sticky top-0 z-50">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex justify-between items-center h-16">
           {/* Logo */}
           <div className="flex-shrink-0">
             <Link href="/" className="flex items-center">
                              <Image
                  src="/logo.jpg"
                  alt="Carlos Souza Barbearia Pub"
                  width={100}
                  height={100}
                  className="h-12 w-30 object-cover"
                  priority
                />
             </Link>
           </div>

           {/* Desktop Navigation */}
           <nav className="hidden md:flex space-x-8">
             <Link 
               href="/" 
               className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
             >
               Home
             </Link>
                           <Link 
                href="/agenda" 
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                Agendar
              </Link>
             <Link 
               href="/fidelidade" 
               className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
             >
               Fidelidade
             </Link>
           </nav>

           {/* Desktop Entrar Button */}
           <div className="hidden md:block">
             {session ? (
               <button 
                 onClick={() => setIsAuthModalOpen(true)}
                 className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition-colors duration-200 font-medium"
               >
                 {session.user?.userName || session.user?.name}
               </button>
             ) : (
               <button 
                 onClick={() => setIsAuthModalOpen(true)}
                 className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition-colors duration-200 font-medium"
               >
                 Entrar
               </button>
             )}
           </div>

           {/* Mobile menu button */}
           <div className="md:hidden flex items-center space-x-4">
             {session ? (
               <button 
                 onClick={() => setIsAuthModalOpen(true)}
                 className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors duration-200 font-medium text-sm"
               >
                 {session.user?.userName || session.user?.name}
               </button>
             ) : (
               <button 
                 onClick={() => setIsAuthModalOpen(true)}
                 className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors duration-200 font-medium text-sm"
               >
                 Entrar
               </button>
             )}
             <button
               onClick={toggleMenu}
               className="text-gray-300 hover:text-white transition-colors duration-200"
               aria-label="Toggle menu"
             >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span 
                  className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
                  }`}
                />
                <span 
                  className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span 
                  className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                    isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

                 {/* Mobile Navigation Menu */}
         <div 
           className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
             isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
           }`}
         >
           <nav className="pb-4 space-y-2">
             <Link 
               href="/" 
               className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200 font-medium"
               onClick={() => setIsMenuOpen(false)}
             >
               Home
             </Link>
                           <Link 
                href="/agenda" 
                className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Agendar
              </Link>
             <Link 
               href="/fidelidade" 
               className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200 font-medium"
               onClick={() => setIsMenuOpen(false)}
             >
               Fidelidade
             </Link>
           </nav>
         </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </header>
  );
}
