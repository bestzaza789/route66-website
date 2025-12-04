import { Heart, Target, Users, Compass } from 'lucide-react';

export function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'รักในท้องถิ่น',
      description: 'เราเชื่อว่าทุกพื้นที่มีเรื่องราวและความงามที่ควรค่าแก่การถูกค้นพบ',
      color: '#e67e22',
    },
    {
      icon: Target,
      title: 'แม่นยำและน่าเชื่อถือ',
      description: 'ข้อมูลทุกชิ้นผ่านการตรวจสอบจากทีมงานและชุมชนท้องถิ่น',
      color: '#7da87b',
    },
    {
      icon: Users,
      title: 'เพื่อชุมชน',
      description: 'สร้างโอกาสให้ธุรกิจท้องถิ่นและชุมชนได้รับการรู้จักมากขึ้น',
      color: '#5499c7',
    },
    {
      icon: Compass,
      title: 'ค้นพบอย่างง่ายดาย',
      description: 'ออกแบบให้ใช้งานง่าย สะดวกในการวางแผนเส้นทางการท่องเที่ยว',
      color: '#f9a825',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#7da87b] to-[#f9a825] text-white py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h1 className="mb-6">เกี่ยวกับ Route66</h1>
          <p className="text-xl opacity-95 leading-relaxed">
            เส้นทางแห่งความสุขที่จะพาคุณไปค้นพบความงดงามและเสน่ห์<br />
            ของทุกตำบลในจังหวัดพิษณุโลก
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-20">
        <div className="bg-white rounded-3xl p-10 md:p-16 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300">
          <h2 className="text-[#2c3e50] text-center mb-8">พันธกิจของเรา</h2>
          <p className="text-gray-700 text-center leading-relaxed text-lg">
            Route66 เกิดจากความตั้งใจที่จะเป็นสะพานเชื่อมระหว่างนักเดินทางกับสถานที่ดีๆ
            ในทุกมุมเมืองพิษณุโลก เราเชื่อว่าความสุขไม่ได้อยู่แค่ในจุดหมาย
            แต่อยู่ที่การเดินทางและการค้นพบสิ่งใหม่ๆ ในแต่ละวัน
            <br /><br />
            เราทำงานอย่างใกล้ชิดกับชุมชนท้องถิ่น เพื่อนำเสนอข้อมูลที่แม่นยำและเป็นประโยชน์
            สร้างโอกาสให้ธุรกิจขนาดเล็กและสถานที่น่าสนใจได้รับการรู้จักมากขึ้น
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white/50 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-[#2c3e50] text-center mb-12">ค่านิยมของเรา</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-5 shadow-md"
                  style={{ backgroundColor: `${value.color}15` }}
                >
                  <value.icon className="w-10 h-10" style={{ color: value.color }} />
                </div>
                <h3 className="text-[#2c3e50] mb-4 text-xl">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-20">
        <h2 className="text-[#2c3e50] mb-8">เรื่องราวของเรา</h2>
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            Route66 เริ่มต้นจากความรักในบ้านเกิดและความต้องการที่จะแบ่งปันความงามของพิษณุโลก
            กับทุกคน ชื่อ "Route66" ได้แรงบันดาลใจจากเส้นทาง Route 66 ในอเมริกา
            ที่เป็นสัญลักษณ์ของการผจญภัยและการค้นพบ
          </p>
          <p>
            เราเริ่มจากการรวบรวมข้อมูลสถานที่น่าสนใจในแต่ละตำบล
            ผ่านการลงพื้นที่และการสนทนากับชาวบ้าน เจ้าของร้าน และผู้ที่รักบ้านเกิด
            ทุกข้อมูลที่นำเสนอผ่านการตรวจสอบและได้รับการยืนยันจากชุมชนท้องถิ่น
          </p>
          <p>
            วันนี้ Route66 เป็นมากกว่าแค่เว็บไซต์ข้อมูลท่องเที่ยว
            เราคือชุมชนของคนที่รักในท้องถิ่นและต้องการแบ่งปันความสุขเล็กๆ
            ที่พบเจอในทุกมุมเมืองพิษณุโลก
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-20">
        <div className="bg-gradient-to-r from-[#7da87b] to-[#8b9556] rounded-3xl p-14 text-white text-center shadow-[var(--shadow-xl)]">
          <h2 className="mb-6">ร่วมเป็นส่วนหนึ่งของเรา</h2>
          <p className="text-xl opacity-95 mb-10 max-w-2xl mx-auto leading-relaxed">
            หากคุณมีสถานที่ดีๆ ที่อยากแนะนำ หรือต้องการร่วมงานกับเรา
            <br />
            เราพร้อมรับฟังและพัฒนาไปด้วยกัน
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:hello@route66phitsanulok.com"
              className="bg-white text-[#7da87b] px-10 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)] hover:-translate-y-0.5 font-semibold text-lg"
            >
              ติดต่อเรา
            </a>
            <a
              href="#"
              className="bg-white/20 backdrop-blur-sm text-white px-10 py-4 rounded-xl hover:bg-white/30 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 font-semibold text-lg"
            >
              ติดตามเราบน Facebook
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl text-[#7da87b] mb-2">9</div>
              <div className="text-gray-600">อำเภอ</div>
            </div>
            <div>
              <div className="text-4xl text-[#f9a825] mb-2">93</div>
              <div className="text-gray-600">ตำบล</div>
            </div>
            <div>
              <div className="text-4xl text-[#5499c7] mb-2">100+</div>
              <div className="text-gray-600">สถานที่</div>
            </div>
            <div>
              <div className="text-4xl text-[#e67e22] mb-2">1,000+</div>
              <div className="text-gray-600">ผู้เยี่ยมชม</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
