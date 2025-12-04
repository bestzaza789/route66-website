import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { DistrictsPage } from './components/DistrictsPage';
import { CategoriesPage } from './components/CategoriesPage';
import { PlaceDetailPage } from './components/PlaceDetailPage';
import { AboutPage } from './components/AboutPage';
import { AdminPage } from './components/AdminPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageData, setPageData] = useState<any>(null);

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page);
    setPageData(data || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'districts':
        return (
          <DistrictsPage
            onNavigate={handleNavigate}
            initialDistrict={pageData?.selectedDistrict}
          />
        );
      case 'categories':
        return (
          <CategoriesPage
            onNavigate={handleNavigate}
            initialCategory={pageData?.selectedCategory}
          />
        );
      case 'place':
        return (
          <PlaceDetailPage
            placeId={pageData?.placeId}
            onNavigate={handleNavigate}
          />
        );
      case 'about':
        return <AboutPage />;
      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
    </div>
  );
}
