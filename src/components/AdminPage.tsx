import { useState } from 'react';
import { Plus, FileText, Tag, MapPin, ArrowLeft } from 'lucide-react';
import { PlaceForm } from './admin/PlaceForm';
import { CategoryForm } from './admin/CategoryForm';

interface AdminPageProps {
    onNavigate: (page: string) => void;
}

type Tab = 'places' | 'categories';
type View = 'list' | 'add';

export function AdminPage({ onNavigate }: AdminPageProps) {
    const [activeTab, setActiveTab] = useState<Tab>('places');
    const [view, setView] = useState<View>('list');

    const handleFormSuccess = () => {
        setView('list');
        // Reload data or refresh list
    };

    const renderContent = () => {
        if (view === 'add') {
            if (activeTab === 'places') {
                return <PlaceForm onSuccess={handleFormSuccess} onCancel={() => setView('list')} />;
            } else if (activeTab === 'categories') {
                return <CategoryForm onSuccess={handleFormSuccess} onCancel={() => setView('list')} />;
            }
        }

        // List view
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#2c3e50]">
                        {activeTab === 'places' && 'จัดการสถานที่'}
                        {activeTab === 'categories' && 'จัดการหมวดหมู่'}
                    </h2>
                    <button
                        onClick={() => setView('add')}
                        className="bg-[#7da87b] text-white px-6 py-3 rounded-lg hover:bg-[#6a9669] transition-colors flex items-center gap-2 font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        เพิ่มข้อมูล
                    </button>
                </div>

                <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">คลิก "เพิ่มข้อมูล" เพื่อเพิ่ม{activeTab === 'places' ? 'สถานที่' : 'หมวดหมู่'}ใหม่</p>
                    <p className="text-sm mt-2">รายการที่มีอยู่จะแสดงที่นี่</p>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#7da87b] to-[#8b9556] text-white">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => onNavigate('home')}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-3xl font-bold">Admin Panel</h1>
                    </div>
                    <p className="text-white/90 text-lg">จัดการข้อมูลสถานที่ท่องเที่ยวและหมวดหมู่</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex gap-1">
                        <button
                            onClick={() => {
                                setActiveTab('places');
                                setView('list');
                            }}
                            className={`px-6 py-4 font-medium transition-all relative flex items-center gap-2 ${activeTab === 'places'
                                ? 'text-[#7da87b] border-b-2 border-[#7da87b]'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <MapPin className="w-5 h-5" />
                            สถานที่
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('categories');
                                setView('list');
                            }}
                            className={`px-6 py-4 font-medium transition-all relative flex items-center gap-2 ${activeTab === 'categories'
                                ? 'text-[#7da87b] border-b-2 border-[#7da87b]'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Tag className="w-5 h-5" />
                            หมวดหมู่
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
                {renderContent()}
            </div>
        </div>
    );
}
