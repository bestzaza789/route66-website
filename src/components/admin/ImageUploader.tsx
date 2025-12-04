import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '../../services/storageService';

interface ImageUploaderProps {
    onImageUploaded: (url: string) => void;
    currentImage?: string;
    label?: string;
}

export function ImageUploader({ onImageUploaded, currentImage, label = 'รูปภาพสถานที่' }: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Supabase
        setUploading(true);
        try {
            const imageUrl = await uploadImage(file);
            onImageUploaded(imageUrl);
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleClear = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            <div
                className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${dragActive
                        ? 'border-[#7da87b] bg-[#7da87b]/5'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {preview ? (
                    <div className="relative">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-64 object-cover rounded-lg"
                        />
                        {!uploading && (
                            <button
                                onClick={handleClear}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                type="button"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                <div className="text-white text-center">
                                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                    <p>กำลังอัพโหลด...</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 mb-2">ลากและวางรูปภาพที่นี่</p>
                        <p className="text-sm text-gray-500 mb-4">หรือ</p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-6 py-2 bg-[#7da87b] text-white rounded-lg hover:bg-[#6a9669] transition-colors inline-flex items-center gap-2"
                            type="button"
                        >
                            <Upload className="w-4 h-4" />
                            เลือกไฟล์
                        </button>
                        <p className="text-xs text-gray-400 mt-2">รองรับ JPG, PNG, GIF (สูงสุด 5MB)</p>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                />
            </div>
        </div>
    );
}
