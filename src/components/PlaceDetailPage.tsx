import { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, ArrowLeft, Star } from 'lucide-react';
import { getPlaceById } from '../services/supabaseService';
import { Place } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import * as LucideIcons from 'lucide-react';

interface PlaceDetailPageProps {
  placeId: number;
  onNavigate: (page: string, data?: any) => void;
}

export function PlaceDetailPage({ placeId, onNavigate }: PlaceDetailPageProps) {
  const [place, setPlace] = useState<Place | null>(null);
  const [relatedPlaces, setRelatedPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlace() {
      setLoading(true);
      try {
        const placeData = await getPlaceById(placeId);
        setPlace(placeData);

        // Load related places from same district
        if (placeData) {
          const { getPlacesByDistrict } = await import('../services/supabaseService');
          const allPlacesInDistrict = await getPlacesByDistrict(placeData.districtId);
          const related = allPlacesInDistrict
            .filter(p => p.id !== placeData.id)
            .slice(0, 3);
          setRelatedPlaces(related);
        }
      } catch (error) {
        console.error('Error loading place:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPlace();
  }, [placeId]);

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

  if (!place) {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 text-center">
        <p className="text-gray-500">ไม่พบข้อมูลสถานที่</p>
        <button
          onClick={() => onNavigate('home')}
          className="mt-4 text-[#7da87b] hover:text-[#6a9669]"
        >
          กลับหน้าแรก
        </button>
      </div>
    );
  }

  const primaryCategory = place?.categories.find(c => c.id === place.categoryId);
  const IconComponent = primaryCategory ? (LucideIcons as any)[primaryCategory.icon] : null;

  return (
    <div className="min-h-screen bg-[var(--color-warm-bg)]">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-[#7da87b] hover:text-[#6a9669] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            กลับ
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <ImageWithFallback
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Category Badge */}
        {primaryCategory && (
          <div
            className="absolute top-6 right-6 px-4 py-2 rounded-full text-white flex items-center gap-2 backdrop-blur-sm"
            style={{ backgroundColor: `${primaryCategory.color}dd` }}
          >
            {primaryCategory.icon.startsWith('http') ? (
              <img src={primaryCategory.icon} alt="Icon" className="w-4 h-4 object-cover rounded-full" />
            ) : (
              IconComponent && <IconComponent className="w-4 h-4" />
            )}
            {primaryCategory.name}
          </div>
        )}

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 text-white p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="mb-3">{place.name}</h1>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{place.district} · {place.subdistrict}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl p-10 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300">
              <h2 className="text-[#2c3e50] mb-6">เกี่ยวกับสถานที่</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{place.description}</p>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl p-10 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300">
              <h3 className="text-[#2c3e50] mb-6">จุดเด่น</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {place.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-5 bg-[#f1f8f0] rounded-xl shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="w-12 h-12 bg-[#7da87b] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <Star className="w-6 h-6 text-white" fill="white" />
                    </div>
                    <span className="text-[#2c3e50] font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 mb-6 sticky top-24">
              <h3 className="text-[#2c3e50] mb-6">ข้อมูลติดต่อ</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#7da87b] mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">ที่อยู่</div>
                    <div className="text-[#2c3e50]">{place.address}</div>
                  </div>
                </div>

                {place.openingHours && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#f9a825] mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">เวลาทำการ</div>
                      <div className="text-[#2c3e50]">{place.openingHours}</div>
                    </div>
                  </div>
                )}

                {place.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#5499c7] mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">โทรศัพท์</div>
                      <a
                        href={`tel:${place.phone}`}
                        className="text-[#5499c7] hover:underline"
                      >
                        {place.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {place.latitude && place.longitude && (
                <button className="w-full mt-6 bg-[#7da87b] text-white py-4 px-6 rounded-xl hover:bg-[#6a9669] transition-all duration-300 flex items-center justify-center gap-2 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 font-semibold text-lg">
                  <MapPin className="w-5 h-5" />
                  ดูแผนที่
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Related Places */}
        <div className="mt-16">
          <h2 className="text-[#2c3e50] mb-6">สถานที่ใกล้เคียง</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {relatedPlaces.map((relatedPlace: Place) => (
              <div
                key={relatedPlace.id}
                onClick={() => onNavigate('place', { placeId: relatedPlace.id })}
                className="bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 cursor-pointer hover:-translate-y-1 active:scale-95"
              >
                <div className="relative h-40 overflow-hidden">
                  <ImageWithFallback
                    src={relatedPlace.image}
                    alt={relatedPlace.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-[#2c3e50] mb-2">{relatedPlace.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {relatedPlace.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
