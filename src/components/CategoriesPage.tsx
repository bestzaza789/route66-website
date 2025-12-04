import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getCategories, getPlaces } from '../services/supabaseService';
import { Category, Place } from '../types';
import { PlaceCard } from './PlaceCard';
import * as LucideIcons from 'lucide-react';

interface CategoriesPageProps {
  onNavigate: (page: string, data?: any) => void;
  initialCategory?: number;
}

export function CategoriesPage({ onNavigate, initialCategory }: CategoriesPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(initialCategory || null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [categoriesData, placesData] = await Promise.all([
          getCategories(),
          getPlaces(),
        ]);
        setCategories(categoriesData);
        setPlaces(placesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredPlaces = places.filter((place) => {
    const matchesCategory = !selectedCategory || place.categories.some(cat => cat.id === selectedCategory);
    const matchesSearch = !searchTerm ||
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#7da87b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[#2c3e50] mb-2">สำรวจตามหมวดหมู่</h1>
        <p className="text-gray-600">เลือกประเภทสถานที่ที่คุณสนใจ</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
          <input
            type="text"
            placeholder="ค้นหาสถานที่..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-enhanced pl-14"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 md:gap-6 mb-12">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 active:scale-95 ${selectedCategory === null
            ? 'bg-[#7da87b] text-white shadow-[var(--shadow-colored)]'
            : 'bg-white text-[#2c3e50] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)]'
            }`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${selectedCategory === null ? 'bg-white/20' : 'bg-gray-100'
            }`}>
            <LucideIcons.Grid3x3 className="w-8 h-8" />
          </div>
          <div className="text-base font-semibold mb-1">ทั้งหมด</div>
          <div className={`text-sm ${selectedCategory === null ? 'text-white/80' : 'text-gray-600'}`}>
            {places.length} สถานที่
          </div>
        </button>

        {categories.map((category) => {
          const IconComponent = (LucideIcons as any)[category.icon];
          const categoryPlaceCount = places.filter(p => p.categories.some(cat => cat.id === category.id)).length;

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 active:scale-95 ${selectedCategory === category.id
                ? 'shadow-[var(--shadow-colored)]'
                : 'bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)]'
                }`}
              style={{
                backgroundColor: selectedCategory === category.id ? category.color : undefined,
                color: selectedCategory === category.id ? 'white' : undefined,
              }}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all overflow-hidden`}
                style={{
                  backgroundColor: selectedCategory === category.id
                    ? 'rgba(255, 255, 255, 0.2)'
                    : `${category.color}15`,
                }}
              >
                {category.icon.startsWith('http') ? (
                  <img src={category.icon} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                  IconComponent && (
                    <IconComponent
                      className="w-8 h-8"
                      style={{ color: selectedCategory === category.id ? 'white' : category.color }}
                    />
                  )
                )}
              </div>
              <div className="text-base font-semibold mb-1">{category.name}</div>
              <div
                className="text-sm"
                style={{
                  color: selectedCategory === category.id ? 'rgba(255, 255, 255, 0.8)' : '#6b7280',
                }}
              >
                {categoryPlaceCount} สถานที่
              </div>
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="mb-6">
        <h3 className="text-[#2c3e50]">
          {selectedCategory
            ? categories.find(c => c.id === selectedCategory)?.name
            : 'สถานที่ทั้งหมด'
          }
        </h3>
        <p className="text-gray-600 mt-1">พบ {filteredPlaces.length} สถานที่</p>
      </div>

      {filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onClick={() => onNavigate('place', { placeId: place.id })}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <LucideIcons.Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">ไม่พบสถานที่ที่ตรงกับการค้นหา</p>
        </div>
      )}
    </div>
  );
}
