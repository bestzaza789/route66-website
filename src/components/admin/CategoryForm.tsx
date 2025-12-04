import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { insertCategory, CategoryInsertData } from '../../services/adminService';
import { IconPicker } from './IconPicker';

interface CategoryFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}



const PRESET_COLORS = [
    '#e67e22', '#8b9556', '#f9a825', '#7da87b', '#5499c7', '#e74c3c',
    '#9b59b6', '#1abc9c', '#34495e', '#e91e63', '#ff9800', '#4caf50'
];

export function CategoryForm({ onSuccess, onCancel }: CategoryFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name_th: '',
        icon_name: 'MapPin',
        color_code: '#7da87b',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name_th) {
            alert('กรุณากรอกชื่อหมวดหมู่');
            return;
        }

        setLoading(true);
        try {
            const categoryData: CategoryInsertData = {
                name_th: formData.name_th,
                icon_name: formData.icon_name,
                color_code: formData.color_code,
            };

            await insertCategory(categoryData);
            alert('เพิ่มหมวดหมู่สำเร็จ!');
            onSuccess();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#2c3e50]">เพิ่มหมวดหมู่ใหม่</h2>
                <button
                    type="button"
                    onClick={onCancel}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อหมวดหมู่ <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="name_th"
                    value={formData.name_th}
                    onChange={handleChange}
                    placeholder="เช่น ร้านอาหาร, คาเฟ่, วัด"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7da87b] focus:border-transparent"
                    required
                />
            </div>

            {/* Icon Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">เลือกไอคอน</label>
                <IconPicker
                    selectedIcon={formData.icon_name}
                    onSelectIcon={(iconName) => setFormData(prev => ({ ...prev, icon_name: iconName }))}
                />
                <p className="text-xs text-gray-500 mt-2">
                    เลือกไอคอนที่ต้องการแสดงสำหรับหมวดหมู่นี้
                </p>
            </div>

            {/* Color */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">สี</label>
                <div className="flex items-center gap-4">
                    <input
                        type="color"
                        name="color_code"
                        value={formData.color_code}
                        onChange={handleChange}
                        className="w-20 h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                        type="text"
                        value={formData.color_code}
                        onChange={(e) => setFormData(prev => ({ ...prev, color_code: e.target.value }))}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7da87b] focus:border-transparent font-mono"
                        placeholder="#7da87b"
                    />
                </div>
                <div className="grid grid-cols-6 gap-2 mt-3">
                    {PRESET_COLORS.map(color => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, color_code: color }))}
                            className="w-full h-10 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                            style={{ backgroundColor: color }}
                            title={color}
                        />
                    ))}
                </div>
            </div>

            {/* Preview */}
            <div className="p-6 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">ตัวอย่าง:</p>
                <div
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-xl text-white font-medium"
                    style={{ backgroundColor: formData.color_code }}
                >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                        {formData.icon_name.startsWith('http') ? (
                            <img src={formData.icon_name} alt="Icon" className="w-full h-full object-cover" />
                        ) : (
                            /* Dynamic Icon Render */
                            (() => {
                                // We need to dynamically import or use a map, but since we don't have the full map here easily without importing everything,
                                // we can just show the first 2 letters if it's not a URL, OR we can try to render it if we have access to LucideIcons.
                                // For the preview in this form, let's just show the letters or a generic icon if we can't easily render the specific one without importing all.
                                // BUT, we can import * as LucideIcons at the top to make it work.
                                return <span className="text-sm">{formData.icon_name.substring(0, 2)}</span>;
                            })()
                        )}
                    </div>
                    {formData.name_th || 'ชื่อหมวดหมู่'}
                </div>
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
