
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { SERVICES, COMPETITORS, COMPARISON_DATA, MARKET_STATS } from './constants';

// --- COMPONENTS ---

const FloatingWhatsApp = () => (
  <motion.a
    href="https://wa.me/966528900563877?text=السلام عليكم أبو سعد، أرغب في الحصول على استشارة لمشروعي"
    target="_blank"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.1 }}
    className="fixed bottom-6 left-6 z-[3000] w-14 h-14 gold-gradient rounded-full flex items-center justify-center text-[#07111F] shadow-2xl cursor-pointer"
  >
    <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.889 1.034 3.861 1.58 5.711 1.581h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </motion.a>
);

const CopyNotification = ({ show }: { show: boolean }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[5000] bg-green-500 text-white px-6 py-3 rounded-full shadow-xl font-bold text-sm flex items-center gap-2"
      >
        <span>✓</span> تم نسخ رابط الموقع لمشاركته
      </motion.div>
    )}
  </AnimatePresence>
);

const ContactModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      projectType: formData.get('projectType') as string,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "inquiries"), data);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); }, 4000);
    } catch (err) {
      setError('حدث خطأ في الإرسال. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-[#0D1E30] border border-[#C9A84C]/30 rounded-[2.5rem] p-8 shadow-2xl">
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white text-2xl">×</button>
            {success ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
                <h3 className="text-2xl font-bold font-cairo text-white mb-2">تم الإرسال بنجاح</h3>
                <p className="text-gray-400">سنتواصل معك يا أبو سعد في أقرب وقت.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold font-cairo text-[#C9A84C] mb-2">طلب استشارة مجانية</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">أدخل بياناتك وسنقوم بالتواصل معك لتقديم عرض سعر مخصص لمشروعك.</p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input name="name" type="text" placeholder="الاسم الكريم" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#C9A84C] outline-none transition-all" required />
                  <input name="phone" type="tel" placeholder="رقم الجوال (05xxxxxxx)" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#C9A84C] outline-none text-right font-mono transition-all" required />
                  <select name="projectType" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#C9A84C] outline-none appearance-none">
                    <option className="bg-[#0D1E30]">فيلا سكنية</option>
                    <option className="bg-[#0D1E30]">مبنى تجاري / مكاتب</option>
                    <option className="bg-[#0D1E30]">ترميم وتجديد</option>
                    <option className="bg-[#0D1E30]">أخرى</option>
                  </select>
                  {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                  <button disabled={loading} type="submit" className="w-full gold-gradient text-[#07111F] font-bold py-5 rounded-2xl mt-6 flex justify-center items-center gap-2 hover:brightness-110 active:scale-95 transition-all">
                    {loading ? <div className="w-5 h-5 border-2 border-[#07111F]/30 border-t-[#07111F] rounded-full animate-spin"></div> : 'إرسال الطلب الآن'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ onOpenContact, onShowNotify }: { onOpenContact: () => void, onShowNotify: () => void }) => {
  const handleCopyLink = () => {
    const url = "https://tastep1-e0770.web.app";
    navigator.clipboard.writeText(url);
    onShowNotify();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[2000] px-4 py-4 md:px-8">
      <div className="max-w-7xl mx-auto navy-glass rounded-[1.5rem] px-6 h-18 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center font-black text-[#07111F] text-xl font-cairo shadow-inner">ت</div>
          <div className="hidden sm:block">
            <span className="text-[#C9A84C] font-bold text-lg font-cairo block leading-tight">التشطيب الاحترافي</span>
            <span className="text-gray-500 text-[10px] font-bold">أبو سعد الأنصاري</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={handleCopyLink} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#C9A84C] text-xs font-bold hover:bg-white/10 transition-all">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            <span className="hidden xs:block">نسخ الرابط</span>
          </button>
          <button onClick={onOpenContact} className="gold-gradient text-[#07111F] px-6 py-2.5 rounded-xl text-sm font-black shadow-lg hover:scale-105 active:scale-95 transition-all">تواصل الآن</button>
        </div>
      </div>
    </nav>
  );
};

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showNotify, setShowNotify] = useState(false);

  const triggerNotify = () => {
    setShowNotify(true);
    setTimeout(() => setShowNotify(false), 3000);
  };

  return (
    <div className="bg-[#07111F] text-white">
      <Navbar onOpenContact={() => setIsContactOpen(true)} onShowNotify={triggerNotify} />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30 z-0"></div>
        <div className="relative z-10 max-w-4xl">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-block px-5 py-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-xs font-black mb-8 tracking-widest uppercase">★ الرياض - 2025</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-8xl font-black font-cairo mb-8 leading-[1.15]">
            ننفذ <span className="text-[#C9A84C]">أحلامكم</span><br />بدقة <span className="text-[#C9A84C]">عالمية</span>
          </motion.h1>
          <p className="text-gray-400 text-lg md:text-2xl mb-14 max-w-2xl mx-auto leading-relaxed">
            مشروع أبو سعد الأنصاري للتشطيبات الفاخرة. نقدم لك ضماناً حقيقياً ومتابعة لحظية لمشروعك عبر تطبيقنا الخاص من أي مكان.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button onClick={() => setIsContactOpen(true)} className="gold-gradient text-[#07111F] font-black py-5 px-14 rounded-2xl text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">اطلب عرض سعر</button>
            <a href="#services" className="bg-white/5 border border-white/10 py-5 px-14 rounded-2xl text-xl hover:bg-white/10 transition-all w-full sm:w-auto font-bold">خدماتنا</a>
          </div>
        </div>
        
        {/* Animated background blur */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[#C9A84C]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-[#C9A84C]/5 rounded-full blur-[100px] pointer-events-none"></div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 px-6 bg-[#0D1E30]/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black font-cairo mb-6">ماذا نقدم؟</h2>
            <div className="w-20 h-1 gold-gradient mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((s, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="p-10 rounded-[2rem] bg-[#07111F] border border-white/5 hover:border-[#C9A84C]/40 transition-all text-right shadow-xl">
                <div className="text-6xl mb-8">{s.icon}</div>
                <h3 className="text-2xl font-black font-cairo text-[#C9A84C] mb-4">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="flex justify-center order-2 lg:order-1">
            <div className="w-[300px] h-[600px] bg-gradient-to-b from-[#1A3050] to-[#0A1828] rounded-[3.5rem] border-[8px] border-[#C9A84C]/30 shadow-[0_0_50px_rgba(201,168,76,0.2)] relative animate-float p-6">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#07111F] rounded-b-2xl"></div>
              <div className="mt-10">
                <div className="text-[#C9A84C] font-black text-sm mb-8 font-cairo">تطبيق العميل 📱</div>
                <div className="bg-white/5 rounded-3xl p-5 mb-6 border border-white/10">
                  <div className="text-[10px] text-gray-500 mb-3 font-cairo">تقدم تنفيذ فيلا الرياض</div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full gold-gradient w-[85%]"></div>
                  </div>
                  <div className="flex justify-between mt-3 text-[10px] font-black">
                    <span className="text-[#C9A84C]">جاري تركيب السيراميك</span>
                    <span className="text-white">85%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['صور اليوم', 'الفواتير', 'الضمانات', 'المحادثة'].map(t => (
                    <div key={t} className="bg-white/5 rounded-2xl p-4 text-center border border-white/5 shadow-inner">
                      <div className="text-[11px] text-gray-300 font-black font-cairo">{t}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl md:text-7xl font-black font-cairo mb-10 leading-tight">مشروعك في جيبك</h2>
            <p className="text-gray-400 text-xl leading-relaxed mb-10">
              وفرنا لك تطبيقاً خاصاً يتيح لك متابعة كل صغيرة وكبيرة في مشروعك. صور وفيديوهات يومية، فواتير إلكترونية، وضمانات موثقة، كل ذلك بضغطة زر.
            </p>
            <div className="grid grid-cols-1 gap-6">
              {[
                { t: 'تقارير يومية مصورة', d: 'شاهد تقدم العمل يومياً وكأنك في الموقع.' },
                { t: 'إدارة مالية شفافة', d: 'أرشفة كاملة لجميع الدفعات والفواتير.' },
                { t: 'دعم فني مباشر', d: 'تواصل فوري مع مهندس المشروع الخاص بك.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-5 p-6 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-[#C9A84C] text-2xl font-black">★</div>
                  <div>
                    <h4 className="font-black text-white font-cairo text-lg mb-1">{item.t}</h4>
                    <p className="text-sm text-gray-500">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 px-6 text-center bg-gradient-to-b from-transparent to-[#C9A84C]/5 border-t border-[#C9A84C]/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-8xl font-black font-cairo mb-10 text-white leading-tight">ابدأ رحلة التميز الآن</h2>
          <p className="text-gray-400 text-xl mb-14 max-w-2xl mx-auto leading-relaxed">كن واحداً من عملاء أبو سعد الأنصاري المتميزين واحصل على تشطيب يفوق التوقعات.</p>
          <button onClick={() => setIsContactOpen(true)} className="gold-gradient text-[#07111F] font-black py-7 px-20 rounded-3xl text-3xl shadow-[0_20px_50px_rgba(201,168,76,0.4)] hover:scale-105 active:scale-95 transition-all">تواصل مباشرة</button>
        </div>
      </section>

      <footer className="py-16 px-6 text-center text-gray-600 text-sm border-t border-white/5 bg-[#050D17]">
        <div className="max-w-7xl mx-auto">
          <div className="text-[#C9A84C] font-black text-2xl font-cairo mb-4">التشطيب الاحترافي</div>
          <p className="mb-8">الرياض - المملكة العربية السعودية</p>
          <p>© 2025 جميع الحقوق محفوظة - مشروع أبو سعد الأنصاري</p>
        </div>
      </footer>

      <FloatingWhatsApp />
      <CopyNotification show={showNotify} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
