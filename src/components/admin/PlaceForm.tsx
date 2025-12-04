import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { TagSelector } from './TagSelector';
import { insertPlace, updatePlace } from '../../services/adminService';
import { getSubdistricts, getCategories } from '../../services/supabaseService';
import { Category, Subdistrict } from '../../types';

interface PlaceFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: any;
    mode?: 'create' | 'edit';
}

export function PlaceForm({ onSuccess, onCancel, initialData, mode = 'create' }: PlaceFormProps) {
    const [loading, setLoading] = useState(false);
    const [subdistricts, setSubdistricts] = useState<Subdistrict[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        name_th: initialData?.name || '',
        description: initialData?.description || '',
        address: initialData?.address || '',
        opening_hours: initialData?.openingHours || '',
        phone: initialData?.phone || '',
        subdistrict_id: initialData?.subdistrictId || 0,
        latitude: initialData?.latitude || '',
        longitude: initialData?.longitude || '',
        image_url: initialData?.image || '',
        highlight_tags: initialData?.highlights?.join(', ') || '',
    });

    const [selectedCategories, setSelectedCategories] = useState<number[]>(
        initialData?.categories?.map((c: Category) => c.id) || []
    );

    useEffect(() => {
        loadFormData();
    }, []);

    const loadFormData = async () => {
        try {
            const [subdistrictsData, categoriesData] = await Promise.all([
                getSubdistricts(),
                getCategories(),
            ]);
            setSubdistricts(subdistrictsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error loading form data:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name_th || !formData.subdistrict_id || selectedCategories.length === 0) {
            alert('กรุณากรอกข้อมูลที่จำเป็น: ชื่อสถานที่, ตำบล, และหมวดหมู่อย่างน้อย 1 หมวดหมู่');
            return;
        }

        setLoading(true);
        try {
            // Prepare place data with category_ids array
            const placeData: any = {
                name_th: formData.name_th,
                description: formData.description || undefined,
                address: formData.address || undefined,
                opening_hours: formData.opening_hours || undefined,
                phone: formData.phone || undefined,
                subdistrict_id: Number(formData.subdistrict_id),
                latitude: formData.latitude ? Number(formData.latitude) : undefined,
                longitude: formData.longitude ? Number(formData.longitude) : undefined,
                image_url: formData.image_url || undefined,
                highlight_tags: formData.highlight_tags
                    ? formData.highlight_tags.split(',').map((t: string) => t.trim()).filter(Boolean)
                    : undefined,
                category_ids: selectedCategories, // Store as array
            };

            if (mode === 'create') {
                // Insert new place (category_ids already in placeData)
                await insertPlace(placeData);
                alert('เพิ่มสถานที่สำเร็จ!');
            } else {
                // Update existing place
                await updatePlace(initialData.id, placeData);
                alert('แก้ไขสถานที่สำเร็จ!');
            }

            onSuccess();
        } catch (error) {
            console.error('Error saving place:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#2c3e50]">
                    {mode === 'create' ? 'เพิ่มสถานที่ใหม่' : 'แก้ไขสถานที่'}
                </h2>
                <button
                    type="button"
                    onClick={onCancel}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Image Upload */}
            <ImageUploader
                currentImage={formData.image_url}
                onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
            />

            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อสถานที่ <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="name_th"
                    value={formData.name_th}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7da87b] focus:border-transparent"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7da87b] focus:border-transparent"
                />
            </div>

            {/* Address */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ที่อยู่</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7da87b] focus:border-transparent"
                />
            </div>

            {/* Subdistrict */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    ตำบล <span className="text-red-500">*</span>
                </label>
                <select
                    name="subdistrict_id"
                    value={formData.subdistrict_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7da87b] focus:border-transparent"
                    required
                >
                    <option value="0">เลือกตำบล</option>
                    {subdistricts.map(sub => (
                        <option key={sub.id} value={sub.id}>
                            {sub.name} ({sub.districtName})
                        </option>
                    ))}
                </select>
            </div>

            {/* Categories - Tag Selector */}
            <TagSelector
                availableTags={categories.map(c => ({ id: c.id, name: c.name, color: c.color }))}
                selectedTagIds={selectedCategories}
                onChange={setSelectedCategories}
                label="หมวดหมู่"
                placeholder="พิมพ์เพื่อค้นหาหมวดหมู่..."
            />

            {/* Opening Hours and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">เวลาทำการ</label>
                    <input
                        type="text"
                        name="opening_hours"
                        value={formData.opening_hours}
                        onChange={handleChange}
                        placeholder="เช่น ทุกวัน 08:00 - 18:00 น."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7da87b] focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="เช่น 055-123-4567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7da87b] focus:border-transparent"
                    />
                </div>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ละติจูด</label>
                    <input
                        type="number"
                        step="any"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder="16.8219"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7da87b] focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ลองจิจูด</label>
                    <input
                        type="number"
                        step="any"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        placeholder="100.2659"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7da87b] focus:border-transparent"
                    />
                </div>
            </div>

            {/* Highlights */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">จุดเด่น</label>
                <input
                    type="text"
                    name="highlight_tags"
                    value={formData.highlight_tags}
                    onChange={handleChange}
                    placeholder="คั่นด้วยเครื่องหมายคอมม่า เช่น สวยงาม, บรรยากาศดี, ราคาไม่แพง"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7da87b] focus:border-transparent"
                />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#7da87b] text-white py-3 px-6 rounded-lg hover:bg-[#6a9669] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            กำลังบันทึก...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            บันทึก
                        </>
                    )}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                    ยกเลิก
                </button>
            </div>
        </form>
    );
}
