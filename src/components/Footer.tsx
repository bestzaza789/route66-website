import { MapPin, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#2c3e50] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#7da87b] to-[#f9a825] rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <div>Route66</div>
                <div className="text-sm text-gray-400">เส้นทางแห่งความสุข</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              ค้นพบความสุขเล็กๆ...ในทุกตำบลของพิษณุโลก
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">ลิงก์ด่วน</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>หน้าแรก</li>
              <li>ค้นหาตามอำเภอ</li>
              <li>ค้นหาตามหมวดหมู่</li>
              <li>เกี่ยวกับเรา</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4">ติดต่อเรา</h4>
            <p className="text-sm text-gray-400">
              Email: hello@route66phitsanulok.com<br />
              Facebook: Route66 Phitsanulok<br />
              Instagram: @route66_phitsanulok
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p className="flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-[#e67e22]" fill="#e67e22" /> for Phitsanulok
          </p>
          <p className="mt-2">© 2025 Route66. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
