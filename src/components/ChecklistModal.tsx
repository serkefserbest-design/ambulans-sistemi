import React, { useState } from 'react';
import {
  Arac,
  GunlukVardiyaKontrol,
  HaftalikMekanikBakim,
  AylikMedikalKontrol,
  KontrolFormTipi,
} from '../types';
import { formatDateTimeTR } from '../utils/dateUtils';
import { X, ClipboardCheck, Fuel, Sparkles, Wrench, Activity } from 'lucide-react';

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Arac[];
  onSaveDaily: (item: GunlukVardiyaKontrol) => void;
  onSaveWeekly: (item: HaftalikMekanikBakim) => void;
  onSaveMonthly: (item: AylikMedikalKontrol) => void;
  defaultType?: KontrolFormTipi;
}

export const ChecklistModal: React.FC<ChecklistModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  onSaveDaily,
  onSaveWeekly,
  onSaveMonthly,
  defaultType = 'gunluk',
}) => {
  const [activeTab, setActiveTab] = useState<KontrolFormTipi>(defaultType);
  const [selectedPlaka, setSelectedPlaka] = useState<string>(vehicles[0]?.plaka || '');

  // Daily Form State
  const [dailyForm, setDailyForm] = useState({
    yakitDurumu: 80,
    temizlikDurumu: 'Mükemmel' as 'Mükemmel' | 'İyi' | 'Orta' | 'Yetersiz',
    tibbiMalzemeEksikYok: true,
    tibbiMalzemeEksikNotu: '',
    telsizCalisiyor: true,
    tepeLambasiCalisiyor: true,
    sirenCalisiyor: true,
    devredenPersonel: 'ATT / Şoför',
    devralanPersonel: 'Paramedik',
    devredenImza: 'Onaylandı',
    devralanImza: 'Teslim Alındı',
    notlar: '',
  });

  // Weekly Form State
  const [weeklyForm, setWeeklyForm] = useState({
    motorYagiSeviyesi: 'Uygun' as const,
    silecekSuyu: 'Tam' as const,
    frenler: 'Sorunsuz' as const,
    lastikBasinclariPsi: {
      onSol: 45,
      onSag: 45,
      arkaSol: 48,
      arkaSag: 48,
    },
    lastikDisDerinligiMm: 6.5,
    bakimiYapanPersonel: 'Filo Teknik Şefi',
    notlar: '',
  });

  // Monthly Form State
  const [monthlyForm, setMonthlyForm] = useState({
    bataryaSaglikDurumu: 'Mükemmel (%100)' as const,
    kalibrasyonSureleriKontrolEdildi: true,
    oksijenTupuDolulukBari: 195,
    kontrolEdenPersonel: 'Kıdemli Paramedik',
    notlar: '',
  });

  if (!isOpen) return null;

  const handleDailySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDaily({
      id: `chk-g-${Date.now()}`,
      tarih: formatDateTimeTR(new Date()),
      plaka: selectedPlaka,
      ...dailyForm,
    });
    onClose();
  };

  const handleWeeklySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveWeekly({
      id: `chk-h-${Date.now()}`,
      tarih: formatDateTimeTR(new Date()),
      plaka: selectedPlaka,
      ...weeklyForm,
    });
    onClose();
  };

  const handleMonthlySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMonthly({
      id: `chk-a-${Date.now()}`,
      tarih: formatDateTimeTR(new Date()),
      plaka: selectedPlaka,
      ...monthlyForm,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Periyodik Kontrol Formu Doldur</h3>
              <p className="text-xs text-slate-500">3. Kontrol Listeleri (Checklist) Yapısı</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Seçimi */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 p-1 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('gunluk')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'gunluk'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Günlük Vardiya Teslim
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('haftalik')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'haftalik'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Haftalık Mekanik Bakım
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('aylik')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'aylik'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Aylık Medikal Cihaz
          </button>
        </div>

        {/* Araç Seçimi */}
        <div className="px-6 pt-4 pb-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Kontrol Edilen Ambulans Plakası *
          </label>
          <select
            value={selectedPlaka}
            onChange={(e) => setSelectedPlaka(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 text-sm font-bold"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={`${v.plaka} - ${v.geciciIstasyon ? v.geciciIstasyon + ' (Geçici)' : v.istasyon}`}>
                🚑 {v.plaka} - {v.aracModeli.marka} {v.aracModeli.model} (KM: {v.guncelKm.toLocaleString('tr-TR')})
              </option>
            ))}
          </select>
        </div>

        {/* 1. GÜNLÜK VARDİYA FORMU */}
        {activeTab === 'gunluk' && (
          <form onSubmit={handleDailySubmit} className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-4">
              {/* Yakıt Durumu */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Fuel className="w-4 h-4 text-indigo-600" />
                    Yakıt Durumu (%{dailyForm.yakitDurumu})
                  </label>
                  <span className="text-xs font-bold text-indigo-700">
                    {dailyForm.yakitDurumu < 25 ? '⚠️ Yakıt Kritik Az' : dailyForm.yakitDurumu > 75 ? 'Dolu' : 'Normal'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={dailyForm.yakitDurumu}
                  onChange={(e) => setDailyForm({ ...dailyForm, yakitDurumu: parseInt(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>%0 (Boş)</span>
                  <span>%25</span>
                  <span>%50 (Yarım)</span>
                  <span>%75</span>
                  <span>%100 (Tam Dolu)</span>
                </div>
              </div>

              {/* Temizlik Durumu */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Kabin & Hasta Bölümü Temizliği</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Mükemmel', 'İyi', 'Orta', 'Yetersiz'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDailyForm({ ...dailyForm, temizlikDurumu: lvl })}
                      className={`py-1.5 px-2 text-xs rounded-lg border font-medium transition-all ${
                        dailyForm.temizlikDurumu === lvl
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tepe lambası, Telsiz, Siren Çalışırlığı */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Elektronik & İkaz Sistemleri Testi
              </label>
              <div className="grid grid-cols-3 gap-2">
                <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  dailyForm.tepeLambasiCalisiyor ? 'border-emerald-300 bg-emerald-50/60 text-emerald-900' : 'border-red-300 bg-red-50 text-red-700'
                }`}>
                  <input
                    type="checkbox"
                    checked={dailyForm.tepeLambasiCalisiyor}
                    onChange={(e) => setDailyForm({ ...dailyForm, tepeLambasiCalisiyor: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span className="text-xs font-semibold">Tepe Lambası & Flaşör</span>
                </label>

                <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  dailyForm.sirenCalisiyor ? 'border-emerald-300 bg-emerald-50/60 text-emerald-900' : 'border-red-300 bg-red-50 text-red-700'
                }`}>
                  <input
                    type="checkbox"
                    checked={dailyForm.sirenCalisiyor}
                    onChange={(e) => setDailyForm({ ...dailyForm, sirenCalisiyor: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span className="text-xs font-semibold">Siren & Anons</span>
                </label>

                <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  dailyForm.telsizCalisiyor ? 'border-emerald-300 bg-emerald-50/60 text-emerald-900' : 'border-red-300 bg-red-50 text-red-700'
                }`}>
                  <input
                    type="checkbox"
                    checked={dailyForm.telsizCalisiyor}
                    onChange={(e) => setDailyForm({ ...dailyForm, telsizCalisiyor: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span className="text-xs font-semibold">Sabit & El Telsizi</span>
                </label>
              </div>
            </div>

            {/* Temel Tıbbi Malzeme Eksik Kontrolü */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-slate-800">Temel Tıbbi Malzeme Eksik Kontrolü</span>
                <input
                  type="checkbox"
                  checked={dailyForm.tibbiMalzemeEksikYok}
                  onChange={(e) => setDailyForm({ ...dailyForm, tibbiMalzemeEksikYok: e.target.checked })}
                  className="rounded text-indigo-600 w-4 h-4"
                />
              </label>
              <p className="text-[11px] text-slate-500">
                {dailyForm.tibbiMalzemeEksikYok
                  ? '✅ Tüm ampul, serum, damar yolu ve pansuman sarfiyatı tam.'
                  : '⚠️ Eksik malzeme var, ikmal yapılması gerekmektedir.'}
              </p>

              {!dailyForm.tibbiMalzemeEksikYok && (
                <input
                  type="text"
                  placeholder="Eksik malzemeleri belirtin (Örn: 500ml SF, 20G Branül eksik)"
                  value={dailyForm.tibbiMalzemeEksikNotu}
                  onChange={(e) => setDailyForm({ ...dailyForm, tibbiMalzemeEksikNotu: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-amber-300 rounded-lg bg-white"
                />
              )}
            </div>

            {/* Devralan / Devreden Personel ve İmzalar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1">Devreden Personel</label>
                <input
                  type="text"
                  required
                  placeholder="Ad Soyad / Unvan"
                  value={dailyForm.devredenPersonel}
                  onChange={(e) => setDailyForm({ ...dailyForm, devredenPersonel: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white mb-2"
                />
                <input
                  type="text"
                  placeholder="Dijital Paraf / İmza"
                  value={dailyForm.devredenImza}
                  onChange={(e) => setDailyForm({ ...dailyForm, devredenImza: e.target.value })}
                  className="w-full px-2.5 py-1 text-[11px] font-mono border border-slate-200 rounded bg-white text-slate-600"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1">Devralan Personel</label>
                <input
                  type="text"
                  required
                  placeholder="Ad Soyad / Unvan"
                  value={dailyForm.devralanPersonel}
                  onChange={(e) => setDailyForm({ ...dailyForm, devralanPersonel: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white mb-2"
                />
                <input
                  type="text"
                  placeholder="Dijital Paraf / İmza"
                  value={dailyForm.devralanImza}
                  onChange={(e) => setDailyForm({ ...dailyForm, devralanImza: e.target.value })}
                  className="w-full px-2.5 py-1 text-[11px] font-mono border border-slate-200 rounded bg-white text-slate-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
              >
                Vardiya Formunu Onayla & Kaydet
              </button>
            </div>
          </form>
        )}

        {/* 2. HAFTALIK MEKANİK BAKIM */}
        {activeTab === 'haftalik' && (
          <form onSubmit={handleWeeklySubmit} className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Motor Yağı Seviyesi</label>
                <select
                  value={weeklyForm.motorYagiSeviyesi}
                  onChange={(e) => setWeeklyForm({ ...weeklyForm, motorYagiSeviyesi: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                >
                  <option value="Uygun">🟢 Uygun (Çubuk seviyesinde)</option>
                  <option value="Eksik">🟡 Eksik (İlave Gerekir)</option>
                  <option value="Kritik">🔴 Kritik Düşük (Kullanılamaz)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Silecek Suyu</label>
                <select
                  value={weeklyForm.silecekSuyu}
                  onChange={(e) => setWeeklyForm({ ...weeklyForm, silecekSuyu: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                >
                  <option value="Tam">🟢 Tam Dolu</option>
                  <option value="Eksik">🟡 Eksik</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fren Durumu</label>
                <select
                  value={weeklyForm.frenler}
                  onChange={(e) => setWeeklyForm({ ...weeklyForm, frenler: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                >
                  <option value="Sorunsuz">🟢 Sorunsuz</option>
                  <option value="Kontrol Gerekli">🟡 Kontrol Gerekli (Ses/Pedal)</option>
                  <option value="Kritik">🔴 Kritik (Aşınmış/Balata)</option>
                </select>
              </div>
            </div>

            {/* Lastik Basınçları (PSI) */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Lastik Basınçları (PSI) Kontrolü
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <span className="block text-[11px] text-slate-500 mb-0.5">Ön Sol (PSI)</span>
                  <input
                    type="number"
                    value={weeklyForm.lastikBasinclariPsi.onSol}
                    onChange={(e) =>
                      setWeeklyForm({
                        ...weeklyForm,
                        lastikBasinclariPsi: { ...weeklyForm.lastikBasinclariPsi, onSol: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs font-mono border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 mb-0.5">Ön Sağ (PSI)</span>
                  <input
                    type="number"
                    value={weeklyForm.lastikBasinclariPsi.onSag}
                    onChange={(e) =>
                      setWeeklyForm({
                        ...weeklyForm,
                        lastikBasinclariPsi: { ...weeklyForm.lastikBasinclariPsi, onSag: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs font-mono border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 mb-0.5">Arka Sol (PSI)</span>
                  <input
                    type="number"
                    value={weeklyForm.lastikBasinclariPsi.arkaSol}
                    onChange={(e) =>
                      setWeeklyForm({
                        ...weeklyForm,
                        lastikBasinclariPsi: { ...weeklyForm.lastikBasinclariPsi, arkaSol: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs font-mono border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 mb-0.5">Arka Sağ (PSI)</span>
                  <input
                    type="number"
                    value={weeklyForm.lastikBasinclariPsi.arkaSag}
                    onChange={(e) =>
                      setWeeklyForm({
                        ...weeklyForm,
                        lastikBasinclariPsi: { ...weeklyForm.lastikBasinclariPsi, arkaSag: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs font-mono border rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Lastik Diş Derinliği & Sorumlu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lastik Diş Derinliği (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weeklyForm.lastikDisDerinligiMm}
                  onChange={(e) => setWeeklyForm({ ...weeklyForm, lastikDisDerinligiMm: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl bg-white"
                />
                <span className="text-[11px] text-slate-400">Yasal minimum 3.0 mm (Önerilen &gt; 4.0 mm)</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bakımı Yapan Teknisyen / Şoför
                </label>
                <input
                  type="text"
                  required
                  value={weeklyForm.bakimiYapanPersonel}
                  onChange={(e) => setWeeklyForm({ ...weeklyForm, bakimiYapanPersonel: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
              >
                Mekanik Kontrolü Kaydet
              </button>
            </div>
          </form>
        )}

        {/* 3. AYLIK MEDİKAL CİHAZ KONTROLÜ */}
        {activeTab === 'aylik' && (
          <form onSubmit={handleMonthlySubmit} className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tüm Cihazların Batarya Sağlık Durumu
                </label>
                <select
                  value={monthlyForm.bataryaSaglikDurumu}
                  onChange={(e) => setMonthlyForm({ ...monthlyForm, bataryaSaglikDurumu: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium"
                >
                  <option value="Mükemmel (%100)">🟢 Mükemmel (%100 Şarj Kapasitesi)</option>
                  <option value="İyi (%80-%99)">🟡 İyi (%80-%99 Arası Normal)</option>
                  <option value="Değişim Gerekli (<%80)">🔴 Değişim Gerekli (Batarya Ömrü Düşük)</option>
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Defibrilatör, ventilatör ve aspiratör bataryalarının şarj testleri
                </span>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={monthlyForm.kalibrasyonSureleriKontrolEdildi}
                    onChange={(e) =>
                      setMonthlyForm({ ...monthlyForm, kalibrasyonSureleriKontrolEdildi: e.target.checked })
                    }
                    className="rounded text-emerald-600 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Kalibrasyon ve metrolojik doğruluk süreleri tek tek kontrol edildi
                  </span>
                </label>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Oksijen Tüpü Doluluk Oranı ({monthlyForm.oksijenTupuDolulukBari} Bar)
                  </label>
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    {monthlyForm.oksijenTupuDolulukBari >= 150 ? 'Dolu / Güvenli' : '⚠️ Dolum Yapılmalı'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="250"
                  step="5"
                  value={monthlyForm.oksijenTupuDolulukBari}
                  onChange={(e) => setMonthlyForm({ ...monthlyForm, oksijenTupuDolulukBari: parseInt(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>0 Bar</span>
                  <span>100 Bar</span>
                  <span>150 Bar (Min)</span>
                  <span>200 Bar (Standart)</span>
                  <span>250 Bar</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kontrol Eden Sağlık Personeli / Paramedik *
              </label>
              <input
                type="text"
                required
                value={monthlyForm.kontrolEdenPersonel}
                onChange={(e) => setMonthlyForm({ ...monthlyForm, kontrolEdenPersonel: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                Aylık Medikal Formu Kaydet
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
