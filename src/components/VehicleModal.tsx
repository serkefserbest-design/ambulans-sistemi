import React, { useState, useEffect } from 'react';
import { Arac, AracDurumu, SIRNAK_ILCELER, ISTASYON_GRUPLARI } from '../types';
import { X, Truck, ShieldCheck, Calendar, Hash, Gauge, MapPin, ArrowLeftRight, CreditCard, Stethoscope } from 'lucide-react';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: Arac) => void;
  initialVehicle?: Arac | null;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialVehicle,
}) => {
  const [formData, setFormData] = useState<Arac>({
    id: '',
    plaka: '',
    aracModeli: { marka: '', model: '', yil: new Date().getFullYear() },
    ruhsatBilgileri: { sasiNo: '', motorNo: '', belgeSeriNo: '' },
    kaskoBaslangicTarihi: '',
    kaskoBitisTarihi: '',
    trafikSigortasiBaslangicTarihi: '',
    trafikSigortasiBitisTarihi: '',
    guncelKm: 0,
    durum: 'Aktif',
    istasyon: 'ŞIRNAK MERKEZ 1 (7010)',
    geciciIstasyon: '',
    ilce: 'Merkez',
  });

  useEffect(() => {
    if (initialVehicle) {
      setFormData({
        ...initialVehicle,
        geciciIstasyon: initialVehicle.geciciIstasyon || '',
      });
    } else {
      setFormData({
        id: `veh-${Date.now()}`,
        plaka: '',
        aracModeli: { marka: 'Mercedes-Benz', model: 'Sprinter 319 CDI', yil: 2023 },
        ruhsatBilgileri: { sasiNo: '', motorNo: '', belgeSeriNo: '' },
        kaskoBaslangicTarihi: '',
        kaskoBitisTarihi: '',
        trafikSigortasiBaslangicTarihi: '',
        trafikSigortasiBitisTarihi: '',
        sonBakimKm: undefined,
        guncelKm: 0,
        durum: 'Aktif',
        istasyon: 'ŞIRNAK MERKEZ 1 (7010)',
        geciciIstasyon: '',
        ilce: 'Merkez',
      });
    }
  }, [initialVehicle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.plaka.trim()) {
      alert('Lütfen araç plakasını giriniz.');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-hidden">
      <div className="bg-slate-50 rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full flex flex-col max-h-full animate-in zoom-in-95 duration-200">
        
        {/* Sticky Header */}
        <div className="flex-none flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 rounded-t-2xl z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-xl shadow-lg shadow-rose-500/30">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                {initialVehicle ? 'Ambulans Kaydını Düzenle' : 'Yeni Ambulans Ekle'}
              </h3>
              <p className="text-sm font-medium text-slate-500">Araç temel bilgileri, ruhsat, sigorta ve istasyon verileri</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form id="vehicleForm" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* SOL KOLON */}
              <div className="space-y-6">
                
                {/* 1. KİMLİK & DURUM */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Hash className="w-4 h-4 text-rose-500" />
                    Kimlik & Durum
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Plaka *</label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: 73 AA 111"
                        value={formData.plaka}
                        onChange={(e) => setFormData({ ...formData, plaka: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900 font-mono font-black text-base tracking-widest transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Durum</label>
                      <select
                        value={formData.durum}
                        onChange={(e) => setFormData({ ...formData, durum: e.target.value as AracDurumu })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800 font-bold text-sm transition-all"
                      >
                        <option value="Aktif">🟢 Aktif (Hazır)</option>
                        <option value="Görevde">🔵 Görevde (Vakada)</option>
                        <option value="Yedek">🔄 Yedek (Havuzda)</option>
                        <option value="Bakımda">🟡 Bakımda (Sanayide)</option>
                        <option value="Serviste">🔴 Serviste (Arızalı)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. MARKA & RUHSAT */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Truck className="w-4 h-4 text-blue-500" />
                    Araç & Ruhsat Bilgileri
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Marka</label>
                      <input
                        type="text"
                        value={formData.aracModeli.marka}
                        onChange={(e) => setFormData({ ...formData, aracModeli: { ...formData.aracModeli, marka: e.target.value } })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 text-sm transition-all"
                        placeholder="Örn: Mercedes"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Model / Tip</label>
                      <input
                        type="text"
                        value={formData.aracModeli.model}
                        onChange={(e) => setFormData({ ...formData, aracModeli: { ...formData.aracModeli, model: e.target.value } })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 text-sm transition-all"
                        placeholder="Örn: Sprinter 319"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Model Yılı</label>
                      <input
                        type="number"
                        value={formData.aracModeli.yil}
                        onChange={(e) => setFormData({ ...formData, aracModeli: { ...formData.aracModeli, yil: parseInt(e.target.value) || 2023 } })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Belge Seri No</label>
                      <input
                        type="text"
                        value={formData.ruhsatBilgileri.belgeSeriNo}
                        onChange={(e) => setFormData({ ...formData, ruhsatBilgileri: { ...formData.ruhsatBilgileri, belgeSeriNo: e.target.value.toUpperCase() } })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 font-mono text-xs transition-all"
                        placeholder="Örn: AA 123456"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Şasi Numarası</label>
                      <input
                        type="text"
                        value={formData.ruhsatBilgileri.sasiNo}
                        onChange={(e) => setFormData({ ...formData, ruhsatBilgileri: { ...formData.ruhsatBilgileri, sasiNo: e.target.value.toUpperCase() } })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 font-mono text-xs transition-all"
                        placeholder="17 Haneli Şasi No"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* SAĞ KOLON */}
              <div className="space-y-6">
                
                {/* 3. GÖREV YERİ (İSTASYON) */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <MapPin className="w-32 h-32 text-indigo-900" />
                  </div>
                  <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3 relative z-10">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    Görev Yeri Bilgileri
                  </h4>
                  <div className="space-y-4 relative z-10">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Bağlı Bulunduğu İlçe</label>
                      <select
                        value={formData.ilce || ''}
                        onChange={(e) => setFormData({ ...formData, ilce: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 font-bold text-sm transition-all"
                      >
                        <option value="" disabled>İlçe Seçiniz</option>
                        {SIRNAK_ILCELER.map(ilce => (
                          <option key={ilce} value={ilce}>{ilce}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Kayıtlı (Asil) İstasyon *</label>
                      
                      <select
                        required
                        value={formData.istasyon}
                        onChange={(e) => setFormData({ ...formData, istasyon: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 font-bold text-sm transition-all"
                      >
                        <option value="" disabled>İstasyon Seçiniz</option>
                        {Object.entries(ISTASYON_GRUPLARI).map(([ilce, istasyonlar]) => (
                          <optgroup key={ilce} label={ilce}>
                            {istasyonlar.map(ist => (
                              <option key={ist} value={ist}>{ist}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>

                    </div>
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <label className="block text-xs font-black text-amber-800 mb-1.5 flex items-center gap-1.5">
                        <ArrowLeftRight className="w-4 h-4" /> Geçici (Emanet) İstasyon
                      </label>
                      
                      <select
                        value={formData.geciciIstasyon || ''}
                        onChange={(e) => setFormData({ ...formData, geciciIstasyon: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-amber-900 font-bold text-sm transition-all"
                      >
                        <option value="">-- Kendi İstasyonunda --</option>
                        {Object.entries(ISTASYON_GRUPLARI).map(([ilce, istasyonlar]) => (
                          <optgroup key={ilce} label={ilce}>
                            {istasyonlar.map(ist => (
                              <option key={ist} value={ist}>{ist}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>

                      <p className="text-[10px] text-amber-700/80 mt-2 font-medium">Bu araç kendi istasyonu dışında kullanılıyorsa doldurun. Değilse boş bırakın.</p>
                    </div>
                  </div>
                </div>

                {/* 4. SİGORTA & KİLOMETRE */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
                    <CreditCard className="w-4 h-4 text-emerald-500" />
                    Kasko, Sigorta ve KM
                  </h4>
                  
                  <div className="space-y-4">
                    {/* KM Bilgileri */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                          <Gauge className="w-3 h-3" /> GÜNCEL KM *
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.guncelKm}
                          onChange={(e) => setFormData({ ...formData, guncelKm: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-mono font-bold text-sm transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                          <Stethoscope className="w-3 h-3" /> SON BAKIM KM
                        </label>
                        <input
                          type="number"
                          value={formData.sonBakimKm || ''}
                          onChange={(e) => setFormData({ ...formData, sonBakimKm: parseInt(e.target.value) || undefined })}
                          placeholder="Örn: 140000"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-mono font-bold text-sm transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                          <Stethoscope className="w-3 h-3" /> SONRAKİ HEDEF
                        </label>
                        <input
                          type="number"
                          value={formData.sonrakiBakimKm || ''}
                          onChange={(e) => setFormData({ ...formData, sonrakiBakimKm: parseInt(e.target.value) || undefined })}
                          placeholder="Örn: 150000"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-mono font-bold text-sm transition-all"
                        />
                      </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* KASKO */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">KASKO BAŞLANGIÇ</label>
                        <input
                          type="date"
                          value={formData.kaskoBaslangicTarihi || ''}
                          onChange={(e) => setFormData({ ...formData, kaskoBaslangicTarihi: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 text-sm transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">KASKO BİTİŞ *</label>
                        <input
                          type="date"
                          required
                          value={formData.kaskoBitisTarihi}
                          onChange={(e) => setFormData({ ...formData, kaskoBitisTarihi: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 text-sm transition-all"
                        />
                      </div>
                    </div>

                    {/* TRAFİK SİGORTASI */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">SİGORTA BAŞLANGIÇ</label>
                        <input
                          type="date"
                          value={formData.trafikSigortasiBaslangicTarihi || ''}
                          onChange={(e) => setFormData({ ...formData, trafikSigortasiBaslangicTarihi: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 text-sm transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">SİGORTA BİTİŞ *</label>
                        <input
                          type="date"
                          required
                          value={formData.trafikSigortasiBitisTarihi}
                          onChange={(e) => setFormData({ ...formData, trafikSigortasiBitisTarihi: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 text-sm transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </form>
        </div>

        {/* Sticky Footer */}
        <div className="flex-none px-6 py-5 bg-white border-t border-slate-200 rounded-b-2xl flex items-center justify-end gap-3 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            form="vehicleForm"
            className="px-8 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 rounded-xl shadow-lg shadow-rose-500/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Truck className="w-5 h-5" />
            {initialVehicle ? 'Değişiklikleri Kaydet' : 'Sisteme Ekle'}
          </button>
        </div>

      </div>
    </div>
  );
};
