import { useState, useEffect } from 'react';
import { MapPin, Compass, ArrowRight } from 'lucide-react';
import { getPlaces, getCategories, getDistricts } from '../services/supabaseService';
import { Place, Category, District } from '../types';
import { PlaceCard } from './PlaceCard';

import * as LucideIcons from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [placesData, categoriesData, districtsData] = await Promise.all([
          getPlaces(),
          getCategories(),
          getDistricts(),
        ]);
        setPlaces(placesData);
        setCategories(categoriesData);
        setDistricts(districtsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredPlaces = places.slice(0, 3);

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
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#7da87b] to-[#f9a825] text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <MapPin className="w-7 h-7" />
              </div>
              <span className="text-xl">Route66</span>
            </div>
            <h1 className="mb-4">เส้นทางแห่งความสุข</h1>
            <p className="text-xl opacity-95 mb-8">
              ค้นพบความสุขเล็กๆ...ในทุกตำบลของพิษณุโลก
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('districts')}
                className="bg-white text-[#7da87b] px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)] hover:-translate-y-0.5 font-semibold text-lg"
              >
                <Compass className="w-6 h-6" />
                เริ่มต้นการผจญภัย
              </button>
              <button
                onClick={() => onNavigate('categories')}
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl hover:bg-white/30 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 font-semibold text-lg"
              >
                ดูตามหมวดหมู่
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Road Lines */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"></div>
          <div className="absolute bottom-4 left-0 right-0 h-1 bg-white/50 animate-pulse"></div>
          <div className="flex gap-8 absolute bottom-0 left-0 right-0">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-16 h-1 bg-white/40"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[#2c3e50] mb-2">สำรวจตามหมวดหมู่</h2>
            <p className="text-gray-600">เลือกสิ่งที่คุณสนใจ</p>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="text-[#7da87b] hover:text-[#6a9669] flex items-center gap-2"
          >
            ดูทั้งหมด
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => {
            const IconComponent = (LucideIcons as any)[category.icon];
            return (
              <button
                key={category.id}
                onClick={() => onNavigate('categories', { selectedCategory: category.id })}
                className="bg-white p-8 rounded-2xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 group hover:-translate-y-1 active:scale-95"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden"
                  style={{ backgroundColor: `${category.color}15` }}
                >
                  {category.icon.startsWith('http') ? (
                    <img src={category.icon} alt={category.name} className="w-full h-full object-cover" />
                  ) : (
                    IconComponent && <IconComponent className="w-8 h-8" style={{ color: category.color }} />
                  )}
                </div>
                <div className="text-base font-semibold text-[#2c3e50]">{category.name}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Places */}
      <section className="bg-gray-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[#2c3e50] mb-2">สถานที่แนะนำ</h2>
              <p className="text-gray-600">จุดหมายยอดนิยมที่ไม่ควรพลาด</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onClick={() => onNavigate('place', { placeId: place.id })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Districts Quick Links */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[#2c3e50] mb-2">เลือกเส้นทางจากอำเภอ</h2>
            <p className="text-gray-600">เริ่มต้นจากพื้นที่ที่คุณต้องการไป</p>
          </div>
          <button
            onClick={() => onNavigate('districts')}
            className="text-[#7da87b] hover:text-[#6a9669] flex items-center gap-2"
          >
            ดูทั้งหมด
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {districts.slice(0, 6).map((district) => (
            <button
              key={district.id}
              onClick={() => onNavigate('districts', { selectedDistrict: district.id })}
              className="bg-white p-8 rounded-2xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 text-left group hover:-translate-y-1 active:scale-95"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#7da87b] to-[#f9a825] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-[#2c3e50] text-lg font-semibold">{district.name}</h4>
                    <p className="text-sm text-gray-600">{district.subdistrictCount} ตำบล</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#7da87b] group-hover:translate-x-2 transition-transform duration-300" />
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {district.placeCount} สถานที่น่าสนใจ
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-20 mb-12">
        <div className="bg-gradient-to-r from-[#7da87b] to-[#8b9556] rounded-3xl p-14 text-white text-center shadow-[var(--shadow-xl)]">
          <h2 className="mb-6">พร้อมเริ่มการผจญภัยแล้วหรือยัง?</h2>
          <p className="text-xl opacity-95 mb-10 max-w-2xl mx-auto leading-relaxed">
            มาค้นพบความสุขเล็กๆ ในทุกมุมเมืองพิษณุโลกไปพร้อมกัน
          </p>
          <button
            onClick={() => onNavigate('districts')}
            className="bg-white text-[#7da87b] px-10 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 inline-flex items-center gap-2 shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)] hover:-translate-y-0.5 font-semibold text-lg"
          >
            <Compass className="w-6 h-6" />
            เริ่มต้นเส้นทาง
          </button>
        </div>
      </section>
    </>
  );
}
