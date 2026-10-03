import React, { useState } from 'react';
import {
  GunlukVardiyaKontrol,
  HaftalikMekanikBakim,
  AylikMedikalKontrol,
  KontrolFormTipi,
  Arac,
  Kullanici,
} from '../types';
import {
  ClipboardCheck,
  Plus,
  Printer,
  Sparkles,
  Wrench,
  Activity,
  Fuel,
  CheckCircle2,
  AlertTriangle,
  Radio,
  UserCheck,
  Gauge,
  Search,
  Filter,
} from 'lucide-react';

interface ChecklistsViewProps {
  vehicles: Arac[];
  dailyChecklists: GunlukVardiyaKontrol[];
  weeklyChecklists: HaftalikMekanikBakim[];
  monthlyChecklists: AylikMedikalKontrol[];
  onOpenNewChecklist: (type: KontrolFormTipi) => void;
  currentUser: Kullanici;
}

export const ChecklistsView: React.FC<ChecklistsViewProps> = ({
  vehicles,
  dailyChecklists,
  weeklyChecklists,
  monthlyChecklists,
  onOpenNewChecklist,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<KontrolFormTipi>('gunluk');
  const [filterPlaka, setFilterPlaka] = useState<string>('Tümü');

  const filteredDaily = dailyChecklists.filter(
    (i) => filterPlaka === 'Tümü' || i.plaka === filterPlaka
  );
  const filteredWeekly = weeklyChecklists.filter(
    (i) => filterPlaka === 'Tümü' || i.plaka === filterPlaka
  );
  const filteredMonthly = monthlyChecklists.filter(
    (i) => filterPlaka === 'Tümü' || i.plaka === filterPlaka
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık & Aksiyonlar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-indigo-600" />
            3. Periyodik Kontrol Listeleri (Checklist) Arşivi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Günlük vardiya devir-teslim, haftalık mekanik bakım ve aylık medikal cihaz sağlık denetimleri.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs md:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Listeyi Yazdır / PDF Olarak Kaydet"
          >
            <Printer className="w-4 h-4" />
            Yazdır / PDF
          </button>
          <button
            onClick={() => onOpenNewChecklist(activeTab)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 text-xs md:text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Yeni Form Doldur
          </button>
        </div>
      </div>

      {/* Sekmeler ve Araç Filtresi */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex bg-slate-200/80 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('gunluk')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'gunluk'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Günlük Vardiya Teslim ({dailyChecklists.length})
          </button>
          <button
            onClick={() => setActiveTab('haftalik')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'haftalik'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Haftalık Mekanik ({weeklyChecklists.length})
          </button>
          <button
            onClick={() => setActiveTab('aylik')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'aylik'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Aylık Medikal Cihaz ({monthlyChecklists.length})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-medium text-slate-500">Ambulans:</span>
          <select
            value={filterPlaka}
            onChange={(e) => setFilterPlaka(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 text-slate-700"
          >
            <option value="Tümü">Tüm Ambulanslar</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.plaka}>
                🚑 {v.plaka}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. GÜNLÜK VARDİYA FORMLARI LİSTESİ */}
      {activeTab === 'gunluk' && (
        <div className="space-y-4">
          {filteredDaily.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm">
              Bu plakaya ait günlük vardiya teslim kaydı bulunamadı.
            </div>
          ) : (
            filteredDaily.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-slate-900 text-white font-mono font-bold text-sm rounded-lg">
                      🚑 {item.plaka}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">{item.tarih}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Kabin Temizliği:</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-200">
                      {item.temizlikDurumu}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Yakıt Durumu */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <Fuel className="w-4 h-4 text-indigo-600" /> Yakıt Durumu
                      </span>
                      <span className="font-mono font-bold text-slate-900">%{item.yakitDurumu}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.yakitDurumu < 25
                            ? 'bg-rose-500'
                            : item.yakitDurumu < 50
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${item.yakitDurumu}%` }}
                      />
                    </div>
                  </div>

                  {/* Elektronik & Siren */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="font-semibold text-slate-700 block mb-1">Telsiz & İkaz Durumu</span>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Tepe Lambası:</span>
                      <span className={`font-bold ${item.tepeLambasiCalisiyor ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {item.tepeLambasiCalisiyor ? '✅ Faal' : '❌ Arızalı'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Siren Sistemi:</span>
                      <span className={`font-bold ${item.sirenCalisiyor ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {item.sirenCalisiyor ? '✅ Faal' : '❌ Arızalı'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Telsiz:</span>
                      <span className={`font-bold ${item.telsizCalisiyor ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {item.telsizCalisiyor ? '✅ Faal' : '❌ Arızalı'}
                      </span>
                    </div>
                  </div>

                  {/* Tıbbi Sarfiyat & Malzeme */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="font-semibold text-slate-700 block mb-1">Temel Tıbbi Malzeme</span>
                    <div className="font-semibold text-slate-800">
                      {item.tibbiMalzemeEksikYok ? (
                        <span className="text-emerald-700">✅ Eksik Malzeme Yok</span>
                      ) : (
                        <span className="text-amber-700">⚠️ Eksik Bildirildi</span>
                      )}
                    </div>
                    {item.tibbiMalzemeEksikNotu && (
                      <p className="text-[11px] text-slate-600 italic">{item.tibbiMalzemeEksikNotu}</p>
                    )}
                  </div>
                </div>

                {/* Devir Teslim İmzaları */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100 text-slate-600">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    <span>Devreden: <strong className="text-slate-800">{item.devredenPersonel}</strong> ({item.devredenImza})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    <span>Devralan: <strong className="text-slate-800">{item.devralanPersonel}</strong> ({item.devralanImza})</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. HAFTALIK MEKANİK BAKIM FORMLARI */}
      {activeTab === 'haftalik' && (
        <div className="space-y-4">
          {filteredWeekly.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm">
              Bu plakaya ait haftalık mekanik bakım kaydı bulunamadı.
            </div>
          ) : (
            filteredWeekly.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-slate-900 text-white font-mono font-bold text-sm rounded-lg">
                      🚑 {item.plaka}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">{item.tarih}</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Bakım Yapan: <strong className="text-slate-900">{item.bakimiYapanPersonel}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Sıvılar ve Frenler */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                    <span className="font-semibold text-slate-700 block mb-1">Mekanik ve Sıvılar</span>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Motor Yağı:</span>
                      <span className="font-bold text-slate-800">{item.motorYagiSeviyesi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Silecek Suyu:</span>
                      <span className="font-bold text-slate-800">{item.silecekSuyu}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Fren Durumu:</span>
                      <span className="font-bold text-slate-800">{item.frenler}</span>
                    </div>
                  </div>

                  {/* Lastik Basınçları (PSI) */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                    <span className="font-semibold text-slate-700 block mb-1">Lastik Basınçları (PSI)</span>
                    <div className="grid grid-cols-2 gap-2 text-slate-600 font-mono">
                      <div>Ön Sol: <strong className="text-slate-900">{item.lastikBasinclariPsi.onSol} PSI</strong></div>
                      <div>Ön Sağ: <strong className="text-slate-900">{item.lastikBasinclariPsi.onSag} PSI</strong></div>
                      <div>Arka Sol: <strong className="text-slate-900">{item.lastikBasinclariPsi.arkaSol} PSI</strong></div>
                      <div>Arka Sağ: <strong className="text-slate-900">{item.lastikBasinclariPsi.arkaSag} PSI</strong></div>
                    </div>
                  </div>

                  {/* Lastik Diş Derinliği */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <span className="font-semibold text-slate-700 block">Lastik Diş Derinliği</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono text-slate-900">
                        {item.lastikDisDerinligiMm} mm
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {item.lastikDisDerinligiMm >= 4 ? '(Güvenli)' : '(Aşınmış)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{item.notlar || 'Periyodik kontrol tamamlandı.'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. AYLIK MEDİKAL CİHAZ KONTROL FORMLARI */}
      {activeTab === 'aylik' && (
        <div className="space-y-4">
          {filteredMonthly.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm">
              Bu plakaya ait aylık medikal kontrol kaydı bulunamadı.
            </div>
          ) : (
            filteredMonthly.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-slate-900 text-white font-mono font-bold text-sm rounded-lg">
                      🚑 {item.plaka}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">{item.tarih}</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Kontrol Eden: <strong className="text-slate-900">{item.kontrolEdenPersonel}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Batarya Sağlığı */}
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
                    <span className="font-semibold text-emerald-900 block mb-1">Batarya Sağlık Durumu</span>
                    <div className="font-bold text-slate-800">{item.bataryaSaglikDurumu}</div>
                    <span className="text-[11px] text-slate-500">Defibrilatör ve ventilatör akü testleri</span>
                  </div>

                  {/* Kalibrasyon Doğruluk Kontrolü */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="font-semibold text-slate-700 block mb-1">Kalibrasyon Süreleri</span>
                    <div className="font-bold">
                      {item.kalibrasyonSureleriKontrolEdildi ? (
                        <span className="text-emerald-700">✅ Süreler Kontrol Edildi & Onaylandı</span>
                      ) : (
                        <span className="text-amber-700">⚠️ Eksik/Süresi Dolan Cihaz Var</span>
                      )}
                    </div>
                  </div>

                  {/* Oksijen Tüpü Doluluk Barı */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Oksijen Tüpü Basıncı</span>
                      <span className="font-mono font-bold text-slate-900">{item.oksijenTupuDolulukBari} Bar</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.oksijenTupuDolulukBari >= 150 ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${(item.oksijenTupuDolulukBari / 250) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
