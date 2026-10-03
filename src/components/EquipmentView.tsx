import React, { useState } from 'react';
import { MedikalEkipman, Arac, Kullanici } from '../types';
import { formatTRDate, getDaysRemaining, getStatusBadge } from '../utils/dateUtils';
import {
  Activity,
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
} from 'lucide-react';

interface EquipmentViewProps {
  equipment: MedikalEkipman[];
  vehicles: Arac[];
  onAddEquipment: () => void;
  onEditEquipment: (equipment: MedikalEkipman) => void;
  onDeleteEquipment: (id: string) => void;
  currentUser: Kullanici;
}

export const EquipmentView: React.FC<EquipmentViewProps> = ({
  equipment,
  vehicles,
  onAddEquipment,
  onEditEquipment,
  onDeleteEquipment,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlaka, setFilterPlaka] = useState<string>('Tümü');
  const [filterOnlyAlerts, setFilterOnlyAlerts] = useState<boolean>(false);

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch =
      eq.cihazAdi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.seriNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.bulunduguAracPlakasi.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlaka = filterPlaka === 'Tümü' || eq.bulunduguAracPlakasi === filterPlaka;

    const calDays = getDaysRemaining(eq.gelecekKalibrasyonTarihi);
    const sktDays = eq.sonKullanmaTarihi ? getDaysRemaining(eq.sonKullanmaTarihi) : 999;
    const isAlert = calDays <= 30 || sktDays <= 30 || eq.durum === 'Kalibrasyon Gerekli';

    if (filterOnlyAlerts && !isAlert) return false;

    return matchesSearch && matchesPlaka;
  });

  return (
    <div className="space-y-6">
      {/* Başlık ve Filtre Çubuğu */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600" />
            2. Medikal Ekipman Listesi ve Kalibrasyon Takibi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sağlık Bakanlığı standartlarına uygunluk, cihaz doğruluk kalibrasyonları, SKT ve araç eşleştirme tablosu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {currentUser.rol === 'Yönetici' && (
            <button
              onClick={onAddEquipment}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 text-xs md:text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Yeni Medikal Cihaz Ekle
            </button>
          )}
        </div>
      </div>

      {/* Arama ve Filtre Kontrolleri */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cihaz adı, Seri No (S/N) veya plaka ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Araç Filtresi */}
          <select
            value={filterPlaka}
            onChange={(e) => setFilterPlaka(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 text-slate-700"
          >
            <option value="Tümü">Tüm Araçlar & Depo</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.plaka}>
                🚑 {v.plaka}
              </option>
            ))}
            <option value="Yedek Depo">📦 Sadece Yedek Depo</option>
          </select>

          {/* Sadece Uyarılar Filtresi */}
          <button
            onClick={() => setFilterOnlyAlerts(!filterOnlyAlerts)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              filterOnlyAlerts
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {filterOnlyAlerts ? 'Uyarı Filtresi Aktif' : 'Sadece Yaklaşan Kalibrasyon / SKT'}
          </button>
        </div>
      </div>

      {/* Ekipman Tablosu */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Cihaz / Ekipman Adı</th>
                <th className="py-3.5 px-4">Seri No (S/N)</th>
                <th className="py-3.5 px-4">Bulunduğu Araç</th>
                <th className="py-3.5 px-4">Son Kalibrasyon</th>
                <th className="py-3.5 px-4">Gelecek Kalibrasyon</th>
                <th className="py-3.5 px-4">Son Kullanma (SKT)</th>
                <th className="py-3.5 px-4">Durum</th>
                <th className="py-3.5 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEquipment.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Arama kriterlerine uygun medikal ekipman bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredEquipment.map((eq) => {
                  const calDays = getDaysRemaining(eq.gelecekKalibrasyonTarihi);
                  const calBadge = getStatusBadge(calDays);

                  const sktDays = eq.sonKullanmaTarihi ? getDaysRemaining(eq.sonKullanmaTarihi) : null;
                  const sktBadge = sktDays !== null ? getStatusBadge(sktDays) : null;

                  return (
                    <tr key={eq.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Cihaz Adı ve Kategori */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{eq.cihazAdi}</div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {eq.kategori}
                        </span>
                      </td>

                      {/* Seri No */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {eq.seriNo}
                      </td>

                      {/* Bulunduğu Araç Plakası */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
                          {eq.bulunduguAracPlakasi.includes('Depo') ? (
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]">
                              📦 {eq.bulunduguAracPlakasi}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[11px]">
                              🚑 {eq.bulunduguAracPlakasi}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Son Kalibrasyon */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {formatTRDate(eq.sonKalibrasyonTarihi)}
                      </td>

                      {/* Gelecek Kalibrasyon */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-900 block">
                            {formatTRDate(eq.gelecekKalibrasyonTarihi)}
                          </span>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${calBadge.bgClass} ${calBadge.textClass} ${calBadge.borderClass}`}
                          >
                            {calBadge.text}
                          </span>
                        </div>
                      </td>

                      {/* Son Kullanma Tarihi (SKT) */}
                      <td className="py-3.5 px-4">
                        {eq.sonKullanmaTarihi ? (
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-900 block">
                              {formatTRDate(eq.sonKullanmaTarihi)}
                            </span>
                            {sktBadge && (
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${sktBadge.bgClass} ${sktBadge.textClass} ${sktBadge.borderClass}`}
                              >
                                {sktBadge.text}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Durum */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            eq.durum === 'Faal'
                              ? 'bg-emerald-100 text-emerald-800'
                              : eq.durum === 'Kalibrasyon Gerekli'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {eq.durum}
                        </span>
                      </td>

                      {/* İşlemler */}
                      <td className="py-3.5 px-4 text-right">
                        {currentUser.rol === 'Yönetici' && (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onEditEquipment(eq)}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Düzenle"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`${eq.cihazAdi} (${eq.seriNo}) kaydını silmek istediğinize emin misiniz?`)) {
                                  onDeleteEquipment(eq.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
