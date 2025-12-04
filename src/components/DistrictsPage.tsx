import { useState, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { getDistricts, getPlaces } from '../services/supabaseService';
import { District, Place } from '../types';
import { PlaceCard } from './PlaceCard';

interface DistrictsPageProps {
  onNavigate: (page: string, data?: any) => void;
  initialDistrict?: number;
}

export function DistrictsPage({ onNavigate, initialDistrict }: DistrictsPageProps) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(initialDistrict || null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [districtsData, placesData] = await Promise.all([
          getDistricts(),
          getPlaces(),
        ]);
        setDistricts(districtsData);
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
    const matchesDistrict = !selectedDistrict || place.districtId === selectedDistrict;
    const matchesSearch = !searchTerm ||
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.subdistrict.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesSearch;
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
        <h1 className="text-[#2c3e50] mb-2">สำรวจตามอำเภอ</h1>
        <p className="text-gray-600">เลือกอำเภอเพื่อค้นหาสถานที่น่าสนใจ</p>
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

      {/* Districts Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-12">
        <button
          onClick={() => setSelectedDistrict(null)}
          className={`p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 active:scale-95 ${selectedDistrict === null
            ? 'bg-[#7da87b] text-white shadow-[var(--shadow-colored)]'
            : 'bg-white text-[#2c3e50] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)]'
            }`}
        >
          <div className="text-lg font-semibold mb-2">ทั้งหมด</div>
          <div className={`text-sm ${selectedDistrict === null ? 'text-white/80' : 'text-gray-600'}`}>
            {places.length} สถานที่
          </div>
        </button>

        {districts.map((district) => (
          <button
            key={district.id}
            onClick={() => setSelectedDistrict(district.id)}
            className={`p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 active:scale-95 ${selectedDistrict === district.id
              ? 'bg-[#7da87b] text-white shadow-[var(--shadow-colored)]'
              : 'bg-white text-[#2c3e50] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)]'
              }`}
          >
            <div className="text-lg font-semibold mb-2">{district.name}</div>
            <div className={`text-sm ${selectedDistrict === district.id ? 'text-white/80' : 'text-gray-600'}`}>
              {district.placeCount} สถานที่
            </div>
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mb-6">
        <h3 className="text-[#2c3e50]">
          {selectedDistrict
            ? `สถานที่ใน${districts.find(d => d.id === selectedDistrict)?.name}`
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
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">ไม่พบสถานที่ที่ตรงกับการค้นหา</p>
        </div>
      )}
    </div>
  );
}
