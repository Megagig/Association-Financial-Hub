import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import { Outlet } from 'react-router-dom';

// This layout component provides a basic structure for the application with a header, footer, and a main content area.
const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
