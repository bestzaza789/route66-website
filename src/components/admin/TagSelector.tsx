import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface Tag {
    id: number;
    name: string;
    color?: string;
}

interface TagSelectorProps {
    availableTags: Tag[];
    selectedTagIds: number[];
    onChange: (tagIds: number[]) => void;
    label?: string;
    placeholder?: string;
}

export function TagSelector({
    availableTags,
    selectedTagIds,
    onChange,
    label = 'Tags',
    placeholder = 'พิมพ์เพื่อค้นหา...'
}: TagSelectorProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const selectedTags = availableTags.filter(tag => selectedTagIds.includes(tag.id));
    const filteredAvailableTags = availableTags.filter(tag =>
        !selectedTagIds.includes(tag.id) &&
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddTag = (tagId: number) => {
        if (!selectedTagIds.includes(tagId)) {
            onChange([...selectedTagIds, tagId]);
        }
        setSearchTerm('');
        setShowDropdown(false);
    };

    const handleRemoveTag = (tagId: number) => {
        onChange(selectedTagIds.filter(id => id !== tagId));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredAvailableTags.length > 0) {
                handleAddTag(filteredAvailableTags[0].id);
            }
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label} <span className="text-red-500">*</span>
            </label>

            {/* Selected Tags Display */}
            <div className="min-h-[60px] p-3 border-2 border-gray-300 rounded-lg bg-white focus-within:border-[#7da87b] focus-within:ring-2 focus-within:ring-[#7da87b]/20 transition-all">
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTags.map(tag => (
                        <div
                            key={tag.id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
                            style={{ backgroundColor: tag.color || '#7da87b' }}
                        >
                            <span>{tag.name}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(tag.id)}
                                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Search Input */}
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        onKeyDown={handleKeyDown}
                        placeholder={selectedTags.length === 0 ? placeholder : 'เพิ่มหมวดหมู่...'}
                        className="w-full px-2 py-1 text-sm border-0 focus:outline-none focus:ring-0"
                    />

                    {/* Dropdown Suggestions */}
                    {showDropdown && filteredAvailableTags.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {filteredAvailableTags.map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => handleAddTag(tag.id)}
                                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-0"
                                >
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: tag.color || '#7da87b' }}
                                    />
                                    <span className="text-sm font-medium text-gray-700">{tag.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedTags.length === 0 && (
                <p className="text-xs text-red-500">กรุณาเลือกหมวดหมู่อย่างน้อย 1 หมวดหมู่</p>
            )}
            <p className="text-xs text-gray-500">
                คลิกที่ X เพื่อลบหมวดหมู่ออก | หมวดหมู่แรกจะถูกใช้เป็นหมวดหมู่หลัก
            </p>
        </div>
    );
}
