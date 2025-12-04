import { MapPin, Clock } from 'lucide-react';
import { Place } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PlaceCardProps {
  place: Place;
  onClick: () => void;
}

export function PlaceCard({ place, onClick }: PlaceCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 cursor-pointer group hover:-translate-y-1 active:scale-95"
    >
      <div className="relative h-56 overflow-hidden">
        <ImageWithFallback
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium shadow-md">
          {place.district}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-[#2c3e50] mb-3 text-xl font-semibold">{place.name}</h3>

        <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
          <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#7da87b]" />
          <span className="line-clamp-1 font-medium">{place.subdistrict}</span>
        </div>

        {place.openingHours && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Clock className="w-5 h-5 flex-shrink-0 text-[#f9a825]" />
            <span className="line-clamp-1">{place.openingHours}</span>
          </div>
        )}

        <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
          {place.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {place.highlights.slice(0, 2).map((highlight, index) => (
            <span
              key={index}
              className="text-xs bg-[#f1f8f0] text-[#7da87b] px-3 py-1.5 rounded-lg font-medium shadow-sm"
            >
              {highlight}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
