import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Acoes from '@/components/Acoes';
import Parceria from '@/components/Parceria';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <Acoes />
      <Parceria />
      <Footer />
    </div>
  );
}
