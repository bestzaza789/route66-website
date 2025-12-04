import { MapPin, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'หน้าแรก' },
    { id: 'districts', label: 'ค้นหาตามอำเภอ' },
    { id: 'categories', label: 'ค้นหาตามหมวดหมู่' },
    { id: 'about', label: 'เกี่ยวกับเรา' },
    { id: 'admin', label: 'Admin', special: true },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#7da87b] to-[#f9a825] rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-[#2c3e50]">Route66</div>
              <div className="text-xs text-[#95a5a6]">เส้นทางแห่งความสุข</div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`transition-colors font-medium ${(item as any).special
                    ? 'px-4 py-2 bg-[#7da87b] text-white rounded-lg hover:bg-[#6a9669]'
                    : currentPage === item.id
                      ? 'text-[#7da87b]'
                      : 'text-[#2c3e50] hover:text-[#7da87b]'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#2c3e50]"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 transition-colors ${currentPage === item.id
                  ? 'text-[#7da87b] bg-[#f1f8f0]'
                  : 'text-[#2c3e50] hover:bg-gray-50'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
