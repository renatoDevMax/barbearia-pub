import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Agendamento from '@/components/Agendamento';

export default function AgendaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Agendamento />
      </main>
      <Footer />
    </div>
  );
}
