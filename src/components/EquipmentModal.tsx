import React, { useState, useEffect } from 'react';
import { MedikalEkipman, Arac } from '../types';
import { X, Activity, ShieldCheck, Calendar } from 'lucide-react';

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipment: MedikalEkipman) => void;
  vehicles: Arac[];
  initialEquipment?: MedikalEkipman | null;
}

const COMMON_DEVICES = [
  'Bifazik Defibrilatör & Monitör',
  'Transport Ventilatör (Solunum Cihazı)',
  'Ana Sedye ve Çok Noktalı Emniyet Kemeri',
  'Sabit 10L Medikal Oksijen Tüpü (200 Bar)',
  'Taşınabilir 2L Oksijen Tüpü',
  'Acil Müdahale & İlk Yardım Çantası (Kit-A)',
  'Otomatik Eksternal Defibrilatör (OED / AED)',
  'Mekanik Göğüs Kompresyon Cihazı (LUCAS 3)',
  'Vakum Aspiratör Cihazı',
  'Kombinasyon Sandalye Sedye',
  'Faraş (Scoop) Sedye & Vakum Yatak',
  'Boyunluk & Omurga Tahtası Seti',
];

export const EquipmentModal: React.FC<EquipmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vehicles,
  initialEquipment,
}) => {
  const [formData, setFormData] = useState<MedikalEkipman>({
    id: '',
    cihazAdi: COMMON_DEVICES[0],
    seriNo: '',
    sonKalibrasyonTarihi: '',
    gelecekKalibrasyonTarihi: '',
    sonKullanmaTarihi: '',
    bulunduguAracPlakasi: '',
    kategori: 'Yaşam Destek',
    durum: 'Faal',
  });

  useEffect(() => {
    if (initialEquipment) {
      setFormData(initialEquipment);
    } else {
      setFormData({
        id: `eq-${Date.now()}`,
        cihazAdi: COMMON_DEVICES[0],
        seriNo: '',
        sonKalibrasyonTarihi: '',
        gelecekKalibrasyonTarihi: '',
        sonKullanmaTarihi: '',
        bulunduguAracPlakasi: vehicles[0]?.plaka || 'Yedek Depo',
        kategori: 'Yaşam Destek',
        durum: 'Faal',
      });
    }
  }, [initialEquipment, isOpen, vehicles]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cihazAdi.trim() || !formData.seriNo.trim()) {
      alert('Lütfen Cihaz Adı ve Seri Numarasını (S/N) giriniz.');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {initialEquipment ? 'Medikal Cihazı Düzenle' : 'Yeni Medikal Ekipman Ekle'}
              </h3>
              <p className="text-xs text-slate-500">2. Medikal Ekipman Listesi & Kalibrasyon Takibi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Cihaz Adı ve Seçimi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Cihaz / Ekipman Adı *
            </label>
            <input
              type="text"
              required
              list="common-devices"
              placeholder="Örn: Bifazik Defibrilatör"
              value={formData.cihazAdi}
              onChange={(e) => setFormData({ ...formData, cihazAdi: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800 text-sm font-medium"
            />
            <datalist id="common-devices">
              {COMMON_DEVICES.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
            <p className="text-[11px] text-slate-500 mt-1">Defibrilatör, Ventilatör, Sedye, Oksijen Tüpü, İlk Yardım Seti vb.</p>
          </div>

          {/* Seri No ve Kategori */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Seri Numarası (S/N) *
              </label>
              <input
                type="text"
                required
                placeholder="Örn: SN-998210-TR"
                value={formData.seriNo}
                onChange={(e) => setFormData({ ...formData, seriNo: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 font-mono text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
              <span className="text-[11px] text-slate-400">Benzersiz üretici kodu</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Kategori
              </label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800 text-sm"
              >
                <option value="Yaşam Destek">Yaşam Destek (Defibrilatör, CPR vb.)</option>
                <option value="Solunum / Gaz">Solunum / Gaz (Ventilatör, O2 Tüpü)</option>
                <option value="Taşıma / Sabitleme">Taşıma / Sabitleme (Sedye, Yatak)</option>
                <option value="Sarf / İlkyardım">Sarf / İlkyardım Seti</option>
                <option value="Monitörizasyon">Monitörizasyon</option>
              </select>
            </div>
          </div>

          {/* Bulunduğu Araç Plakası */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Bulunduğu Araç Plakası *
            </label>
            <select
              value={formData.bulunduguAracPlakasi}
              onChange={(e) => setFormData({ ...formData, bulunduguAracPlakasi: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800 text-sm font-semibold"
            >
              <option value="Yedek Depo (Araç Dışı)">📦 Yedek Depo (Herhangi bir araca tahsis edilmemiş)</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.plaka}>
                  🚑 {v.plaka} - {v.aracModeli.marka} {v.aracModeli.model}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Ekipmanın hangi ambulansta olduğunu takip etmek için kullanılır.
            </span>
          </div>

          {/* Kalibrasyon Tarihleri */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-3">
            <h4 className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Sağlık Bakanlığı Kalibrasyon Takibi
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Son Kalibrasyon Tarihi</label>
                <input
                  type="date"
                  value={formData.sonKalibrasyonTarihi}
                  onChange={(e) => setFormData({ ...formData, sonKalibrasyonTarihi: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-semibold text-emerald-900">
                  Gelecek Kalibrasyon Tarihi *
                </label>
                <input
                  type="date"
                  required
                  value={formData.gelecekKalibrasyonTarihi}
                  onChange={(e) => setFormData({ ...formData, gelecekKalibrasyonTarihi: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-emerald-300 rounded-lg bg-white font-medium"
                />
              </div>
            </div>
            <p className="text-[11px] text-emerald-700">
              Cihazın doğruluk kontrolünün yapılacağı sonraki resmi test tarihi.
            </p>
          </div>

          {/* Son Kullanma Tarihi (SKT) ve Durum */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Son Kullanma Tarihi (SKT)
              </label>
              <input
                type="date"
                value={formData.sonKullanmaTarihi}
                onChange={(e) => setFormData({ ...formData, sonKullanmaTarihi: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800 text-sm"
              />
              <span className="text-[11px] text-slate-400">
                İlk yardım çantası ilaçları ve O2 tüp hidrostatik test SKT'si
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Cihaz Durumu
              </label>
              <select
                value={formData.durum}
                onChange={(e) => setFormData({ ...formData, durum: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800 text-sm font-medium"
              >
                <option value="Faal">🟢 Faal (Kullanıma Uygun)</option>
                <option value="Kalibrasyon Gerekli">🟡 Kalibrasyon Gerekli / Süresi Yakın</option>
                <option value="Arızalı">🔴 Arızalı (Kullanım Dışı)</option>
                <option value="Bakımda">🔵 Teknik Serviste / Bakımda</option>
              </select>
            </div>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              {initialEquipment ? 'Güncelle' : 'Ekipmanı Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
