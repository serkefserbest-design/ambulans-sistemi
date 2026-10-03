import React from 'react';
import { 
  AlertTriangle, 
  Wrench, 
  CheckCircle2, 
  ShieldAlert, 
  User, 
  Laptop, 
  Smartphone, 
  ArrowRight,
  Info
} from 'lucide-react';

export const GuideView: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Başlık Kartı */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10">
          <Info className="w-64 h-64 -mt-10 -mr-10" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-black mb-4">Sistem Kullanım Kılavuzu</h1>
          <p className="text-indigo-100 text-lg">
            Şırnak 112 Ambulans & Medikal Ekipman Yönetim Sistemi'ne hoş geldiniz. 
            Aşağıdaki görsel anlatımları inceleyerek sistemin nasıl çalıştığını hızlıca öğrenebilirsiniz.
          </p>
        </div>
      </div>

      {/* Roller ve Yetkiler */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-600" />
          Kimler Ne Yapabilir? (Roller)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Personel Kartı */}
          <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">Sağlık Personeli</h3>
            <ul className="space-y-3 text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Kendi arıza kayıtlarını oluşturur.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Kendi arızasının güncel durumunu takip eder.
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <ShieldAlert className="w-5 h-5 text-rose-300" /> Diğer istasyonların/araçların arızalarını göremez.
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <ShieldAlert className="w-5 h-5 text-rose-300" /> İşlem geçmişi veya filo genel durumuna erişemez.
              </li>
            </ul>
          </div>

          {/* Yönetici Kartı */}
          <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-white">
            <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black mb-2">Yönetici (Admin)</h3>
            <ul className="space-y-3 text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Tüm sistemin istatistiklerini ve filoyu canlı izler.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Arızaları "Tamirde" veya "Çözüldü" olarak günceller.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Yeni personel kaydeder, yetkilerini düzenler.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Kasko, Sigorta ve Kalibrasyon takiplerini yapar.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Arıza Süreci Görsel İş Akışı */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-rose-600" />
          Arıza Bildirim Süreci Nasıl İşler?
        </h2>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm overflow-x-auto">
          <div className="min-w-[600px] flex items-center justify-between gap-4">
            
            {/* Adım 1 */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-3 border-4 border-white shadow-lg">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-800">1. Personel Bildirir</h4>
              <p className="text-xs text-slate-500 mt-1">Personel, uygulamadan ilgili aracı seçip sorunu yazar. Durum <span className="font-bold text-rose-600">ARIZADA</span> olur.</p>
            </div>

            <ArrowRight className="w-8 h-8 text-slate-300 flex-shrink-0" />

            {/* Adım 2 */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 border-4 border-white shadow-lg">
                <Wrench className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-800">2. Yönetici Onaylar</h4>
              <p className="text-xs text-slate-500 mt-1">Yönetici panelden arızayı görür. Müdahale başladığında durumu <span className="font-bold text-blue-600">TAMİRDE</span> olarak değiştirir.</p>
            </div>

            <ArrowRight className="w-8 h-8 text-slate-300 flex-shrink-0" />

            {/* Adım 3 */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3 border-4 border-white shadow-lg">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-800">3. Sorun Çözülür</h4>
              <p className="text-xs text-slate-500 mt-1">Araç/Ekipman onarıldığında yönetici çözüm notu yazar ve durumu <span className="font-bold text-emerald-600">ÇÖZÜLDÜ</span> yapar.</p>
            </div>

          </div>
        </div>
      </div>

      {/* Sık Sorulan Sorular */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Önemli Kurallar</h2>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-xl border border-slate-100 flex gap-3">
            <div className="mt-0.5 text-amber-500"><Info className="w-5 h-5" /></div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Girdiğim arızayı silemiyorum?</h4>
              <p className="text-xs text-slate-600 mt-1">Personeller girdikleri arızaları silemezler. Yanlış girdiyseniz yöneticinize bildirip sildirebilir veya düzeltmesini isteyebilirsiniz.</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100 flex gap-3">
            <div className="mt-0.5 text-amber-500"><Info className="w-5 h-5" /></div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Eski arızalarım kayboldu?</h4>
              <p className="text-xs text-slate-600 mt-1">Sistem kalabalığını önlemek için, bildirilen tüm arıza kayıtları 10 gün sonra otomatik olarak arşivlenir ve sistemden temizlenir.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
