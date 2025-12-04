import * as LucideIcons from 'lucide-react';

interface IconPickerProps {
    selectedIcon: string;
    onSelectIcon: (iconName: string) => void;
}

const ICON_LIST = [
    'MapPin', 'Compass', 'Navigation', 'Flag', 'Map', 'Globe', // Navigation
    'Coffee', 'Utensils', 'UtensilsCrossed', 'Beer', 'Wine', 'CupSoda', // Food & Drink
    'Trees', 'Mountain', 'Flower', 'Leaf', 'Sunset', 'Waves', 'Cloud', 'Sun', // Nature
    'Home', 'Building', 'Building2', 'Hotel', 'Tent', 'Castle', 'Landmark', 'Church', // Buildings
    'ShoppingBag', 'ShoppingCart', 'Gift', 'Ticket', 'CreditCard', // Shopping
    'Camera', 'Music', 'Headphones', 'Book', 'Heart', 'Star', 'Smile', 'Bike', 'Car', 'Bus', 'Plane' // Activities & Misc
];

export function IconPicker({ selectedIcon, onSelectIcon }: IconPickerProps) {
    return (
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 max-h-60 overflow-y-auto">
            {ICON_LIST.map((iconName) => {
                const Icon = (LucideIcons as any)[iconName];
                if (!Icon) return null;

                const isSelected = selectedIcon === iconName;

                return (
                    <button
                        key={iconName}
                        type="button"
                        onClick={() => onSelectIcon(iconName)}
                        className={`p-3 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${isSelected
                            ? 'bg-[#7da87b] text-white shadow-md scale-105'
                            : 'bg-white text-gray-600 hover:bg-gray-100 hover:scale-105 border border-gray-100'
                            }`}
                        title={iconName}
                    >
                        <Icon className="w-6 h-6" />
                    </button>
                );
            })}
        </div>
    );
}
